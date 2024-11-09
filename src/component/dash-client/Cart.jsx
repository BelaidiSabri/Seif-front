import React from "react";
import "../../CSS/Cart.css";
import { useCart } from "../../contexts/CartContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const baseURL = "http://localhost:5000";


  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <div className="cart-title">
      <i class="fa-solid fa-cart-shopping fa-2x" style={{scale:'0.8'}}></i>
      <h3>Panier</h3>
      </div>
      {cart.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item-wrapper">
                <img src={`${baseURL}${item.images[0]}` || "/placeholder.jpg"} alt={item.nom} className="cart-item-image" />
                <div className="cart-item-details">
                  <div className="cart-info">
                  <h3>{item.nom}</h3>
                  <p>Prix: {item.prix}</p>
                  <p>Quantité: {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">Retirer</button>
                </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h4>Total: {calculateTotal()} TND</h4>
            <button onClick={clearCart} className="clear-cart-btn">Vider le panier</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
