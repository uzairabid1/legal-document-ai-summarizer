from flask import Flask, request, jsonify
from flask_cors import CORS 
import os
from werkzeug.utils import secure_filename
from openai import OpenAI
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads/'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

AZURE_ENDPOINT = os.getenv('AZURE_ENDPOINT')
AZURE_KEY = os.getenv('AZURE_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

def analyze_document_from_file(file_path):
    document_analysis_client = DocumentAnalysisClient(
        endpoint=AZURE_ENDPOINT, 
        credential=AzureKeyCredential(AZURE_KEY)
    )
    
    with open(file_path, "rb") as f:
        poller = document_analysis_client.begin_analyze_document(
            "prebuilt-document",  
            document=f
        )
    result = poller.result()
    return result

def chunk_text(text, max_chunk_size=3000):
    """Split text into chunks of approximately max_chunk_size characters."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_size = 0
    
    for word in words:
        current_size += len(word) + 1  # +1 for space
        if current_size > max_chunk_size:
            chunks.append(' '.join(current_chunk))
            current_chunk = [word]
            current_size = len(word)
        else:
            current_chunk.append(word)
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks


@app.route('/analyze-and-summarize-file', methods=['POST'])
def analyze_and_summarize_file():
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        # Save the uploaded file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            # Analyze the document
            result = analyze_document_from_file(filepath)
            
            # Combine all text from all pages
            full_text = ""
            for page in result.pages:
                page_text = ' '.join([line.content for line in page.lines]) if page.lines else ''
                full_text += page_text + " "

            # Create OpenAI client
            client = OpenAI(api_key=OPENAI_API_KEY)

            # Handle long documents by chunking
            chunks = chunk_text(full_text)
            chunk_summaries = []

            # Summarize each chunk
            for chunk in chunks:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that creates concise summaries."},
                        {"role": "user", "content": f"Please summarize the following text: {chunk}"}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                chunk_summaries.append(response.choices[0].message.content)

            # If we have multiple chunks, create a final summary of summaries
            final_summary = chunk_summaries[0]
            if len(chunk_summaries) > 1:
                combined_summaries = " ".join(chunk_summaries)
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that creates concise summaries."},
                        {"role": "user", "content": f"Please create a coherent final summary from these partial summaries: {combined_summaries}"}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                final_summary = response.choices[0].message.content

            return jsonify({
                'summary': final_summary,
                'full_text': full_text
            })

        finally:
            if os.path.exists(filepath):
                os.remove(filepath)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
