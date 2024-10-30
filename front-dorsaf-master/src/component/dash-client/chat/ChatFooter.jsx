import React, { useState, useEffect, useRef } from "react";

const ChatFooter = ({ selectedContact, socket }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleTyping = () => {
    socket.emit("typing", {
      message: `${localStorage.getItem("userName")} is typing`,
      receiver: selectedContact._id,
    });
    setTimeout(() => {
      socket.emit("typing", { message: "", receiver: selectedContact._id });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userId")) {
      socket.emit("message", {
        message,
        sender: localStorage.getItem("userId"),
        receiver: selectedContact._id,
        timestamp: new Date(),
      });
      setMessage(""); // Clear input after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"; // Set to scroll height with max 150px
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <footer className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onInput={adjustTextareaHeight}
          placeholder="Type a message..."
          className="message-type"
          rows={1}
          style={{
            overflow: "hidden",
            resize: "none",
            height: isFocused ? "auto" : "40px", // Collapse on blur
          }}
        />
        <div className="buttons-wrapper">
          <button type="submit" className="send-button">
            <i className="fa fa-paper-plane send-icon" aria-hidden="true"></i>
          </button>
          <button type="button" className="exchange-button">
            Échanger
          </button>
        </div>
      </form>
    </footer>
  );
};

export default ChatFooter;
