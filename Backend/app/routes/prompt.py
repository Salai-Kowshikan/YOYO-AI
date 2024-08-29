from .. import app
from flask import request, jsonify
import requests
import logging


@app.post('/text')
def prompt():
    try:
        prompt_data = request.json
        print(prompt_data)
        
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
