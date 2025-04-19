import { useState, useEffect, useRef } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { RiSendPlaneFill } from "react-icons/ri";
import BookingStatus from './components/Chatbot/BookingStatus';
import CancelBooking from './components/Chatbot/CancelBooking';
import GetRefund from './components/Chatbot/GetRefund';
import ReportIssue from './components/Chatbot/ReportIssue';
import PaymentIssue from './components/Chatbot/PaymentIssue';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentFlow, setCurrentFlow] = useState(null);
  const [bookingRef, setBookingRef] = useState('');
  const [isResolved, setIsResolved] = useState(null);
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundRef, setRefundRef] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Define the API base URL
  const API_BASE_URL = 'http://localhost:3001';

  // Load saved chat state when component mounts or when returning from other pages
  useEffect(() => {
    // Check if we're returning from another page
    const savedMessages = localStorage.getItem('chatMessages');
    const savedOptions = localStorage.getItem('showOptions');
    const savedFlow = localStorage.getItem('currentFlow');
    
    if (savedMessages) {
      // We're returning from another page, restore the state
      setMessages(JSON.parse(savedMessages));
      setShowInitialOptions(savedOptions === 'true');
      setCurrentFlow(savedFlow ? savedFlow : null);
    } else {
      // Fresh start - initialize with greeting messages
      setMessages([
        { text: "Hello! 👋", sender: 'bot' },
        { text: "Thanks for reaching out! Choose an option below or describe your issue in one single message, and we'll try to find the right solution for you. 🙏", sender: 'bot' }
      ]);
    }
    
    // Set up event listener for page refresh
    const handleBeforeUnload = () => {
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('showOptions');
      localStorage.removeItem('currentFlow');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Save chat state to localStorage when navigating away
  const saveStateBeforeNavigation = () => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    localStorage.setItem('showOptions', showInitialOptions);
    if (currentFlow) {
      localStorage.setItem('currentFlow', currentFlow);
    }
  };

  // Map BERT intents to existing flow options
  const intentToOption = {
    "complaint": { text: "Report room or service issues", value: "report_issue" },
    "contact_human_agent": { text: "Connect with support", value: "connect_support" },
    "cancel_order": { text: "Cancel booking", value: "cancel_booking" },
    "change_order": { text: "Cancel booking", value: "cancel_booking" },
    "get_refund": { text: "Request refund", value: "get_refund" },
    "check_refund_policy": { text: "Check refund policy", value: "refund_policy" },
    "check_payment_methods": { text: "Payment methods", value: "payment_methods" },
    "payment_issue": { text: "Report payment issue", value: "payment_issue" }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const predictIntent = async (text) => {
    try {
      setIsProcessing(true);
      // Update the URL to include the base URL
      const response = await axios.post(`${API_BASE_URL}/api/intent-prediction`, { text });
      return response.data; 
    } catch (error) {
      console.error('Error predicting intent:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing) return;
    
    // Add user message to chat
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    
    // If we're in booking reference input mode for status check or cancellation
    if (currentFlow === 'check_status_ref_input' || currentFlow === 'cancel_booking_ref_input' || currentFlow === 'get_refund_ref_input') {
      setBookingRef(inputText);
      setRefundRef(inputText);
      setInputText('');
    } else {
      // Check if input contains 'status' word
      if (inputText.toLowerCase().includes('status')) {
        setShowInitialOptions(false);
        setInputText('');
        
        // Provide the two specific options without intent prediction
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "I see you're asking about status. Choose one of the following options:",
            sender: 'bot',
            options: [
              { text: "Check booking status", value: "check_status" },
              { text: "It's something else", value: "something_else" }
            ]
          }]);
        }, 500);
      } else {
        // For other free-form text, use BERT to predict intent as before
        setShowInitialOptions(false);
        setIsProcessing(true);
        
        try {
          // Here we call the backend to get the BERT prediction
          const prediction = await predictIntent(inputText);
          setInputText('');
          
          if (prediction && prediction.intent) {
            const { intent, confidence } = prediction;
            const matchedOption = intentToOption[intent];
            
            if (matchedOption) {
              // Display the predicted intent with confidence
              setTimeout(() => {
                setMessages(prev => [...prev, { 
                  text: "Based on your message, I think you want:",
                  sender: 'bot',
                  predictedIntent: {
                    intent,
                    confidence,
                    option: matchedOption
                  },
                  options: [
                    {text: "It's something else", value: "something_else"}
                  ]
                }]);
              }, 500);
            } else {
              // Intent recognized but not mapped to an option
              processUserMessage(inputText);
            }
          } else {
            // Fallback if prediction fails or returns null
            processUserMessage(inputText);
          }
        } catch (error) {
          console.error("Error in intent prediction flow:", error);
          processUserMessage(inputText);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for booking status keywords
    if (lowerMessage.includes('booking') && 
       (lowerMessage.includes('status') || lowerMessage.includes('check'))) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Please enter your booking reference number.", 
          sender: 'bot' 
        }]);
        setCurrentFlow('check_status_ref_input');
      }, 500);
    }
    // Check for cancel booking keywords
    else if (lowerMessage.includes('booking') && 
            (lowerMessage.includes('cancel') || lowerMessage.includes('cancellation'))) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Please enter your booking reference number to proceed with cancellation.", 
          sender: 'bot' 
        }]);
        setCurrentFlow('cancel_booking_ref_input');
      }, 500);
    } else {
      // Default response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm not sure I understand. Would you like to check your booking status or cancel a booking?", 
          sender: 'bot',
          options: [
            { text: "Check booking status", value: "check_status" },
            { text: "Cancel booking", value: "cancel_booking" },
            { text: "I need something else", value: "other_help" }
          ]
        }]);
      }, 500);
    }
  };

  const handleIntentSelection = (predictedIntent) => {
    if (predictedIntent && predictedIntent.option) {
      // User clicked on the predicted intent option
      handleOptionClick(predictedIntent.option);
    }
  };

  const handleOptionClick = (option) => {
    setShowInitialOptions(false);

    const updatedMessages = messages.map(msg => {
      if (msg.options || msg.predictedIntent) {
        const { options, predictedIntent, ...rest } = msg;
        return rest;
      }
      return msg;
    });

    setMessages([...updatedMessages, { text: option.text, sender: 'user' }]);
    
    switch (option.value) {
      case 'check_status':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Please enter your booking reference number in the input field.", 
            sender: 'bot' 
          }]);
          setCurrentFlow('check_status_ref_input');
        }, 500);
        break;
        
      case 'cancel_booking':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Please enter your booking reference number to proceed with cancellation.", 
            sender: 'bot' 
          }]);
          setCurrentFlow('cancel_booking_ref_input');
        }, 500);
        break;

      case 'keep_booking':
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Your booking has not been cancelled.",
            sender: 'bot'
          }]);

          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Is there anything else I can help you with?",
              sender: "bot",
              options: [
                { text: "Yes, I need more help", value: "more_help"},
                { text: "No, thank you", value: "no_thanks"}
              ]
            }]);
            setCurrentFlow(null);
          }, 500);
        }, 500);
        break;
        
      case 'end_chat':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Was your issue resolved?", 
            sender: 'bot',
            options: [
              { text: "Yes, thank you", value: "issue_resolved" },
              { text: "No, I still need help", value: "issue_not_resolved" }
            ]
          }]);
        }, 500);
        break;
        
      case 'why_cancelled':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "There could be several reasons for cancellation: insufficient payment, overbooking, or service unavailability." + "\n" + "For the exact reason, please check your email for cancellation details or ", 
            sender: 'bot',
            linkText: {
              text: "browse our FAQ Center.",
              value: "browse_faq"
            }
          }]);
          
          // Follow-up after explanation
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              text: "Was your issue resolved?", 
              sender: 'bot',
              options: [
                { text: "Yes, thank you", value: "issue_resolved" },
                { text: "No, I still need help", value: "issue_not_resolved" }
              ]
            }]);
          }, 1000);
        }, 500);
        break;


      case 'refund_policy': 
        saveStateBeforeNavigation();
        navigate('/faq-refund-policy');
      break;

      case 'refund_form':
        saveStateBeforeNavigation();
        navigate('/faq-refund');
      break;

      case 'report_issue':
        setCurrentFlow('report_issue');
        break;
        
      case 'payment_issue':
        setCurrentFlow('payment_issue');
        break;
        
      case 'complaint_form':
        saveStateBeforeNavigation();
        navigate('/faq-complaint');
        break;
        
      case 'payment_form':
        saveStateBeforeNavigation();
        navigate('/faq-payment-issue');
        break;
        
        
      case 'issue_resolved':
        setIsResolved(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Great! Is there something else I can help you with?", 
            sender: 'bot',
            options: [
              { text: "Yes, I have another question", value: "more_help" },
              { text: "No, thank you", value: "no_thanks" }
            ]
          }]);
        }, 500);
        break;
        
      case 'issue_not_resolved':
        setIsResolved(false);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "I'm sorry to hear that. Let me connect you with a human agent who can better assist you with your specific issue.", 
            sender: 'bot' 
          }]);
          
          // Simulate transfer to human agent
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              text: "You are being transferred to a human agent. Please wait a moment.", 
              sender: 'bot' 
            }]);
          }, 1000);
        }, 500);
        break;

      case 'get_refund':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Please enter your booking reference number to proceed with your refund request.", 
            sender: 'bot' 
          }]);
          setCurrentFlow('get_refund_ref_input');
        }, 500);
        break;
        
      case 'more_help':
      case 'other_help':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "What else can I help you with today?", 
            sender: 'bot',
            options: [
              { text: "Cancel booking", value: "cancel_booking" },
              { text: "Check booking status", value: "check_status" },
              { text: "Report issue with payment", value: "payment_issue" },
              { text: "Request refund", value: "get_refund" },
              { text: "Report room or service issue", value: "report_issue" }
            ]
          }]);
        }, 500);
        break;
        
      case 'no_thanks':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Thank you for chatting with us today! If you need any further assistance, don't hesitate to reach out. Have a great day!", 
            sender: 'bot' 
          }]);
        }, 500);
        break;
        
      case 'browse_faq':
        saveStateBeforeNavigation();
        navigate('/faq');
        break;

      case 'payment_methods':
        saveStateBeforeNavigation();
        navigate('/faq-payment-methods');
        break;
      
      case 'connect_support':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "I'm connecting you with a customer support agent who can help with your specific situation. Please wait a moment.", 
            sender: 'bot' 
          }]);
          
          // Simulate transfer
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              text: "You are being transferred to a human agent. Please wait a moment.", 
              sender: 'bot' 
            }]);
          }, 1000);
        }, 500);
        break;
        
      case 'try_later':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Is there anything else I can help you with today?", 
            sender: 'bot',
            options: [
              { text: "Yes, I need more help", value: "more_help" },
              { text: "No, thank you", value: "no_thanks" }
            ]
          }]);
        }, 500);
        break;
        
      // Add handler for "It's something else" option
      case 'something_else':
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "I understand this is something different than what I suggested. Let me connect you with a human agent who can better understand your specific needs.", 
            sender: 'bot' 
          }]);
          
          // Simulate transfer to human agent
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              text: "You are being transferred to a human agent. Please wait a moment.", 
              sender: 'bot' 
            }]);
          }, 1000);
        }, 500);
        break;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="App">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-header-arrow-icon">
            <IoIosArrowDown />
          </div>
          <div className="chatbot-header-help-center">Help Center</div>
        </div>
        
        <div className="chatbot-content">
          {messages.map((message, index) => (
            <div key={index} className={`message-bubble ${message.sender}`}>
              {message.text}

              {message.linkText && (
                <span
                  className='message-link'
                  onClick={() => handleOptionClick({
                    text: message.linkText.text,
                    value: message.linkText.value
                  })}
                >
                  {message.linkText.text}
                </span>
              )}
              
              {message.predictedIntent && (
                <div className="predicted-intent-container">
                  <div className="confidence-score" style={{ color: 'gray', fontSize: '0.8rem' }}>
                    Confidence: {(message.predictedIntent.confidence * 100).toFixed(2)}%
                  </div>
                  <button 
                    className="option-button-inline"
                    onClick={() => handleIntentSelection(message.predictedIntent)}
                  >
                    {message.predictedIntent.option.text}
                  </button>
                </div>
              )}
              
              {message.options && (
                <div className="message-options">
                  {message.options.map((option, optIndex) => (
                    <button 
                      key={optIndex}
                      className="option-button-inline"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {showInitialOptions && (
          <div className="options-container">
            <button className="option-button" onClick={() => handleOptionClick({ text: 'Cancel booking', value: 'cancel_booking' })}>
              Cancel or modify booking
            </button>
            <button className="option-button" onClick={() => handleOptionClick({ text: 'Check booking status', value: 'check_status' })}>
              Check booking status
            </button>
            <button className="option-button" onClick={() => handleOptionClick({ text: 'Report issue with payment', value: 'payment_issue' })}>
              Report issue with payment
            </button>
            <button className="option-button" onClick={() => handleOptionClick({ text: 'Request refund', value: 'get_refund' })}>
              Request refund
            </button>
            <button className="option-button" onClick={() => handleOptionClick({ text: 'Report room or service issues', value: 'report_issue' })}>
              Report room or service issues
            </button>
          </div>
          )}
          
          {currentFlow === 'check_status_ref_input' && (
            <BookingStatus
              messages={messages}
              setMessages={setMessages}
              bookingRef={bookingRef}
              setCurrentFlow={setCurrentFlow}
            />
          )}

          {currentFlow === 'report_issue' && (
            <ReportIssue
              messages={messages}
              setMessages={setMessages}
              setCurrentFlow={setCurrentFlow}
            />
          )}

          {currentFlow === 'payment_issue' && (
            <PaymentIssue
              messages={messages}
              setMessages={setMessages}
              setCurrentFlow={setCurrentFlow}
            />
          )}
          
          {currentFlow === 'cancel_booking_ref_input' && (
            <CancelBooking
              messages={messages}
              setMessages={setMessages}
              bookingRef={bookingRef}
              setCurrentFlow={setCurrentFlow}
            />
          )}

          {currentFlow === 'get_refund_ref_input' && (
            <GetRefund
              messages={messages}
              setMessages={setMessages}
              bookingRef={refundRef}
              setCurrentFlow={setCurrentFlow}
            />
          )}    
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-area">
          <input 
            type="text" 
            placeholder="Type a message" 
            className="input-field"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />
          <button className="send-button" onClick={handleSend} disabled={isProcessing}>
            <div className='send-button-icon'><RiSendPlaneFill/></div>
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;