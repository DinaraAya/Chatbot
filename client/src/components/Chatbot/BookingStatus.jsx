import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/BookingStatus.css';

function BookingStatus({ messages, setMessages, bookingRef, setCurrentFlow }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const checkBookingStatus = async () => {
    if (!bookingRef.trim()) {
      setMessages(prev => [...prev, { 
        text: "Please enter a valid booking reference number.", 
        sender: 'bot' 
      }]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/bookings/check-status', {
        bookingReference: bookingRef
      });

      setLoading(false);
      setRetryCount(0); // Reset retry count on successful request

      // Determine message based on booking status
      let messageText = '';
      switch (response.data.step) {
        case 'active':
          messageText = `Your booking (${bookingRef}) is active. Booking date: ${new Date(response.data.data.bookingDate).toLocaleDateString()}. Status: ${response.data.data.status}.`;

          setMessages(prev => [...prev, { text: messageText, sender: 'bot'}]);

          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Was your issue resolved?",
              sender: 'bot',
              options : [
                { text: "Yes, thank you", value: "issue_resolved" },
                { text: "No, I still need help", value: "issue_not_resolved"}
              ]
            }]);
          }, 500);
          break;

        case 'cancelled':
          messageText = `Your booking (${bookingRef}) has been cancelled.`;

          setMessages(prev => [...prev, {
            text: messageText,
            sender: 'bot'
          }])

          setTimeout(() => {
            setMessages(prev => [...prev, {
              sender: 'bot',
              text: "Would you like to know why?",
              options: [
                { text: "Why was it cancelled?", value: "why_cancelled" },
                { text: "End chat", value: "end_chat" }
              ]
            }]);
          }, 500);
          break;

        case 'notInTransit':
          messageText = `Your booking (${bookingRef}) is not in transit anymore. Current status: ${response.data.data.status}.`;
          break;
        default:
          messageText = `Booking status: ${response.data.message}`;
          break;
      }

      // Reset current flow
      setCurrentFlow(null);

    } catch (error) {
      setLoading(false);
      
      if (error.response && error.response.data) {
        // Increment retry count
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        if (newRetryCount === 1) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Please try entering your booking reference again.",
              sender: 'bot'
            }]);
          }, 500);
        } else {
          // Second error - final message
          setTimeout(() =>{
          setMessages(prev => [...prev, {
            text: "Sorry, we're unable to find your booking reference. Is there something else I can help you with?",
            sender: 'bot',
            options: [
              { text: "Yes, I need more help", value: "more_help" },
              { text: "No, thank you", value: "no_thanks" }
            ]
          }]);

          // Reset current flow
          setCurrentFlow(null);
        }, 500);
        }
      } else {
        // Unexpected error
        setMessages(prev => [...prev, {
          text: "An unexpected error occurred. Please try again or contact customer service.",
          sender: 'bot'
        }]);

        // Reset current flow
        setCurrentFlow(null);
      }
    }
  };

  // Trigger status check when component mounts or booking ref changes
  useEffect(() => {
    if (bookingRef) {
      checkBookingStatus();
    }
  }, [bookingRef]);

  // Remove the input and button from this component
  return null;
}

export default BookingStatus;