import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddContact.css';


const AddContact = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [message, setMessage] = useState('');
  const [userContacts, setUserContacts] = useState([]);

  useEffect(() => {
    // Fetch all users and the current user's contacts from the server
    const fetchUsersAndContacts = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:5000/user/all');
        const contactsResponse = await axios.get(`http://localhost:5000/user/contacts/${currentUser.id}`);
        console.log('contact' , contactsResponse.data)
        if (usersResponse.data) {
          const filtered = usersResponse.data.filter(user => user._id !== currentUser.id);
          setUsers(filtered);
          setFilteredUsers(filtered); // Initialize filtered users
        }
        
        if (contactsResponse.data) {
          console.log('userContact:' , userContacts)
          setUserContacts(contactsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersAndContacts();
  }, [currentUser]);

  const handleAddContact = async (contactId) => {
    try {
      const response = await axios.post('http://localhost:5000/user/add-contact', {
        userId: currentUser.id,
        contactId
      });
      setMessage(response.data.message);
      
      // Add the contact to the user's contacts list
      setUserContacts(prevContacts => [...prevContacts, contactId]);
    } catch (error) {
      setMessage('Error adding contact');
      console.error('Error adding contact:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchEmail(query);
    const filtered = users.filter(user => user.email.toLowerCase().includes(query));
    setFilteredUsers(filtered);
  };

  const isAlreadyContact = (contactId) => {
    return userContacts.some(contact => contact._id === contactId);
  };

  return (
    <div className="add-contact">
      {/* <h3>Add Contact</h3> */}
      <input 
        type="text" 
        placeholder="Rechercher par email..." 
        value={searchEmail}
        onChange={handleSearch}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user._id}>
            {user.name} ({user.email})
            {!isAlreadyContact(user._id) && (
              <button onClick={() => handleAddContact(user._id)}>Ajouter un contact</button>
            )}
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddContact;
