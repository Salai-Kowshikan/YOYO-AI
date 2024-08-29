from .. import app
from flask import request, jsonify
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
    system_message = (
        "The above convo deals with a car dealing process and I want it to be summarized in the following json format: "
        "Customer Requirements for a Car: CarType(Hatchback, SUV, Sedan), FuelType, Color, Distance Travelled, MakeYear, "
        "Transmission Type. 2 Company Policies Discussed: FreeRCTransfer, 5-DayMoney Back Guarantee, FreeRSAfor One Year, "
        "Return Policy. 3. Customer Objection: Refurbishment Quality, CarIssues, Price Issues, Customer Experience Issues "
        "(e.g., long wait time, salesperson behaviour). Response should contain the proper json format that can be parsed using json parser."
    )

    prompt_data = {
        "model": "llama3.1",
        "prompt": conversation,
        "system": system_message,
        "stream": False
    }

    try:
        external_url = "http://10.11.148.18:11434/api/generate"
        external_response = requests.post(external_url, json=prompt_data)

        if external_response.status_code == 200:
            # return external_response.json(["response"])
            response_data = external_response.json()
            if "response" in response_data:
                return response_data["response"]
        else:
            logging.error(f"External API responded with status code {external_response.status_code}")
            return {"error": "Failed to get a valid response from the external API"}

    except Exception as e:
        logging.error(f"Error processing conversation: {e}")
        return {"error": "Error processing conversation"}


@app.post('/text')
def prompt():
    try:
        prompt_data = request.json
        print(prompt_data)

        split_texts = split_text(prompt_data)
        
        final_prompt_data = []
        for part in split_texts:
            prompt_response = prompt(part)
            final_prompt_data.append(prompt_response)
            logging.info(f"Prompt response: {prompt_response}")
        return jsonify(final_prompt_data), 200

    except Exception as e:
        logging.error(f"Error processing TEXT: {e}")
        return jsonify({"error": "Error processing Text file"}), 500
