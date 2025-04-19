import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FAQRefundPolicy.css';
import { FaAngleLeft } from "react-icons/fa6";
import policyIcon from './images/questions.png';

function FAQRefundPolicy() {
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
            <img className='faq-icon' src={policyIcon} height={100} width={100}/>
          </div>
          <div className='problem-name'>Detailed Refund Policy</div>
          <div className='faq-details'>
            <p>At our hotel, we have implemented a fair and transparent refund policy to accommodate our guests' changing plans:</p>
            
            <h3>Standard Bookings</h3>
            <ul>
              <li><strong>7+ Days Prior to Arrival</strong>: Full refund with no cancellation fee</li>
              <li><strong>3-6 Days Prior to Arrival</strong>: 75% refund of the total booking amount</li>
              <li><strong>1-2 Days Prior to Arrival</strong>: No refund available</li>
              <li><strong>Day of Arrival</strong>: No refund available</li>
            </ul>
            
            <h3>Special Rate Bookings</h3>
            <p>Bookings made with special promotions, discounts, or during peak seasons:</p>
            <ul>
              <li><strong>Non-Refundable Rates</strong>: Some promotional rates are strictly non-refundable and will be clearly marked during booking.</li>
              <li><strong>Peak Season Bookings</strong>: Cancellations for bookings during holiday periods require 14 days notice for a full refund.</li>
            </ul>
            
            <h3>Exceptional Circumstances</h3>
            <p>We understand that unexpected events can occur. We may offer full or partial refunds in cases of:</p>
            <ul>
              <li><strong>Medical Emergencies</strong>: With proper documentation from a healthcare provider</li>
              <li><strong>Natural Disasters</strong>: When travel to our location is impossible or unsafe</li>
              <li><strong>Bereavement</strong>: In case of death in the immediate family</li>
            </ul>
            
            <h3>Refund Method</h3>
            <p>All refunds will be processed using the original payment method. Processing times vary based on your payment provider:</p>
            <ul>
              <li>Credit/Debit Cards: 5-10 business days</li>
              <li>Bank Transfers: 7-14 business days</li>
              <li>Digital Wallets: 2-5 business days</li>
            </ul>
          </div>
          <button className='email-support'>Email Support</button>
        </div>
      </div>
    </div>
  )
}

export default FAQRefundPolicy;