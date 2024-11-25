import React, { useState } from "react";
import { CommandModal } from "./CommandModal";
import axios from "axios";
import Cookies from "js-cookie";
import "../../CSS/CartCheckout.css";
import { useCart } from "../../contexts/CartContext";

export const CartCheckout = ({ isOpen, onClose, onPurchaseSuccess }) => {
  const { cart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.status === "echange" || item.status === "don" 
        ? 0 
        : parseFloat(item.prix) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const validateCartItems = () => {
    for (const item of cart) {
      if (!item._id || !item.user?._id || !item.quantity || !item.prix) {
        return false;
      }
      if (item.quantity > item.quantityDispo) {
        setError(`Quantité insuffisante pour ${item.nom}`);
        return false;
      }
    }
    return true;
  };

  const handlePurchase = async (paymentDetails) => {
    setIsProcessing(true);
    setError(null);
    
    const token = Cookies.get("token");
    const userId = localStorage.getItem("userId");

    if (!validateCartItems()) {
      setIsProcessing(false);
      return false;
    }

    try {
      const purchaseData = {
        buyer: userId,
        products: cart.map(item => ({
          product: item._id,
          seller: item.user._id, // Using user._id instead of seller
          quantity: item.quantity,
          price: item.prix
        })),
        totalAmount: calculateTotal(),
        paymentMethod: paymentDetails.paymentMethod,
        paymentStatus: paymentDetails.paymentMethod === 'online' ? 'completed' : 'pending'
      };

      console.log('Purchase Data:', purchaseData); // For debugging

      const response = await axios.post(
        "http://localhost:5000/transactions", 
        purchaseData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onPurchaseSuccess(response.data);
      return true;
    } catch (error) {
      console.error("Transaction error:", error);
      
      // Handle specific error cases
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError(error.response.data.message || "Données de transaction invalides");
            break;
          case 401:
            setError("Session expirée. Veuillez vous reconnecter");
            break;
          case 404:
            setError("Produit non trouvé ou indisponible");
            break;
          default:
            setError("Échec de la transaction. Veuillez réessayer");
        }
      } else {
        setError("Erreur de connexion. Vérifiez votre connexion internet");
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = () => {
    setError(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setError(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="cart-checkout-container">
        <p className="cart-checkout-title">Votre panier</p>

        <div className="cart-checkout-info">
          {cart.map((item) => {
            const price = item.status === "echange" || item.status === "don" 
              ? 0 
              : parseFloat(item.prix) || 0;
            const totalPrice = price * item.quantity;

            return (
              <div key={item._id} className="cart-checkout-item">
                <p className="cart-checkout-text">
                  {item.quantity === item.quantityDispo
                    ? `(${item.quantityDispo} max)`
                    : `(${item.quantity})`} {item.nom}
                </p>
                <p className="cart-checkout-text">{totalPrice.toFixed(2)} TND</p>
              </div>
            );
          })}
        </div>
        
        <hr />
        
        <div className="cart-checkout-item checkout-total">
          <p>Total TTC</p>
          <p>{calculateTotal().toFixed(2)} TND</p>
        </div>

        {error && (
          <div className="cart-checkout-error">
            {error}
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button 
            className="cart-checkout-button" 
            onClick={openModal}
            disabled={isProcessing}
          >
            {isProcessing ? "Traitement..." : "Commander"}
          </button>
        </div>
      </div>

      <CommandModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onPurchase={handlePurchase}
        cart={cart}
        isProcessing={isProcessing}
        error={error}
      />
    </>
  );
};