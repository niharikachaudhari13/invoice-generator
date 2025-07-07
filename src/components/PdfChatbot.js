import React, { useState } from 'react';

const PdfChatbot = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setPdfName(e.target.files[0].name);
      setSummary('');
      setSessionId('');
      setChat([]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!pdfFile || !apiKey) {
      setError('Please select a PDF and enter your Google API key.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('api_key', apiKey);
      formData.append('model_name', 'Google AI');
      const res = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        setSessionId(data.session_id);
      } else {
        setError(data.error || 'Failed to process PDF.');
      }
    } catch (err) {
      setError('Error uploading PDF.');
    }
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!question || !sessionId || !apiKey) return;
    setLoading(true);
    setError('');
    setChat([...chat, { from: 'user', text: question }]);
    try {
      const res = await fetch('http://localhost:5001/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          session_id: sessionId,
          api_key: apiKey,
          model_name: 'Google AI',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setChat((prev) => [...prev, { from: 'bot', text: data.answer }]);
      } else {
        setError(data.error || 'Failed to get answer.');
      }
    } catch (err) {
      setError('Error communicating with backend.');
    }
    setLoading(false);
    setQuestion('');
  };

  return (
    <div className="card shadow-sm border-0 p-4 mb-4" style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 16 }}>
      <h3 className="mb-3 text-primary">PDF Chatbot</h3>
      <div className="mb-3">
        <label className="form-label fw-bold">Google API Key:</label>
        <input
          type="password"
          className="form-control"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Enter your Google API Key"
        />
      </div>
      <div className="mb-3">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="form-control" />
      </div>
      <button className="btn btn-primary w-100 mb-2" onClick={handleUpload} disabled={!pdfFile || !apiKey || loading}>
        {loading ? 'Uploading...' : 'Upload & Summarize'}
      </button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {summary && <div className="alert alert-info mt-2">{summary}</div>}
      <div className="chat-box mt-4 mb-2 p-3" style={{ minHeight: 120, background: '#f8fafc', borderRadius: 12, border: '1px solid #e5e7eb' }}>
        {chat.map((msg, idx) => (
          <div key={idx} className={`d-flex ${msg.from === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
            <span className={`badge ${msg.from === 'user' ? 'bg-primary' : 'bg-secondary'}`}>{msg.from === 'user' ? 'You' : 'AI'}</span>
            <span className="ms-2" style={{ background: '#fff', borderRadius: 8, padding: '6px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Ask a question about the PDF..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          disabled={!summary || loading}
        />
        <button className="btn btn-success" onClick={handleAsk} disabled={!question || loading || !summary}>
          Ask
        </button>
      </div>
    </div>
  );
};

export default PdfChatbot; 