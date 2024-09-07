import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';

const renderer = new marked.Renderer();

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer: renderer
});

function ChatMessages({ messages, isStreaming }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add target="_blank" to all anchor tags within chat messages
    const chatMessages = document.getElementById('chat-messages');
    const links = chatMessages.getElementsByTagName('a');
    for (let link of links) {
      link.setAttribute('target', '_blank');
    }
  }, [messages]);

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
          {/* {console.log(message.text)} */}
          <span dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }} />
          {isStreaming && index === messages.length - 1 && <span className="cursor"></span>}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;