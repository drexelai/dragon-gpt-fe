import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

function ChatInput({ onSendMessage, inputRef }) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Effect to focus the input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setIsSending(true);
      onSendMessage(inputValue);
      setInputValue('');
      setTimeout(() => setIsSending(false), 500); // Remove sending state after 0.5s
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
      setIsRecording(true); // Start recording
    };
  
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      // Automatically send the recognized speech
      onSendMessage(transcript);
      setInputValue('');
    };
  
    recognition.onerror = function() {
      setIsRecording(false); // Stop recording in case of error
    };
  
    recognition.onend = function() {
      setIsRecording(false); // Stop recording
    };
  
    recognition.start();
  };
  

  return (
    <div className="chat-input flex items-center">
      <input
        type="text"
        id="user-input"
        placeholder="Enter your question here"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        ref={inputRef}
        autoComplete="off"
        className="flex-grow p-2 border border-gray-400 rounded-lg"
      />
      <button
        onClick={handleSend}
        className={`ml-2 px-4 py-2 rounded-lg text-lg font-bold transition-colors duration-300 ${
          isSending
            ? 'bg-red-500 animate-pulse-fast text-white'
            : 'bg-[#07294d] text-[#ffc600] hover:bg-[#ffc600] hover:text-[#07294d]'
        }`}
      >
        Send
      </button>
      <button
        onClick={handleMicClick}
        className={`ml-2 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center ${
          isRecording
            ? 'bg-red-500 animate-pulse-fast text-white'
            : 'bg-[#07294d] text-[#ffc600] hover:bg-[#ffc600] hover:text-[#07294d]'
        }`}
      >
        <FontAwesomeIcon
          icon={faMicrophone}
          className={`text-3xl`}
        />
      </button>
    </div>
  );
}

export default ChatInput;
