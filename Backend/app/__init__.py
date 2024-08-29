from flask import Flask
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

from .routes import hello, pdf, prompt, bulk_pdfs
if __name__ == '__main__':
    app.run(debug=False) 