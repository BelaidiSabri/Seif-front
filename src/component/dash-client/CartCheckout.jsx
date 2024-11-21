import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { CommandModal } from "./CommandModal";
import "../../CSS/CartCheckout.css";

export const CartCheckout = () => {
  const { cart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const prix =
        item.status === "echange" || item.status === "don"
          ? 0
          : parseFloat(item.prix) || 0;
      return total + prix * item.quantity;
    }, 0);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="cart-checkout-container">
        <p className="cart-checkout-title">Votre panier</p>

        <div className="cart-checkout-info">
          {cart.map((item) => {
            const prix =
              item.status === "echange" || item.status === "don"
                ? 0
                : parseFloat(item.prix) || 0;
            const totalPrice = prix * item.quantity;

            return (
              <div key={item.id} className="cart-checkout-item">
                <p className="cart-checkout-text">
                  {item.quantity === item.quantityDispo 
                    ? `(${item.quantityDispo} max)` 
                    : `(${item.quantity})` 
                  } {item.nom} 
                </p>
                <p className="cart-checkout-text">
                  {totalPrice.toFixed(2)} TND
                </p>
              </div>
            );
          })}
        </div>
        <hr />
        <div className="cart-checkout-item checkout-total">
          <p>Total TTC</p>
          <p>{calculateTotal().toFixed(2)} TND</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button 
            className="cart-checkout-button" 
            onClick={openModal}
          >
            Commander
          </button>
        </div>
      </div>

      <CommandModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};