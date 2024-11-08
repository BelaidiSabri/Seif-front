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
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={`${baseURL}${item.images[0]}` || "/placeholder.jpg"} alt={item.nom} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.nom}</h3>
                  <p>Price: {item.prix}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Total: {calculateTotal()} TND</h3>
            <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
