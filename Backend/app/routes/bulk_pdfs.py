from .. import app
from flask import Flask, request, jsonify 
import os
import pdfplumber
import requests
import logging
import re

def split_text(text):
    try:
        split_text = re.split(r'@@@', text)
        return split_text
    except Exception as e:
        logging.error(f"Error splitting text: {e}")
        return []

def prompt(conversation):
    # system_message = (
    #     "The above convo deals with a car dealing process and I want it to be summarized in the following json format: "
    #     "Customer Requirements for a Car: CarType(Hatchback, SUV, Sedan), FuelType, Color, Distance Travelled, MakeYear, "
    #     "Transmission Type. 2 Company Policies Discussed: FreeRCTransfer, 5-DayMoney Back Guarantee, FreeRSAfor One Year, "
    #     "Return Policy. 3. Customer Objection: Refurbishment Quality, CarIssues, Price Issues, Customer Experience Issues "
    #     "(e.g., long wait time, salesperson behaviour). Response should contain the proper json format that can be parsed using json parser."
    #     "the above given is just a sample format and you can add further fields if you find more informational data from the customer that the company can use on the passage"
    #     "further fields you find can be added to a key named extras within which you can give every values as an array and  the response key must contain only the json of all the details mentioned in the given passage so than it can be parsed using a json parser"
    #     "never start the response with here is the summary of the json or something like this. Please do not include any other text like Here is a summary or anything. In the response only JSON should be present"
    # )
    # system_message = (
    #     "The above convo deals with a car dealing process and I want it to be summarized in a standardized json format with 4 keys -  Customer requirements, Company policies, Customer objections, Extras."
    #     "Examples of Customer Requirements for a Car: CarType(Hatchback, SUV, Sedan), FuelType, Color, Distance Travelled, MakeYear, Transmission Type."
    #     "Examples of Company Policies Discussed: FreeRCTransfer, 5-DayMoney Back Guarantee, FreeRSAfor One Year, Return Policy. "
    #     "Examples of Customer Objection: Refurbishment Quality, CarIssues, Price Issues, Customer Experience Issues, (e.g., long wait time, salesperson behaviour). "
    #     "Extras are any other information that you find. Responses should contain the proper json format that can be parsed using json parser and must contain similar keys across different responses."
    #     "the response key must contain only the json of all the details mentioned in the given passage so than it can be parsed using a json parser"
    #     "never start the response with here is the summary of the json or something like this. Please do not include any other text like Here is a summary or anything. In the response only JSON should be present"
    # )
    system_message = (
    "The conversation provided involves a car dealing process and should be summarized into a standardized JSON format with the following keys: "
    "1. Customer Requirements: Examples include CarType (Hatchback, SUV, Sedan), FuelType, Color, Distance Travelled, MakeYear, Transmission Type. "
    "2. Company Policies: Examples include FreeRCTransfer, 5-DayMoney Back Guarantee, FreeRSAfor One Year, Return Policy. "
    "3. Customer Objections: Examples include Refurbishment Quality, CarIssues, Price Issues, Customer Experience Issues (e.g., long wait time, salesperson behavior). "
    "4. Extras: Any other relevant information that can be valuable for the company, represented as an array of key-value pairs. "
    "The response should contain only the JSON data in a format that can be parsed using a JSON parser, following this structure: "
    "{\"Customer Requirements\": {...}, \"Company Policies\": {...}, \"Customer Objections\": {...}, \"Extras\": {...}} "
    "Avoid including any introductory text such as 'Here is the summary' or 'The JSON is as follows.' Only the JSON output should be present."
    )

    prompt_data = {
        "model": "llama3.1",
        "prompt": conversation,
        "system": system_message,
        "stream": False
    }

    try:
        external_url = "http://<replace-with-your-url>/api/generate"
        external_response = requests.post(external_url, json=prompt_data)

        if external_response.status_code == 200:
            response_data = external_response.json()
            if "response" in response_data:
                return response_data["response"]
        else:
            logging.error(f"External API responded with status code {external_response.status_code}")
            return {"error": "Failed to get a valid response from the external API"}

    except Exception as e:
        logging.error(f"Error processing conversation: {e}")
        return {"error": "Error processing conversation"}

def pdf_to_text(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    return text

@app.post('/bulk_pdfs')
def convert_to_text():
    logging.info("Request received")
    try:
        if 'file' not in request.files:
            logging.error("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        logging.info("File is here")

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and file.filename.endswith('.pdf'):
            file_path = os.path.normpath(os.path.join(os.getcwd(), file.filename))
            file.save(file_path)
            logging.info(f"File saved at {file_path}")

            try:
                text = pdf_to_text(file_path)
                split_texts = split_text(text)
                            
                final_prompt_data = []
                for part in split_texts:
                    prompt_response = prompt(part)
                    final_prompt_data.append(prompt_response)
                    print(f"Prompt response: {prompt_response}")
                    logging.info(f"Prompt response: {prompt_response}")

                return jsonify(final_prompt_data), 200

            except Exception as e:
                logging.error(f"Error processing PDF: {e}")
                return jsonify({"error": "Error processing PDF file"}), 500
            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logging.info(f"File {file_path} deleted")

        else:
            return jsonify({"error": "Invalid file format, only PDFs are allowed"}), 400

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
