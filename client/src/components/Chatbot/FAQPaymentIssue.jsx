import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FAQPaymentIssue.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaAngleLeft } from "react-icons/fa6";
import payment from './images/questions.png';

function FAQPaymentIssue() {
  const navigate = useNavigate();
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/'); // Navigate back to the main chat screen
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqItems = [
    {
      question: "Why was my payment declined?",
      answer: "Payments can be declined for several reasons including insufficient funds, expired card, incorrect card details, daily spending limits reached, or your bank's fraud prevention systems. Check your payment details or contact your bank for more information."
    },
    {
      question: "When will I receive my refund?",
      answer: "Refunds typically process within 3-5 business days, but may take up to 10 business days to appear on your statement depending on your payment provider. If you haven't received your refund after 10 business days, please contact our support team."
    },
    {
      question: "Can I change my payment method after booking?",
      answer: "Yes, you can change your payment method for future payments up until 48 hours before your scheduled stay. Go to 'My Bookings', select the reservation, and click on 'Manage Payment Method' to update your details."
    },
    {
      question: "Are there any additional fees when paying?",
      answer: "We don't charge any additional processing fees. However, some payment methods or banks might apply foreign transaction fees or currency conversion charges for international bookings. Please check with your payment provider for details."
    }
  ];

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
            <img className='faq-icon' src={payment} height={100} width={100}/>
          </div>
          
          <div className='problem-name'>Understanding Payment Issues With Your Booking</div>
          
          <div className='faq-details'>
            <h3>Common Payment Issues</h3>
            <p>Payment problems can be stressful, especially when you're looking forward to your trip. Here are the most common payment issues our customers face:</p>
            <ul>
              <li><strong>Declined Transactions</strong>: Your card may be declined due to insufficient funds, exceeding daily limits, or your bank's security measures.</li>
              <li><strong>Payment Verification Failures</strong>: Sometimes the verification process may fail if the billing address doesn't match your card details.</li>
              <li><strong>International Transaction Blocks</strong>: Some banks automatically block international transactions as a security measure.</li>
              <li><strong>Temporary Authorization Holds</strong>: Your bank may place a temporary hold on funds during the booking process, which can sometimes appear as a duplicate charge.</li>
            </ul>
            
            <h3>How to Resolve Payment Problems</h3>
            <p>If you're experiencing payment issues with your booking, here are some steps to resolve them:</p>
            <ul>
              <li><strong>Verify Card Details</strong>: Ensure all your card information is entered correctly, including expiration date and CVV.</li>
              <li><strong>Contact Your Bank</strong>: Your bank may have blocked the transaction. A quick call can often resolve this issue.</li>
              <li><strong>Use an Alternative Payment Method</strong>: If one payment method isn't working, try an alternative if available.</li>
              <li><strong>Clear Browser Cache</strong>: Sometimes, clearing your browser cache or using a different browser can resolve payment processing issues.</li>
            </ul>
          </div>
          
          <div className='faq-accordion'>
            <h3 className='accordion-title'>Frequently Asked Questions</h3>
            
            {faqItems.map((item, index) => (
              <div key={index} className='accordion-item'>
                <div className='accordion-header' onClick={() => toggleAccordion(index)}>
                  <span>{item.question}</span>
                  <span className='accordion-icon'>
                    {activeIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </div>
                {activeIndex === index && (
                  <div className='accordion-content'>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className='payment-form'>
            <h3 className='form-title'>Still Need Help? Email Us</h3>
            <div className='form-group'>
              <label>Please select transaction type:</label>
              <select className='form-select'>
                <option value="">Select transaction type</option>
                <option value="booking">New Booking Payment</option>
                <option value="amendment">Booking Amendment Charge</option>
                <option value="refund">Refund Request</option>
                <option value="preauthorization">Pre-authorization Hold</option>
              </select>
            </div>
            
            <div className='form-group'>
              <label>Select an issue:</label>
              <select className='form-select'>
                <option value="">Select your issue</option>
                <option value="declined">Payment Declined</option>
                <option value="double">Double Charge</option>
                <option value="wrong">Incorrect Amount Charged</option>
                <option value="missing">Payment Missing</option>
                <option value="other">Other Issue</option>
              </select>
            </div>
            
            <div className='form-group'>
              <label>Description:</label>
              <textarea className='form-textarea' placeholder="Please describe your issue in detail..."></textarea>
            </div>
            
            <button className='submit-button'>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQPaymentIssue;