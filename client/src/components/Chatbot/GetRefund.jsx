import { useState, useEffect } from 'react';
import axios from 'axios';

function GetRefund({ messages, setMessages, bookingRef, setCurrentFlow }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [refundStep, setRefundStep] = useState('validate'); 

  const checkBookingForRefund = async () => {
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

      // Store booking details for later use
      if (response.data.data && response.data.data.details) {
        setBookingDetails(response.data.data.details);
      }

      // Determine next steps based on booking status
      switch (response.data.step) {
        case 'active':
          // Calculate days until check-in
          const checkInDate = new Date(response.data.data.details.checkInDate);
          const now = new Date();
          const daysDifference = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));
          
          if (daysDifference > 6) {
            // Full refund with cancellation fee
            setMessages(prev => [...prev, { 
              text: `Your booking (${bookingRef}) is scheduled for ${new Date(response.data.data.details.checkInDate).toLocaleDateString()}.`, 
              sender: 'bot'
            }]);
            
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: "You are eligible for a FULL REFUND with a cancellation fee of $50. This is because your check-in date is more than 6 days away.", 
                sender: 'bot',
                options: [
                  { text: "Proceed with refund request", value: "confirm_refund" },
                  { text: "Keep my booking", value: "keep_booking" }
                ]
              }]);
              setRefundStep('confirm');
            }, 500);
          } else if (daysDifference >= 3 && daysDifference <= 6) {
            // 75% refund
            setMessages(prev => [...prev, { 
              text: `Your booking (${bookingRef}) is scheduled for ${new Date(response.data.data.details.checkInDate).toLocaleDateString()}.`, 
              sender: 'bot'
            }]);
            
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: "You are eligible for a 75% REFUND of your booking amount. This is because your check-in date is 3-6 days away.", 
                sender: 'bot',
                options: [
                  { text: "Proceed with refund request", value: "confirm_refund" },
                  { text: "Keep my booking", value: "keep_booking" }
                ]
              }]);
              setRefundStep('confirm');
            }, 500);
          } else {
            // Less than 3 days - no refund
            setMessages(prev => [...prev, { 
              text: `Your booking (${bookingRef}) is scheduled to start in less than 3 days (on ${new Date(response.data.data.details.checkInDate).toLocaleDateString()}).`, 
              sender: 'bot'
            }]);
            
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: "I'm sorry, but according to our refund policy, bookings cannot be refunded less than 3 days before the check-in date.", 
                sender: 'bot',
                options: [
                  { text: "Check refund policy", value: "refund_policy" },
                  { text: "End chat", value: "end_chat"}
                ]
              }]);
              setCurrentFlow(null);
            }, 500);
          }
          break;

        case 'cancelled':
          setMessages(prev => [...prev, {
            text: `Your booking (${bookingRef}) has already been cancelled.`,
            sender: 'bot'
          }]);

          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "If you're waiting for your refund, please note that refunds typically take 5-7 business days to process.",
              sender: 'bot'
            }]);

            setTimeout(() => {
              setMessages(prev => [...prev, {
                text: "Is there anything else I can help you with?",
                sender: 'bot',
                options: [
                  { text: "Yes, I need more help", value: "more_help" },
                  { text: "No, thank you", value: "no_thanks" }
                ]
              }]);
              setCurrentFlow(null);
            }, 500);
          }, 500);
          break;

        case 'notInTransit':
          // Handle completed bookings
          setMessages(prev => [...prev, {
            text: `Your booking (${bookingRef}) cannot be refunded because it has already ${response.data.data.status === 'completed' ? 'been completed' : 'ended'}.`,
            sender: 'bot'
          }]);

          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Is there anything else I can help you with?",
              sender: 'bot',
              options: [
                { text: "Yes, I need more help", value: "more_help" },
                { text: "No, thank you", value: "no_thanks" }
              ]
            }]);
            setCurrentFlow(null);
          }, 500);
          break;

        default:
          setMessages(prev => [...prev, {
            text: `Booking status: ${response.data.message}`,
            sender: 'bot'
          }]);
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Is there anything else I can help you with?",
              sender: 'bot',
              options: [
                { text: "Yes, I need more help", value: "more_help" },
                { text: "No, thank you", value: "no_thanks" }
              ]
            }]);
            setCurrentFlow(null);
          }, 500);
          break;
      }

    } catch (error) {
      setLoading(false);
      
      if (error.response && error.response.data) {
        // Increment retry count
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        if (newRetryCount === 1) {
          // First error - prompt to try again
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Please try entering your booking reference again.",
              sender: 'bot'
            }]);
          }, 500);
        } else {
          // Second error - final message
          setTimeout(() => {
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

  const processRefund = async () => {
    setLoading(true);
    setRefundStep('processing');
    
    try {
       
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Great! You can fill out the refund form below.", 
              sender: 'bot',
              options: [
                { text: "Fill the refund form", value: "refund_form" },
                { text: "End chat", value: "end_chat"}
              ]
            }]);
            setCurrentFlow(null);
          }, 500);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Check if there's a new user message related to refund steps
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && lastMessage.sender === 'user' && refundStep === 'confirm') {
      if (lastMessage.text.includes("Proceed with refund")) {
        processRefund();
      } else if (lastMessage.text.includes("Keep my booking")) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Your booking will be kept as is. No refund will be processed.",
            sender: 'bot',
          }]);
          setCurrentFlow(null);
        }, 500);
      }
    }
  }, [messages]);

  // Trigger booking check when component mounts or booking ref changes
  useEffect(() => {
    if (bookingRef && refundStep === 'validate') {
      checkBookingForRefund();
    }
  }, [bookingRef]);

  return null;
}

export default GetRefund;