import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';

// Configure marked to open links in new tabs and sanitize URLs
marked.setOptions({
  gfm: true,
  breaks: true,
  renderer: new marked.Renderer()
});

function ChatMessages({ messages, isStreaming }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    </div>
  );
}

export default ChatMessages;