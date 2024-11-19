import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import "../../CSS/Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart, addToCart, updateQuantity } =
    useCart();
  const [showCheckout, setShowCheckout] = useState(false);



  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const prix =
        item.status === "echange" || item.status === "don"
          ? 0
          : parseFloat(item.prix) || 0;
      return total + prix * item.quantity;
    }, 0);
  };

  const openCheckout = () => setShowCheckout(true);
  const closeCheckout = () => setShowCheckout(false);

  const handlePayment = () => {
    alert("Paiement réussi!");
    clearCart();
    closeCheckout();
  };

  if (cart.length === 0) {
    return (
      <div className="cart-list-container my-5 text-center">
        <h2>Votre Panier est Vide</h2>
      </div>
    );
  }

  return (
    <div className="cart-list-container">
      <p className="cart-list-title">Panier</p>

      <table className="cart-list-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} className="cart-list-row">
              <td className="cart-list-item cart-list-product">
                <img
                  src={`http://localhost:5000${item.images[0]}`}
                  alt={item.nom}
                  className="cart-list-item-image"
                />
                <span>{item.nom}</span>
              </td>
              <td className="cart-list-price">
                {item.status === "echange" || item.status === "don"
                  ? "0"
                  : item.prix}{" "}
                Dt
              </td>
              <td className="cart-list-item">
                <div className="cart-list-quantity">
                  <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="cart-list-quantity-input"
                  />
                  <div className="cart-list-quantity-controls">
                    <button
                      className="cart-list-quantity-btn cart-list-quantity-increase"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="cart-list-quantity-btn cart-list-quantity-decrease"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                      }
                    >
                      -
                    </button>
                  </div>
                </div>
              </td>
              <td className="cart-list-total">
                {(item.status === "echange" || item.status === "don"
                  ? 0
                  : item.prix * item.quantity
                ).toFixed(2)}{" "}
                Dt
              </td>
              <td className="cart-list-action">
                <button
                  className="cart-list-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    {/*   <div className="cart-list-summary">
        <h4>Total: {calculateTotal().toFixed(2)} Dt</h4>
        <div className="cart-list-actions">
          <button
            className="cart-list-btn cart-list-buy-now"
            onClick={openCheckout}
          >
            Acheter
          </button>
        </div>
      </div> */}
          <button
            className="cart-list-btn cart-list-clear-cart"
            onClick={clearCart}
          >
            Vider le Panier
          </button>

{/*       {showCheckout && (
        <div className="cart-list-checkout-modal">
          <div className="cart-list-checkout-modal-content">
            <h3>Paiement par Stripe</h3>
            <p>
              <strong>Montant Total:</strong> {calculateTotal().toFixed(2)} Dt
            </p>
            <button
              onClick={handlePayment}
              className="cart-list-btn cart-list-confirm-btn"
            >
              Confirmer le Paiement
            </button>
            <button
              onClick={closeCheckout}
              className="cart-list-btn cart-list-cancel-btn"
            >
              Annuler
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Cart;
