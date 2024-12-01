import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddContact.css";

const AddContact = ({ currentUser, onAddContact }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [message, setMessage] = useState("");
  const [userContacts, setUserContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsersAndContacts = async () => {
      try {
        console.log("Fetching all users and contacts...");

        // Fetch all users
        const usersResponse = await axios.get("http://localhost:5000/user/all");
        console.log("Users fetched:", usersResponse.data);

        // Fetch the current user's contacts
        const contactsResponse = await axios.get(
          `http://localhost:5000/user/contacts/${currentUser.id}`
        );
        console.log("User contacts fetched:", contactsResponse.data);

        // Filter users (exclude the current user)
        if (usersResponse.data.allUsers) {
          const filtered = usersResponse.data.allUsers.filter(
            (user) => user._id !== currentUser.id
          );
          setUsers(filtered);
          setFilteredUsers(filtered);
        }

        // Set the user's contacts
        if (contactsResponse.data) {
          setUserContacts(contactsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch users or contacts.");
      }
    };

    fetchUsersAndContacts();
  }, [currentUser]);

  const handleAddContact = async (user) => {
    try {
      setLoading(true);
      console.log("Adding contact:", user);

      const response = await axios.post(
        "http://localhost:5000/user/add-contact",
        {
          userId: currentUser.id,
          contactId: user._id,
        }
      );

      console.log("Add contact response:", response.data);

      if (response.data.message === "Contact added successfully.") {
        setMessage("Contact ajouté avec succès");
        setUserContacts((prev) => [...prev, user]); // Update the local state

        // Notify parent component if required
        if (onAddContact) {
          onAddContact(user);
        }
      } else {
        setMessage(response.data.message || "Erreur lors de l'ajout du contact.");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      setMessage("Erreur lors de l'ajout du contact.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchEmail(query);
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    console.log("Search query:", query, "Filtered users:", filtered);
  };

  const isAlreadyContact = (userId) => {
    return userContacts.some((contact) => contact._id === userId);
  };

  return (
    <div className="add-contact">
      <input
        type="text"
        placeholder="Rechercher par email ou nom..."
        value={searchEmail}
        onChange={handleSearch}
        className="form-control mb-3"
      />
      {filteredUsers.length === 0 ? (
        <p>Aucun utilisateur trouvé</p>
      ) : (
        <ul className="list-group">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{user.name}</strong>
                <br />
                <small>{user.email}</small>
              </div>
              {!isAlreadyContact(user._id) && (
                <button
                  onClick={() => handleAddContact(user)}
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                >
                  {loading ? "Ajout en cours..." : "Ajouter"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default AddContact;
