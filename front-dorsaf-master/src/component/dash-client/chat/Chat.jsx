import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import io from "socket.io-client";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import AddContact from "./AddContact";
import axios from "axios";
import ChatIcon from "../../../assets/chat.png";

const socket = io("http://localhost:5000");
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  console.log('messages',messages);
  
  const [typingStatus, setTypingStatus] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const lastMessageRef = useRef(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");
      if (userId && userName) {
        setCurrentUser({ id: userId, name: userName });
        socket.emit("newUser", { userId, userName, socketID: socket.id });
      }
    };
    fetchUserInfo();

    socket.on("newUserResponse", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("newUserResponse");
    };
  }, []);

  useEffect(() => {
    if (selectedContact && currentUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/chat/messages?userId1=${currentUser.id}&userId2=${selectedContact._id}`,
            { headers: { Authorization: token } }
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();

      const handleMessageResponse = (data) => {
        console.log("dattttaa", data);
        if (
          data.sender === selectedContact._id ||
          data.receiver === selectedContact._id
        ) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      };

      socket.on("messageResponse", handleMessageResponse);

      socket.on("typingResponse", (data) => {
        setTypingStatus(data.message);
      });

      return () => {
        socket.off("messageResponse", handleMessageResponse);
        socket.off("typingResponse");
      };
    }
  }, [selectedContact, currentUser]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectContact = (contact) => {
    // setMessages([]); // Clear messages when switching contacts
    setSelectedContact(contact);
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

  return (
    <>
      <div className="chat">
        <ChatBar
          selectContact={selectContact}
          users={users}
          currentUser={currentUser}
          onAddContact={handleAddContact}
        />
        <div className="chat__main">
          {selectedContact ? (
            <>
              <ChatBody
                messages={messages}
                typingStatus={typingStatus}
                lastMessageRef={lastMessageRef}
                user={selectedContact} 
              />
              <ChatFooter selectedContact={selectedContact} socket={socket} />
            </>
          ) : (
            <div className="start-chat">
              <img src={ChatIcon} alt="chat-icon" style={{ width: "100px" }} />
              <p>Sélectionnez un contact pour commencer à discuter.</p>
            </div>
          )}
        </div>
      </div>
      {/* <AddContact currentUser={currentUser} onAddContact={handleAddContact} /> */}
    </>
  );
};

export default ChatPage;
