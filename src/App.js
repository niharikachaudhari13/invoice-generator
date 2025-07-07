import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import InvoiceForm from './components/InvoiceForm';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import PdfChatbot from './components/PdfChatbot';
import { Client, Account } from 'appwrite';

const client = new Client();
client
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID');
const account = new Account(client);

function App() {
  const [page, setPage] = useState('landing'); // landing, auth, app
  const [user, setUser] = useState(null);
  const [showPdfChatbot, setShowPdfChatbot] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    account.get().then(
      (user) => {
        setUser(user);
        setPage('app');
      },
      () => {
        setUser(null);
      }
    );
  }, []);

  const handleLogout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setPage('auth');
  };

  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container>
        {page === 'landing' && <LandingPage onGetStarted={() => setPage('auth')} />}
        {page === 'auth' && <AuthPage account={account} onAuthSuccess={(user) => { setUser(user); setPage('app'); }} />}
        {page === 'app' && user && <>
          <div className="d-flex flex-row align-items-center mb-3 gap-2">
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            <button className="btn btn-primary ms-3" onClick={() => setShowPdfChatbot(true)}>
              Open PDF Chatbot
            </button>
          </div>
          <InvoiceForm user={user} />
          {/* Modal for PDF Chatbot */}
          {showPdfChatbot && (
            <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">PDF Chatbot</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowPdfChatbot(false)}></button>
                  </div>
                  <div className="modal-body">
                    <PdfChatbot />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>}
      </Container>
    </div>
  );
}

export default App;
