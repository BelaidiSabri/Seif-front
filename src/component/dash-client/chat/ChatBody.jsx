import React from "react";
import "./ChatBody.css";

const ChatBody = ({ messages, typingStatus, lastMessageRef, user }) => {
  // Function to format the timestamp using native JS
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Formats to a readable date and time string
  };

  // Function to check if name and timestamp should be displayed
  const shouldShowNameAndTimestamp = (currentMessage, previousMessage) => {
    if (!previousMessage) return true; // Always show for the first message

    const currentTime = new Date(currentMessage.timestamp).getTime();
    const previousTime = new Date(previousMessage.timestamp).getTime();

    // Define a time gap threshold (e.g., 5 minutes = 300000ms)
    const timeGap = 10800000; // 5 minutes in milliseconds

    // Show the name and timestamp if the time gap is greater than 5 minutes
    return currentTime - previousTime > timeGap;
  };

  return (
    <>
      <header className="chat__mainHeader">
        <p style={{ fontSize: "18px" }}>
          <b>
            Chat with{" "}
            {messages[0]?.sender === localStorage.getItem("userName")
              ? "You"
              : user.name}
          </b>
        </p>
      </header>

      <div className="message__container">
        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          const isCurrentUser =
            message.sender === localStorage.getItem("userId");

          return (
            <div
              className={`message__chats ${
                isCurrentUser ? "message__chats--right" : "message__chats--left"
              }`}
              key={message.timestamp}
            >
              {/* Check if we need to show the name and timestamp */}
              {shouldShowNameAndTimestamp(message, previousMessage) && (
                <div>
                  <p style={{textAlign:'center'}}>{formatDate(message.timestamp)}</p>
                  <p className="message__timestamp">
                    {isCurrentUser ? "You" : user.name}
                  </p>
                </div>
              )}
              <div
                className={
                  isCurrentUser
                    ? "message__sender message__sender--highlight"
                    : "message__recipient"
                }
              >
                <p>{message.message}</p>
              </div>
            </div>
          );
        })}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;

/* import React from 'react';
import './ChatBody.css'
const ChatBody = ({ messages, typingStatus, lastMessageRef }) => {
  return (
    <>
      <header className='chat__mainHeader'>
        <p>Chat with {messages[0]?.sender === localStorage.getItem('userName') ? 'You' : 'Contact'}</p>
      </header>

      <div className='message__container'>
        {messages.map(message => (
          message.sender === localStorage.getItem("userId") ? (
            <div className="message__chats message__chats--right" key={message.timestamp}>
              <p className='sender__name'>You</p>
              <div className='message__sender message__sender--highlight'>
                <p>{message.message}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats message__chats--left" key={message.timestamp}>
              <p>{message.sender}</p>
              <div className='message__recipient'>
                <p>{message.message}</p>
              </div>
            </div>
          )
        ))}

        <div className='message__status'>
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
 */
