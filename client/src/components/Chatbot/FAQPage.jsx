import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FAQPage.css';
import { IoIosArrowDown } from 'react-icons/io';
import { FaAngleLeft } from "react-icons/fa6";
import questions from './images/questions.png';

function FAQPage() {
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
            <img className='faq-icon' src={questions} alt="FAQ icon" height={100} width={100}/>
          </div>
          <div className='problem-name'>How to find out why my booking was cancelled</div>
          <div className='faq-details'>
            <h3>Common Reasons for Order Cancellation</h3>
            <p>We understand that an order cancellation can be frustrating. Here are the most common reasons why an order might be cancelled:</p>
            <ul>
              <li><strong>Payment Issues</strong>: Your payment method may have been declined, or there might have been a problem verifying your payment information. This could be due to insufficient funds, expired credit card, or fraud prevention measures.</li>
              <li><strong>Inventory Unavailability</strong>: The item you ordered may have suddenly become out of stock or discontinued. We always aim to update our inventory in real-time, but occasional discrepancies can occur.</li>
              <li><strong>Shipping Restrictions</strong>: Some items cannot be shipped to certain locations due to legal, regulatory, or logistical constraints. If your shipping address falls under such restrictions, your order may be cancelled.</li>
              <li><strong>Pricing Errors</strong>: In rare cases, if a significant pricing error is discovered after an order is placed, we may need to cancel the order.</li>
            </ul>
            <h3>What to Do Next</h3>
            <p>If your order was cancelled, here are some steps you can take:</p>
            <ul>
              <li><strong>Check Your Email</strong>: We send detailed cancellation notifications that explain the specific reason for your order cancellation.</li>
              <li><strong>Contact Customer Support</strong>: Our support team can provide you with specific details about your order cancellation. Have your order number ready when you reach out.</li>
              <li><strong>Reorder or Choose Alternatives</strong>: If the item is still available, you can typically place a new order. We may also suggest similar products if your original item is out of stock.</li>
            </ul>
          </div>
          <button className='email-support'>Email Support</button>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;