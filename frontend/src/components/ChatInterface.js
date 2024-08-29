import React, { useState, useEffect, useRef } from 'react';
import ChatMessages from './MessageList';
import ChatInput from './MessageInput';
import '../styles/ChatContainer.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setMessages(prev => [...prev, { text: '', isUser: false }]);
    setIsStreaming(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      let accumulatedChunks = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        accumulatedChunks += chunk;

        const updateMessages = (chunks) => {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.text = chunks; // No need to parse markdown here
            return newMessages;
          });
        };

        updateMessages(accumulatedChunks);
      }
    } catch (error) {
      console.error('Error fetching bot response:', error.message);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = "I'm sorry, I couldn't process your request at this moment.";
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="chat-container bg-white rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col mx-auto">
      <div className="chat-header">
        <h1>DragonGPT</h1>
      </div>
      <ChatMessages messages={messages} isStreaming={isStreaming} />
      <ChatInput onSendMessage={handleSendMessage} inputRef={inputRef} />
    </div>
  );
}

export default ChatInterface;