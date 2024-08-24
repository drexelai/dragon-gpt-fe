import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

// Configure marked to open links in new tabs and sanitize URLs
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  return `<a href="${href}" title="${title || ''}" class="highlighted-link" target="_blank">${text}</a>`;
};

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer: renderer
});

function ChatMessages({ messages, isStreaming }) {
  const messagesEndRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages.scrollTop + chatMessages.clientHeight < chatMessages.scrollHeight) {
      setShowScrollDown(true);
    } else {
      setShowScrollDown(false);
    }
  };

  useEffect(() => {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.addEventListener('scroll', handleScroll);
    return () => chatMessages.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(scrollToBottom, [messages]);
  
  return (
    <div className="chat-messages" id="chat-messages">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
          {!message.isUser && (
            <img
              src="mario.png"
              alt="Mario Avatar"
              className="mario-avatar"
            />
          )}  
          <span dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }} />
          {isStreaming && index === messages.length - 1 && <span className="cursor"></span>}
        </div>
      ))}
      <div ref={messagesEndRef} />
      {showScrollDown && (
        <button className="scroll-down" onClick={scrollToBottom}>
          ↓
        </button>
      )}
    </div>
  );
}

export default ChatMessages;