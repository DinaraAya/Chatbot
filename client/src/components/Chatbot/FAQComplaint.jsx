import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FAQComplaint.css';
import { FaAngleLeft } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import complaintIcon from './images/questions.png';

function FAQComplaint() {
  const navigate = useNavigate();
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/'); // Navigate back to the main chat screen
  };

  const [bookingNumber, setBookingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Complaint submitted successfully. We will respond within 24 hours.');
    // Reset form
    setBookingNumber('');
    setDescription('');
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
            <img className='faq-icon' src={complaintIcon} height={100} width={100}/>
          </div>
          <div className='problem-name'>Submit a Complaint</div>
          <div className='faq-details'>
            <h3>Report an Issue with Your Stay</h3>
            <p>We're sorry you experienced a problem. Please fill out the form below, and our customer service team will address your concerns within 24 hours.</p>
            
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
                <label htmlFor="description">Describe the issue:</label>
                <textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details of the problem you experienced..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div className="form-group file-upload">
                <label htmlFor="photo">Upload Photo (optional):</label>
                <div className="file-input-container">
                  <input 
                    type="file" 
                    id="photo" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="custom-file-upload">
                    <FaUpload /> {fileName || 'Choose a file'}
                  </div>
                </div>
              </div>
              
              <button type="submit" className="submit-complaint">Submit Complaint</button>
            </form>
            
            <div className="additional-info">
              <h3>What Happens Next</h3>
              <p>After submitting your complaint:</p>
              <ul>
                <li>You'll receive an email confirmation with a reference number.</li>
                <li>A customer service representative will contact you within 24 hours.</li>
                <li>We may request additional information if needed to resolve your issue.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQComplaint;