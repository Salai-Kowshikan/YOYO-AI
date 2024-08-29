from .. import app
from flask import Flask, request, jsonify 
import os
import pdfplumber
import requests
import logging

def prompt(conversation):
        # print(conversation)
        # print(type(conversation))
        system_message = "The above convo deals with a car dealing process and I want it to be summarized in the following json format: Customer Requirements for a Car: CarType(Hatchback, SUV, Sedan), FuelType, Color, Distance Travelled, MakeYear, Transmission Type. 2 Company Policies Discussed: FreeRCTransfer, 5-DayMoney Back Guarantee, FreeRSAfor One Year, Return Policy. 3. Customer Objection: Refurbishment Quality, CarIssues, Price Issues, Customer Experience Issues (e.g., long wait time, salesperson behaviour). the above given is just a sample format and you can add further fields if you find more informational data from the customer that the company can use on the passage. further fields you find can be added to a key named extras within which you can give every values as an array and  the response key must contain only the json of all the details mentioned in the given passage so than it can be parsed using a json parser......never start the response with here is the summary of the json or something like this. Please do not include any other text like Here is a summary or anything. In the response only JSON should be present"

        prompt_data = {
            "model": "llama3.1",
            "prompt": conversation,
            "system": system_message,
            "stream": False
        }

        return prompt_data
    
def pdf_to_text(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    return text
@app.post('/pdf')
def convert_pdf_to_text():
    print("Request received")
    try:
        if 'file' not in request.files:
            print(request.files) 
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        print("File is here")

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and file.filename.endswith('.pdf'):
            print(file.filename)
            file_path = os.path.normpath(os.path.join(os.getcwd(), file.filename))
            print(f"File path is {file_path}")
            file.save(file_path)
            try:
                text = pdf_to_text(file_path)

                prompt_data = prompt(text)
                external_url = "http://10.11.148.18:11434/api/generate"
                external_response = requests.post(external_url, json=prompt_data)

                if external_response.status_code == 200:
                    return jsonify(external_response.json()), 200
                else:
                    logging.error(f"External API responded with status code {external_response.status_code}")
                    return jsonify({"error": "Failed to get a valid response from the external API"}), external_response.status_code

            except Exception as e:
                print(f"Error processing PDF: {e}")
                return jsonify({"error": "Error processing PDF file"}), 500
            finally:
                if os.path.exists(file_path):
                    os.remove(file_path)
        else:
            return jsonify({"error": "Invalid file format, only PDFs are allowed"}), 400

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
