from .. import app
from flask import request, jsonify
import requests
import logging


@app.post('/prompt')
def prompt():
    try:
        conversation = request.data.decode('utf-8').strip().replace('\n', ' ').replace('\r', '')
        print(conversation)
        print(type(conversation))

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

        external_url = "http://10.11.148.18:11434/api/generate"
        external_response = requests.post(external_url, json=prompt_data)

        if external_response.status_code == 200:
            return jsonify(external_response.json()), 200
        else:
            logging.error(f"External API responded with status code {external_response.status_code}")
            return jsonify({"error": "Failed to get a valid response from the external API"}), external_response.status_code

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
