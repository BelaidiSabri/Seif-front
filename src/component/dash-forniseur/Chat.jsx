import React, { useState } from 'react';
import '../../CSS/Chat.css';
import Footer from './Footer';

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const contacts = [
    { id: 1, name: 'Alice Smith', photo: 'https://picsum.photos/id/1027/200', lastMessage: 'Hey, how are you?' },
    { id: 2, name: 'Bob Johnson', photo: 'https://picsum.photos/id/1012/200', lastMessage: 'Can we meet tomorrow?' },
    { id: 3, name: 'Carol White', photo: 'https://picsum.photos/id/1025/200', lastMessage: 'I sent you the file.' },
    { id: 4, name: 'Dave Brown', photo: 'https://picsum.photos/id/1005/200', lastMessage: 'Lunch at 1 PM?' },
    { id: 5, name: 'Eve Davis', photo: 'https://picsum.photos/id/1011/200', lastMessage: 'Great job on the project!' }
  ];

  const messages = [
    { id: 1, contactId: 1, text: 'Hey! How was your weekend?', sent: false },
    { id: 2, contactId: 1, text: 'It was great! I went hiking. You?', sent: true },
    { id: 3, contactId: 1, text: 'Just relaxed at home.', sent: false },
    { id: 4, contactId: 1, text: 'Sounds nice. We should hike together sometime!', sent: true }
  ];

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setIsSidebarOpen(false);  // Close sidebar on mobile when a contact is selected
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedContact) {
      console.log(`Sending message to ${selectedContact.name}: ${message}`);
      setMessage('');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
    <div className="chat-app content-container card">
      <main className={`chat-main ${!selectedContact ? 'hidden-mobile' : ''}`}>
        {selectedContact ? (
          <>
            <header className="chat-header">
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                <i className="fa-solid fa-bars"></i>
              </button>
              <img src={selectedContact.photo} alt={selectedContact.name} className="contact-photo" />
              <h2>{selectedContact.name}</h2>
            </header>
            <div className="message-list">
              {messages
                .filter(msg => msg.contactId === selectedContact.id)
                .map(msg => (
                  <div key={msg.id} className={`message ${msg.sent ? 'sent' : 'received'}`}>
                    {msg.text}
                  </div>
                ))}
            </div>
            <form className="message-input" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </main>
      <aside className={`sidebarbar ${!isSidebarOpen ? 'hidden-mobile' : ''}`}>
        <header className="sidebar-header">
          <h2>Chats</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="fa-solid fa-times"></i>
          </button>
        </header>
        <div className="contact-list">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className={`contact-item ${selectedContact && contact.id === selectedContact.id ? 'selected' : ''}`}
              onClick={() => handleContactClick(contact)}
            >
              <img src={contact.photo} alt={contact.name} className="contact-photo" />
              <div className="contact-info">
                <h3 className="contact-name">{contact.name}</h3>
                <p className="contact-lastMessage">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
    <br/>
    <Footer/>
    </>
  );
};

export default Chat;