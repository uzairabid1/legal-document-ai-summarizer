# Legal Document AI Summarizer

A powerful web application that uses advanced AI technology to analyze and summarize legal hearing documents. Built with a modern React frontend and Flask backend, this tool leverages Azure Form Recognizer for document analysis and OpenAI's GPT models for intelligent summarization.

## 🚀 Features

- **PDF Document Processing**: Upload and analyze legal hearing documents in PDF format
- **AI-Powered Summarization**: Generate concise, accurate summaries using OpenAI's GPT-3.5-turbo
- **Document Preview**: View document previews before processing
- **Intelligent Text Chunking**: Handle large documents by automatically splitting them into manageable chunks
- **Modern UI/UX**: Clean, professional interface with drag-and-drop functionality
- **Real-time Processing**: Live feedback during document analysis
- **Copy to Clipboard**: Easy copying of generated summaries
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework for API development
- **Azure Form Recognizer**: Document analysis and text extraction
- **OpenAI GPT-3.5-turbo**: AI-powered text summarization
- **PyMuPDF**: PDF processing and image conversion
- **Flask-CORS**: Cross-origin resource sharing support

### Frontend
- **Next.js 15**: React framework for the frontend
- **React 19**: Modern React with latest features
- **Styled Components**: CSS-in-JS styling solution
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework

## 📋 Prerequisites

Before running this application, you'll need:

1. **Python 3.8+** installed on your system
2. **Node.js 18+** and npm installed
3. **Azure Form Recognizer** account and credentials
4. **OpenAI API** key

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd legal-document-ai-summarizer
```

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file with your API keys
touch .env
```

Add the following to your `.env` file:

```env
AZURE_ENDPOINT=your_azure_form_recognizer_endpoint
AZURE_KEY=your_azure_form_recognizer_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
cd backend
python main.py
```

The Flask server will start on `http://127.0.0.1:5000`

### 2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The Next.js application will start on `http://localhost:3000`

## 📖 Usage

1. **Upload Document**: Drag and drop a PDF file or click to select one
2. **Preview**: View a preview of your document
3. **Generate Summary**: Click "Generate Summary" to process the document
4. **Review Results**: Read the AI-generated summary
5. **Copy or Regenerate**: Copy the summary to clipboard or regenerate if needed

## 🔌 API Endpoints

### POST `/analyze-and-summarize-file`
Analyzes and summarizes a PDF document.

**Request**: Multipart form data with PDF file
**Response**: JSON with summary and full text

### POST `/fetch-image`
Converts PDF to image for preview.

**Request**: Multipart form data with PDF file
**Response**: Image file (PNG)

## 🏗️ Project Structure

```
legal-document-ai-summarizer/
├── backend/
│   ├── main.py              # Flask application and API endpoints
│   ├── requirements.txt     # Python dependencies
│   └── uploads/            # Temporary file storage
├── frontend/
│   ├── app/
│   │   ├── components/     # React components
│   │   │   ├── FileUpload.js
│   │   │   ├── Loader.js
│   │   │   └── SummaryDisplay.js
│   │   ├── page.js         # Main application page
│   │   ├── layout.js       # App layout
│   │   └── globals.css     # Global styles
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
└── README.md
```

## 🔒 Environment Variables

Create a `.env` file in the backend directory with:

- `AZURE_ENDPOINT`: Your Azure Form Recognizer endpoint URL
- `AZURE_KEY`: Your Azure Form Recognizer API key
- `OPENAI_API_KEY`: Your OpenAI API key

## 🚨 Important Notes

- **File Size**: Large PDF files may take longer to process
- **API Limits**: Be aware of Azure Form Recognizer and OpenAI API rate limits
- **Temporary Files**: Uploaded files are automatically cleaned up after processing
- **Supported Format**: Currently only supports PDF files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Verify your API keys are correctly set in the `.env` file
3. Ensure both backend and frontend servers are running
4. Check that your PDF file is not corrupted or password-protected

## 🔮 Future Enhancements

- Support for additional document formats (DOCX, TXT)
- Batch processing of multiple documents
- User authentication and document history
- Export summaries to various formats
- Advanced summarization options and customization
- Integration with legal document management systems 