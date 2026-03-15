import React, { useState } from 'react';

export const ChatPanel = ({ messages, onSendMessage, msgListRef }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const text = inputValue.trim();
    if (text) {
      onSendMessage(text);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <div className="msglist" ref={msgListRef}>
        {messages.map(message => {
          if (message.type === 'system') {
            return (
              <div key={message.id} className="sysmsg">
                — {message.text} —
              </div>
            );
          }
          
          return (
            <div 
              key={message.id} 
              className={`msg ${message.sender}`}
            >
              <div className="mav">{message.avatar}</div>
              <div className="bbl">{message.text}</div>
            </div>
          );
        })}
      </div>
      
      <div className="msg-input-row">
        <input
          className="msgin"
          type="text"
          placeholder="Say something…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={200}
        />
        <button className="sndbtn" onClick={handleSend}>
          ↑
        </button>
      </div>
    </>
  );
};
