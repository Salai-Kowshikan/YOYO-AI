from .. import app
from flask import Flask, request, jsonify 
import os
import pdfplumber

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