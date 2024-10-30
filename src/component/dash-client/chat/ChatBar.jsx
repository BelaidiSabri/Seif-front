import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddContact from "./AddContact";

const ChatBar = ({ selectContact, currentUser, onAddContact, messages }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null); // State for selected contact
  
  const modalRef = useRef(null); // Create a ref for the modal element

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/user/contacts/${userId}`
        );
        setContacts(response.data);
        console.log("contacts", response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const openModal = () => {
    const modalElement = modalRef.current; // Get the modal element
    const modal = new window.bootstrap.Modal(modalElement); // Initialize Bootstrap modal
    modal.show(); // Show the modal
  };

  const handleAddContact = async (contactName) => {
    try {
      const response = await fetch(
        "http://localhost:5000/user/search?email=" + contactName
      );
      const data = await response.json();
      if (data._id) {
        // Add contact logic here
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
    setSelectedContactId(contact._id); // Update selected contact ID in state
    selectContact(contact); // Call the parent component's selectContact function
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

          {/* Modal */}
          <div
            className="modal fade"
            ref={modalRef}
            id="exampleModalCenter"
            tabIndex="-1"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ maxWidth: "600px" }}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">
                    Ajouter un contact
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Modal body content */}
                  <AddContact
                    currentUser={currentUser}
                    onAddContact={handleAddContact}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chat__users">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => handleContactClick(contact)} // Call the handler on click
              className={`chat-user-item ${selectedContactId === contact._id ? 'selected' : ''}`} // Add 'selected' class if the contact is selected
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
                  {/* <p style={{color:'#333333', fontSize:'13px'}}>message preview</p> */}
                </div>
              </div>
              <div className="chat-user-time">
                <p>12:50</p>
                {/* <div className="msg-numbers">
                  <p>5</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
