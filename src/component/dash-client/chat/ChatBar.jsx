import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddContact from "./AddContact";

const ChatBar = ({ selectContact, currentUser }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/user/contacts/${userId}`
        );
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add a new contact
  const handleAddContact = async (contactEmail) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:5000/user/add-contact", {
        userId,
        contactEmail,
      });

      if (response.data.success) {
        // Fetch the updated contact list
        const updatedContacts = await axios.get(
          `http://localhost:5000/user/contacts/${userId}`
        );
        setContacts(updatedContacts.data);

        // Close the modal
        closeModal();
      } else {
        console.error("Failed to add contact:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleContactClick = (contact) => {
    setSelectedContactId(contact._id);
    selectContact(contact);
  };

  return (
    <div className="chat__sidebar">
      <div>
        <div>
          <div className="chat-header-wrapper">
            <h4 className="chat__header">Mes Contacts :</h4>
            <button
              type="button"
              className="add-contact-button"
              onClick={openModal}
            >
              Ajouter un contact
            </button>
          </div>

          {/* Modal for adding a contact */}
          {isModalOpen && (
            <div 
              className="modal contact-modal show" 
              style={{ 
                display: 'block', 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: 1050 
              }}
              onClick={closeModal}
            >
              <div 
                className="modal-dialog contact-modal-dialog modal-dialog-centered" 
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '600px', margin: '1.75rem auto' }}
              >
                <div className="modal-content contact-modal-content">
                  <div className="modal-header contact-modal-header">
                    <h5 className="modal-title contact-modal-title">
                      Ajouter un contact
                    </h5>
                    <button
                      type="button"
                      className="btn-close contact-modal-close"
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className="modal-body contact-modal-body">
                    <AddContact
                      currentUser={currentUser}
                      onAddContact={handleAddContact}
                    />
                  </div>
                  <div className="modal-footer contact-modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary contact-modal-cancel-btn"
                      onClick={closeModal}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact list */}
        <div className="chat__users">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => handleContactClick(contact)}
              className={`chat-user-item ${
                selectedContactId === contact._id ? "selected" : ""
              }`}
            >
              <div className="chat-user-info">
                <div className="chat-user-avatar">
                  {contact.profilePic ? (
                    <img
                      src={contact.profilePic}
                      alt={contact.name}
                      className="chat-user-image"
                    />
                  ) : (
                    <div className="chat-user-initial">
                      {getInitials(contact.name)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="chat-user-name">
                    <b>{contact.name}</b>
                  </p>
                </div>
              </div>
              <div className="chat-user-time">
                <p>12:50</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;