import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatFooter.css";

const ChatFooter = ({ selectedContact, socket }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeProducts, setExchangeProducts] = useState([]);
  const textareaRef = useRef(null);
  const baseUrl = "http://localhost:5000";

  const handleTyping = () => {
    socket.emit("typing", {
      message: `${localStorage.getItem("userName")} est en train d'écrire`,
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
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  };

  const toggleExchangeModal = async () => {
    if (!showExchangeModal) {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${baseUrl}/product/user/products?userId=${userId}`);
        const userExchangeProducts = response.data.products.filter(
          (product) => product.status === "echange"
        );
        setExchangeProducts(userExchangeProducts);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    }
    setShowExchangeModal(!showExchangeModal);
  };

  const handleSelectProduct = (productId) => {
    // Add logic for selecting a product and closing the modal if needed
    console.log("Selected product ID:", productId);
    setShowExchangeModal(false);
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
          placeholder="Tapez un message..."
          className="message-type"
          rows={1}
          style={{
            overflow: "hidden",
            resize: "none",
            height: isFocused ? "auto" : "40px",
          }}
        />
        <div className="buttons-wrapper">
          <button type="submit" className="send-button">
            <i className="fa fa-paper-plane send-icon" aria-hidden="true"></i>
          </button>
          <button type="button" className="exchange-button" onClick={toggleExchangeModal}>
            Échanger
          </button>
        </div>
      </form>

      {showExchangeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={toggleExchangeModal}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Échange de Produits</h3>
            {exchangeProducts.length > 0 ? (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {exchangeProducts.map((product) => (
                  <li
                    key={product._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <button
                      onClick={() => handleSelectProduct(product._id)}
                      style={{
                        marginRight: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Select
                    </button>
                    <img
                      src={`${baseUrl}${product.images[0]}`}
                      alt={product.nom}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginRight: "10px",
                      }}
                    />
                    <span>{product.nom}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun produit disponible pour échange.</p>
            )}
            <button
              onClick={toggleExchangeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default ChatFooter;
