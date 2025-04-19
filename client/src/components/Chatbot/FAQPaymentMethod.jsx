import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FAQPaymentMethod.css';
import { FaAngleLeft } from "react-icons/fa6";
import paymentIcon from './images/questions.png';
import visaIcon from './images/visa.png';
import mastercardIcon from './images/mastercard.png';
import amexIcon from './images/amex.png';
import paypalIcon from './images/paypal.png';
import applepayIcon from './images/applepay.png';

function FAQPaymentMethod() {
  const navigate = useNavigate();
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/'); // Navigate back to the main chat screen
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
            <img className='faq-icon' src={paymentIcon} height={100} width={100}/>
          </div>
          <div className='problem-name'>Available Payment Methods</div>
          <div className='faq-details'>
            <h3>Accepted Payment Methods</h3>
            <p>We offer various payment options to make your booking process as convenient as possible:</p>
            
            <div className="payment-methods-container">
              <div className="payment-method-item">
                <img src={visaIcon} alt="Visa" height={40} />
                <p>Visa</p>
              </div>
              <div className="payment-method-item">
                <img src={mastercardIcon} alt="Mastercard" height={40} />
                <p>Mastercard</p>
              </div>
              <div className="payment-method-item">
                <img src={amexIcon} alt="American Express" height={40} />
                <p>American Express</p>
              </div>
              <div className="payment-method-item">
                <img src={paypalIcon} alt="PayPal" height={40} />
                <p>PayPal</p>
              </div>
              <div className="payment-method-item">
                <img src={applepayIcon} alt="Apple Pay" height={40} />
                <p>Apple Pay</p>
              </div>
            </div>

            <h3>Payment Process</h3>
            <p>When making a reservation with us:</p>
            <ul>
              <li><strong>Booking Deposit</strong>: We require a deposit of the first night's stay to secure your reservation.</li>
              <li><strong>Final Payment</strong>: The remaining balance will be charged upon check-in.</li>
              <li><strong>Currency</strong>: All payments are processed in the local currency. Currency conversion fees may apply depending on your card issuer.</li>
            </ul>
            
            <h3>Security Information</h3>
            <p>Your payment information is always secure with us:</p>
            <ul>
              <li>All transactions are encrypted using industry-standard SSL technology.</li>
              <li>We comply with Payment Card Industry Data Security Standards (PCI DSS).</li>
              <li>We never store your complete credit card information on our servers.</li>
            </ul>
          </div>
          <button className='email-support'>Email Support</button>
        </div>
      </div>
    </div>
  )
}

export default FAQPaymentMethod;