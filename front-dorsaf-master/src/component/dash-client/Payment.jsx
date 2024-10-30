import React from "react";
import { useLocation } from "react-router-dom";
import "../../CSS/Payment.css";
import Footer from "./Footer";

function Payment() {
  const location = useLocation();
  const offer = location.state?.offer; // Product data from the previous page

  return (
    <>
      <div className="checkout-container">
        <div className="checkout-content">
          <h1>Checkout</h1>

          <div className="product-details">
            <img src={"/livres.jpg"} alt="Book" className="checkout-image" />
            <div className="checkout-info">
              <h2>{offer?.nom || "Titre du livre"}</h2>
              <p className="checkout-price">
                {offer?.prix ? `${offer.prix} DT` : "Prix non disponible"}
              </p>
              <p className="checkout-description">
                {offer?.description ||
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
              </p>
            </div>
          </div>

          <button className="confirm-button">Confirm Purchase</button>
        </div>

        <div className="sidebar">
          <h3>Payment Info</h3>
          <div className="user-info">
            <label htmlFor="username">Full Name</label>
            <input type="text" id="username" placeholder="Mohamed Truki" />

            <label htmlFor="address">Address</label>
            <input type="text" id="address" placeholder="Sfax" />

            <label htmlFor="credit-card">Credit Card</label>
            <input type="text" id="credit-card" placeholder="1234 5678 9101 1121" />

            <label htmlFor="expiry">Expiry Date</label>
            <input type="text" id="expiry" placeholder="MM/YY" />

            <label htmlFor="cvv">CVV</label>
            <input type="text" id="cvv" placeholder="123" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Payment;
