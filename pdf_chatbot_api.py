from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
import tempfile

app = Flask(__name__)
CORS(app)

# Store vectorstore and text in memory for demo (in production, use a DB or session)
vectorstore_cache = {}
text_cache = {}

@app.route('/upload', methods=['POST'])
def upload_pdf():
    api_key = request.form.get('api_key')
    model_name = request.form.get('model_name', 'Google AI')
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400
    # Save PDF to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        file.save(tmp.name)
        pdf_path = tmp.name
    # Extract text
    text = ""
    pdf_reader = PdfReader(pdf_path)
    for page in pdf_reader.pages:
        text += page.extract_text()
    os.remove(pdf_path)
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    # Create vector store
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    # Save in memory (use a session id in production)
    session_id = os.urandom(8).hex()
    vectorstore_cache[session_id] = vector_store
    text_cache[session_id] = text
    # Simple summary: first 500 chars
    summary = text[:500] + ("..." if len(text) > 500 else "")
    return jsonify({'summary': summary, 'session_id': session_id})

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    api_key = data.get('api_key')
    model_name = data.get('model_name', 'Google AI')
    session_id = data.get('session_id')
    question = data.get('question')
    if not session_id or session_id not in vectorstore_cache:
        return jsonify({'error': 'Invalid session_id'}), 400
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    vector_store = vectorstore_cache[session_id]
    # Find relevant docs
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
    docs = vector_store.similarity_search(question)
    # QA chain
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3, google_api_key=api_key)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)
    answer = response['output_text']
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(port=5001, debug=True) 