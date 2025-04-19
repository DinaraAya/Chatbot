import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FAQComplaint.css';
import { FaAngleLeft } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import refundIcon from './images/questions.png'; 

function FAQRefund() {
  const navigate = useNavigate();
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/'); // Navigate back to the main chat screen
  };


  const [bookingNumber, setBookingNumber] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Refund request submitted successfully. We will review and process it within 3-5 business days.');
    // Reset form
    setBookingNumber('');
    setRefundReason('');
    setRefundAmount('');
    setPaymentMethod('');
    setFileName('');
  };

  return (
    <div className="faq">
      <div className="chatbot-container-faq">
        <div className="chatbot-header">
            <div 
                className="chatbot-header-arrow-icon" 
                onClick={handleBackClick}
                style={{ cursor: 'pointer' }}
            >
                <FaAngleLeft />
            </div>
          <div className="chatbot-header-help-center">Help Center</div>
        </div>
        <div className='faq-contents'>
          <div className='faq-header'>
            <div className='faq-header-vertical-part'>
              <div className='faq-header-text'>FAQ & Info Center</div>
              <div className='faq-subheader-text'>Browse & learn about our services</div>
            </div>
            <img className='faq-icon' src={refundIcon} height={100} width={100}/>
          </div>
          <div className='problem-name'>Request a Refund</div>
          <div className='faq-details'>
            <h3>Apply for a Booking Refund</h3>
            <p>Need to request a refund for your booking? Please complete the form below with all necessary details, and our refund processing team will review your request within 3-5 business days.</p>
            
            <form className="complaint-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="bookingNumber">Booking Number:</label>
                <input 
                  type="text" 
                  id="bookingNumber" 
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value)}
                  placeholder="Enter your booking number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="refundAmount">Refund Amount Requested:</label>
                <input 
                  type="text" 
                  id="refundAmount" 
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter amount in USD"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="paymentMethod">Original Payment Method:</label>
                <input 
                  type="text" 
                  id="paymentMethod" 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="Credit card, PayPal, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="refundReason">Reason for Refund:</label>
                <textarea 
                  id="refundReason" 
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please explain why you're requesting a refund..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div className="form-group file-upload">
                <label htmlFor="receipt">Upload Receipt/Proof (optional):</label>
                <div className="file-input-container">
                  <input 
                    type="file" 
                    id="receipt" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="custom-file-upload">
                    <FaUpload /> {fileName || 'Choose a file'}
                  </div>
                </div>
              </div>
              
              <button type="submit" className="submit-complaint">Submit Refund Request</button>
            </form>
            
            <div className="additional-info">
              <h3>Refund Process</h3>
              <p>After submitting your refund request:</p>
              <ul>
                <li>You'll receive a confirmation email with your refund reference number.</li>
                <li>Our team will review your request within 3-5 business days.</li>
                <li>If approved, refunds typically appear on your original payment method within 7-10 business days.</li>
                <li>For partial refunds or special circumstances, a customer service representative may contact you.</li>
              </ul>
              
              <h3>Refund Policy Highlights</h3>
              <ul>
                <li>Full refunds are available for cancellations made 48+ hours before check-in.</li>
                <li>Partial refunds may be issued for cancellations made within 48 hours of check-in.</li>
                <li>No-show bookings are generally not eligible for refunds.</li>
                <li>Special circumstances (emergencies, etc.) are evaluated on a case-by-case basis.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQRefund;