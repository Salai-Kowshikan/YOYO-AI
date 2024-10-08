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
    json_example = (
        "{"
        "\"CustomerRequirements\": {"
            "\"CarType\": [\"SUV\"], "
            "\"FuelType\": [\"Diesel\"], "
            "\"Color\": [\"White\"], "
            "\"DistanceTravelled\": \"\", "
            "\"MakeYear\": [2021], "
            "\"Transmission Type\": [\"automatic\"]"
        "}, "
        "\"CompanyPolicies\": {"
            "\"FreeRCTransfer\": false, "
            "\"5-DayMoneyBackGuarantee\": true, "
            "\"FreeRSAforOneYear\": false, "
            "\"ReturnPolicy\": \"Registration process starts after 5 days\""
        "}, "
        "\"CustomerObjection\": ["
            "\"RefurbishmentQuality\", "
            "\"CarIssues\", "
            "\"PriceIssues\", "
            "\"CustomerExperienceIssues\""
        "], "
        "\"Extras\": {"
            "\"Warranty\": ["
                "\"1 year or 15,000 kilometers for engine and gearbox\", "
                "\"3 months or 5,000 kilometers for AC and electricals\""
            "], "
            "\"TestDrive\": \"Can be arranged in the showroom or at home\", "
            "\"HomeTestDriveAvailability\": \"May take a couple of days to schedule\""
        "}"
        "}"
    )

    system_message = (
    "The conversation provided involves a car dealing process and should be summarized into a standardized JSON format with the following keys and the values should be array of strings: "
    "1. Customer Requirements: Examples include CarType (Hatchback, SUV, Sedan), FuelType, Color, Distance Travelled, MakeYear, Transmission Type. "
    "2. Company Policies: Examples include FreeRCTransfer, 5-DayMoney Back Guarantee, FreeRSAfor One Year, Return Policy. "
    "3. Customer Objections: Examples include Refurbishment Quality, CarIssues, Price Issues, Customer Experience Issues (e.g., long wait time, salesperson behavior). "
    "4. Extras: Any other relevant information that can be valuable for the company, represented as an array of key-value pairs. "
    "The response should contain only the JSON data in a format that can be parsed using a JSON parser, following this structure: "
    "{\"Customer Requirements\": {...}, \"Company Policies\": {...}, \"Customer Objections\": {...}, \"Extras\": {...}} "
    "Avoid including any introductory text such as 'Here is the summary' or 'The JSON is as follows.' Only the JSON output should be present. here is an example"
    )

    prompt_data = {
        "model": "llama3.1",
        "prompt": conversation,
        "system": system_message + json_example,
        "stream": False
    }

    try:
        external_url = "http://<replace-with-your-ollama-url>/api/generate"
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
def bulkText():
    try:
        prompt_data = request.json
        text = prompt_data.get("text", "")
        split_texts = split_text(text)
        
        final_prompt_data = []
        for part in split_texts:
            prompt_response = prompt(part)
            final_prompt_data.append(prompt_response)
            logging.info(f"Prompt response: {prompt_response}")
        return jsonify(final_prompt_data), 200

    except Exception as e:
        logging.error(f"Error processing TEXT: {e}")
        return jsonify({"error": "Error processing Text file"}), 500
