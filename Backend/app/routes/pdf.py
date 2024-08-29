from .. import app
from flask import Flask, request, jsonify 
import os
import pdfplumber
import requests
import logging

def prompt(conversation):
    try:
        # conversation = request.data.decode('utf-8').strip().replace('\n', ' ').replace('\r', '')
        # print(conversation)
        # print(type(conversation))

        if not conversation:
            logging.error("No conversation text provided in request")
            return jsonify({"error": "No conversation text provided in request"}), 400

        # print(f"Conversation: {conversation}")
        system_message = "The above convo deals with a car dealing process and I want it to be summarized in the following json format: Customer Requirements for a Car: CarType(Hatchback, SUV, Sedan), FuelType, Color, Distance Travelled, MakeYear, Transmission Type. 2 Company Policies Discussed: FreeRCTransfer, 5-DayMoney Back Guarantee, FreeRSAfor One Year, Return Policy. 3. Customer Objection: Refurbishment Quality, CarIssues, Price Issues, Customer Experience Issues (e.g., long wait time, salesperson behaviour). Response should contain the proper json format that can be parsed using json parser."

        prompt_data = {
            "model": "llama3.1",
            "prompt": conversation,
            "system": system_message,
            "stream": False
        }
        print(prompt_data)

        external_url = "http://10.11.148.18:11434/api/generate"
        external_response = requests.post(external_url, json=prompt_data)


    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

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
            return jsonify({"error": "No file part in the request"}), 500

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
                prompt(text)
                return jsonify({"text": text}), 200
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