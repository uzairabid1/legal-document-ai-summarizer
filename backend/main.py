from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS, cross_origin
import os
from werkzeug.utils import secure_filename
from openai import OpenAI
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv
from pdf2image import convert_from_path
import os
import tempfile  
import fitz  
import shutil  
load_dotenv()

app = Flask(__name__)
CORS(app, support_credentials=True)


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
@cross_origin(supports_credentials=True)

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


@app.route('/convert', methods=['POST'])
def convert_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400

    try:
        pdf_path = os.path.join("temp", file.filename)
        output_dir = "output_images"
        file.save(pdf_path)

        image_paths = convert_pdf_to_image(pdf_path, output_dir)

        if not image_paths:
            return jsonify({"error": "Conversion failed."}), 500

        # For simplicity, returning the first image file
        return send_file(image_paths[0], mimetype='image/png')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up the uploaded file if necessary
        if os.path.exists(pdf_path):
            os.remove(pdf_path)



def convert_pdf_to_image(pdf_path, output_dir, output_file="output_image.png"):
    """Convert a PDF to an image using PyMuPDF."""
    try:
        doc = fitz.open(pdf_path)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        image_paths = []
        for page_num in range(len(doc)):  # Iterate over all pages
            page = doc.load_page(page_num)  # Load a single page
            pix = page.get_pixmap(dpi=150)  # Render page to an image (dpi=150 for quality)
            image_path = os.path.join(output_dir, f"{os.path.splitext(output_file)[0]}_{page_num + 1}.png")
            pix.save(image_path)
            image_paths.append(image_path)

        return image_paths

    except Exception as e:
        print(f"Error during PDF to image conversion: {e}")
        return None

@app.route('/fetch-image', methods=['POST'])
@cross_origin(supports_credentials=True)
def fetch_pdf_image():

    if not os.path.exists("temp"):
        os.makedirs("temp")

    if not os.path.exists("temp_images"):
        os.makedirs("temp_images")
    
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
        
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    pdf_path = None
    output_dir = "output_images"
    temp_file = None
    image_paths = []

    try:
        # Save the uploaded file temporarily
        filename = file.filename
        pdf_path = os.path.join("temp", filename)
        file.save(pdf_path)

        # Convert the PDF to images
        image_paths = convert_pdf_to_image(pdf_path, output_dir)

        if not image_paths:
            return jsonify({"error": "Failed to convert PDF to image"}), 500

        # Create a temporary copy of the first image to send
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp:
            temp_file = temp.name
            shutil.copyfile(image_paths[0], temp_file)

        # Open the temporary file in binary mode and create a response
        with open(temp_file, 'rb') as f:
            image_data = f.read()

        # Custom response to handle cleanup after sending
        def generate():
            yield image_data
            # Cleanup happens after the response is fully sent
            try:
                if pdf_path and os.path.exists(pdf_path):
                    os.remove(pdf_path)
                if temp_file and os.path.exists(temp_file):
                    os.remove(temp_file)
                if os.path.exists(output_dir):
                    shutil.rmtree(output_dir)
            except PermissionError as e:
                print(f"Cleanup failed due to permission error: {e}")
            except Exception as e:
                print(f"Unexpected error during cleanup: {e}")

        return Response(generate(), mimetype='image/png')

    except Exception as e:
        # Clean up in case of an exception before the response
        if pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)
        if os.path.exists(output_dir):
            try:
                shutil.rmtree(output_dir)
            except Exception as e:
                print(f"Error cleaning up output_dir on exception: {e}")
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)
