import React from "react";
import "../../CSS/CartCheckout.css";
import { useCart } from "../../contexts/CartContext";

export const CartCheckout = () => {
  const { cart } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const prix =
        item.status === "echange" || item.status === "don"
          ? 0
          : parseFloat(item.prix) || 0;
      return total + prix * item.quantity;
    }, 0);
  };

  return (
    <div className="cart-checkout-container">
      <p className="cart-checkout-title">Votre panier</p>

      <div className="cart-checkout-info">
        {cart.map((item) => {
          const prix =
            item.status === "echange" || item.status === "don"
              ? 0
              : parseFloat(item.prix) || 0;
          const totalPrice = prix * item.quantity;
          console.log(item);
          

          return (
            <div key={item.id} className="cart-checkout-item">
              <p className="cart-checkout-text">
                ({item.quantity}) {item.nom} 
              </p>
              <p className="cart-checkout-text">
                {totalPrice.toFixed(2)} TND {/* Display total price */}
              </p>
            </div>
          );
        })}
       {/*  <hr />
        <div className="cart-checkout-item">
          <p className="cart-checkout-text">Livraison</p>
          <p className="cart-checkout-text">Gratuit</p>
        </div> */}
      </div>
      <hr />
      <div className="cart-checkout-item checkout-total">
        <p>Total TTC</p>
        <p>{calculateTotal().toFixed(2)} TND</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="cart-checkout-button">Commander</button>
      </div>
    </div>
  );
};
