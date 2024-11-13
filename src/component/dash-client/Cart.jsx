import React, { useState } from 'react';
import { useCart } from "../../contexts/CartContext";
import "../../CSS/Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  console.log("cattrt",cart);
  

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const prix = item.status === "echange" || item.status === "don" ? 0 : parseFloat(item.prix) || 0;
      return total + prix;
    }, 0);
  };

  const openCheckout = () => setShowCheckout(true);
  const closeCheckout = () => setShowCheckout(false);

  const handlePayment = () => {
    alert("Paiement réussi!"); // Mock success alert in French
    clearCart();
    closeCheckout();
  };

  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2>Votre Panier est Vide</h2>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Panier</h2>

      <div className="cart-items-container">
        {cart.map((item) => (
          <div key={item.id} className="custom-cart-item mb-3">
            <div className="custom-cart-item-content d-flex justify-content-between align-items-center p-3">
              <div>
                <h5 className="custom-cart-item-title">{item.nom}</h5>
                <p className="custom-cart-item-price">
                  <strong>Prix:</strong> {item.status === "echange" || item.status === "don" ? "0" : item.prix} Dt
                </p>
              </div>
              <button
                className="custom-remove-btn"
                onClick={() => removeFromCart(item)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary mt-4">
        <h4>Total: {calculateTotal().toFixed(2)} Dt</h4>
        <div className="d-flex gap-2">
          <button
            className="custom-btn custom-buy-now"
            onClick={openCheckout}
          >
            Acheter
          </button>
          <button
            className="custom-btn custom-cancel-btn"
            onClick={clearCart}
          >
            Vider le Panier
          </button>
        </div>
      </div>

      {showCheckout && (
        <div className="checkout-modal">
          <div className="checkout-modal-content">
            <h3>Paiement par Stripe</h3>
            <p><strong>Montant Total:</strong> {calculateTotal().toFixed(2)} Dt</p>

            <div className="cart-items-summary">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-summary-row">
                  <small>{item.nom} - {item.status === "échange" || item.status === "don" ? "0" : item.prix} Dt</small>
                </div>
              ))}
            </div>

            <input type="text" placeholder="Numéro de carte" className="checkout-input" />
            <input type="text" placeholder="MM/AA" className="checkout-input" />
            <input type="text" placeholder="CVC" className="checkout-input" />

            <button onClick={handlePayment} className="custom-btn custom-confirm-btn">
              Confirmer le Paiement
            </button>
            <button onClick={closeCheckout} className="custom-btn custom-cancel-btn">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
