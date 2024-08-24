import React, { useState } from 'react';

function ChatInput({ onSendMessage, inputRef }) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicClick = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = function() {
      console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend();
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error detected: ' + event.error);
    };

    recognition.onend = function() {
      console.log('Voice recognition ended.');
    };

    recognition.start();
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        id="user-input"
        placeholder="Type your question here..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        ref={inputRef}
        autoComplete="off"
      />
      <button id="send-button" onClick={handleSend}>Send</button>
      <button id="mic-button" onClick={handleMicClick}>🎤</button>
    </div>
  );
}

export default ChatInput;