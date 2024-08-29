import pdfplumber

def pdf_to_text(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    
    return text

pdf_path = r"C:\Users\jeyav\Downloads\Untitled document.pdf"
text = pdf_to_text(pdf_path)
print(text)
