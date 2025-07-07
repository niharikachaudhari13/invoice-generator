import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page-container">
      <div className="landing-content">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="Invoice Illustration"
          className="landing-image"
        />
        <h1>Indian GST Invoice Generator</h1>
        <p>Generate professional GST-compliant invoices for your business in seconds.</p>
        <button className="get-started-btn" onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage; 