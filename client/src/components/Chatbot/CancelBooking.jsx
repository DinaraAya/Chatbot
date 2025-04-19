import { useState, useEffect } from 'react';
import axios from 'axios';

function CancelBooking({ messages, setMessages, bookingRef, setCurrentFlow }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [cancellationStep, setCancellationStep] = useState('validate'); // validate, confirm, processing, complete

  const checkBookingForCancellation = async () => {
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
          // Check if booking is more than 72 hours away
          const checkInDate = new Date(response.data.data.details.checkInDate);
          const now = new Date();
          const hoursDifference = (checkInDate - now) / (1000 * 60 * 60);
          
          if (hoursDifference >= 72) {
            // Can be cancelled
            setMessages(prev => [...prev, { 
              text: `Your booking (${bookingRef}) is active and scheduled for ${new Date(response.data.data.details.checkInDate).toLocaleDateString()}.`, 
              sender: 'bot'
            }]);
            
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: "Would you like to proceed with cancellation?", 
                sender: 'bot',
                options: [
                  { text: "Yes, cancel my booking", value: "confirm_cancellation" },
                  { text: "No, keep my booking", value: "keep_booking" }
                ]
              }]);
              setCancellationStep('confirm');
            }, 500);
          } else {
            // Too late to cancel
            setMessages(prev => [...prev, { 
              text: `Your booking (${bookingRef}) is scheduled to start in less than 72 hours (on ${new Date(response.data.data.details.checkInDate).toLocaleDateString()}).`, 
              sender: 'bot'
            }]);
            
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: "I'm sorry, but according to our refund policy we're unable to cancel bookings less than 72 hours before the check-in date.", 
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

        case 'notInTransit':
          setMessages(prev => [...prev, {
            text: `Your booking (${bookingRef}) cannot be cancelled because it has already ${response.data.data.status === 'completed' ? 'been completed' : 'ended'}.`,
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

  const processCancellation = async () => {
    setLoading(true);
    setCancellationStep('processing');
    
    try {
        setMessages(prev => [...prev, {
            text: "Processing your cancellation request...",
            sender: 'bot'
        }]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                text: "A link with cancellation fee payment details has been sent to your email address. If you don't complete the payment within 24 hours, your booking won't be cancelled.",
                sender: 'bot'
            }]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                text: "Would you like to read more about payment methods?",
                sender: 'bot',
                options: [
                    {text: "Yes, I need more help", value: "more_help"},
                    {text: "No, thank you", value: "no_thanks"}
                ]
            }]);
            setCurrentFlow(null);
        }, 1000);
       }, 500);

       setLoading(false);

    } catch (error) {
       setLoading(false);
    }
      
  };

  // Handle specific actions for this component
  useEffect(() => {
    // Check if there's a new user message related to cancellation steps
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && lastMessage.sender === 'user' && cancellationStep === 'confirm') {
      if (lastMessage.text.includes("Yes, cancel my booking")) {
        processCancellation();
      } else if (lastMessage.text.includes("No, I'll keep my booking")) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Your booking has not been cancelled. Is there anything else I can help you with?",
            sender: 'bot',
            options: [
              { text: "Yes, I need more help", value: "more_help" },
              { text: "No, thank you", value: "no_thanks" }
            ]
          }]);
          setCurrentFlow(null);
        }, 500);
      }
    }
  }, [messages]);

  // Trigger booking check when component mounts or booking ref changes
  useEffect(() => {
    if (bookingRef && cancellationStep === 'validate') {
      checkBookingForCancellation();
    }
  }, [bookingRef]);

  return null;
}

export default CancelBooking;