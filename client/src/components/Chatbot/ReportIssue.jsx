import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ReportIssue({ messages, setMessages, setCurrentFlow }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Display initial message when component mounts
  useEffect(() => {
    setMessages(prev => [...prev, { 
      text: "I understand you want to report an issue with your room or service. How would you like to proceed?", 
      sender: 'bot',
      options: [
        { text: "Fill complaint form", value: "complaint_form" },
        { text: "End chat", value: "end_chat" }
      ]
    }]);
    setCurrentFlow(null);
  }, []);
}

export default ReportIssue;