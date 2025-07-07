# Invoice Generator (India GST) with Appwrite Auth & PDF Chatbot

A modern React-based invoice generator tailored for Indian GST, with secure authentication via Appwrite and an integrated AI-powered PDF chatbot for invoice analysis and Q&A.

---

## Features

- **Indian GST Invoice Generator**
  - Per-item GST% (5%, 12%, 18%, 28%)
  - Auto CGST/SGST (same state) or IGST (different states)
  - Indian Rupee only
  - Professional invoice PDF export
- **Authentication**
  - Sign up, sign in, and logout via Appwrite
- **Landing Page**
  - Clean landing with Get Started
- **PDF Chatbot**
  - Upload invoice PDFs
  - Get AI-powered summaries and insights
  - Ask questions about your invoice (Q&A)

---

## Setup Instructions

### 1. **Clone the Repository**
```sh
git clone <your-repo-url>
cd Invoice_Generator_ReactJs-main
```

### 2. **Frontend (React) Setup**

#### Install dependencies:
```sh
npm install
```

#### Configure Appwrite
- Create a `.env` file in the root:
  ```env
  REACT_APP_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
  REACT_APP_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
  ```
- Replace `YOUR_PROJECT_ID` with your Appwrite project ID.

#### Start the React app:
```sh
npm start
```

---

### 3. **Backend (PDF Chatbot API) Setup**

#### Create and activate a Python virtual environment:
```sh
cd pdf_chatbot
python -m venv myenv
# Windows:
myenv\Scripts\activate
# (or)
# Linux/Mac:
# source myenv/bin/activate
```

#### Install dependencies:
```sh
pip install -r requirements.txt
pip install flask flask-cors
```

#### Start the Flask API:
```sh
python pdf_chatbot_api.py
```
- The API will run at `http://localhost:5001`.

---

## Usage

1. **Open the React app** at [http://localhost:3000](http://localhost:3000)
2. **Sign up or sign in** (Appwrite auth)
3. **Create invoices** with Indian GST logic
4. **Open PDF Chatbot** (button beside Logout)
   - Enter your Google API key
   - Upload a PDF invoice
   - Get summary, insights, and ask questions

---

## Notes
- The PDF chatbot requires a Google Generative AI API key for document analysis and Q&A.
- Make sure both the React app and Flask backend are running for full functionality.
- For production, secure your API keys and consider deploying the backend with HTTPS.

---

## License
MIT
