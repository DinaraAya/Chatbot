import { createRoot } from 'react-dom/client'
import './index.css'
import React from "react";
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import FAQPage from "./components/Chatbot/FAQPage";
import FAQPaymentIssue from './components/Chatbot/FAQPaymentIssue';
import FAQPaymentMethod from './components/Chatbot/FAQPaymentMethod';
import FAQRefundPolicy from './components/Chatbot/FAQRefundPolicy';
import FAQComplaint from './components/Chatbot/FAQComplaint';
import FAQRefund from './components/Chatbot/FAQRefund';

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/faq" element={<FAQPage />}/>
        <Route path='/faq-payment-issue' element={<FAQPaymentIssue />}/>
        <Route path='/faq-payment-methods' element={<FAQPaymentMethod />}/>
        <Route path='/faq-refund-policy' element={<FAQRefundPolicy />}/>
        <Route path='/faq-complaint' element={<FAQComplaint />}/>
        <Route path='/faq-refund' element={<FAQRefund />}/>
      </Routes>
    </Router>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<Root />);
