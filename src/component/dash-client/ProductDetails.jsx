import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../CSS/ProductDetails.css";
import { useCart } from "../../contexts/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false); // For toggling the checkout modal
  const { addToCart } = useCart();
  const baseURL = "http://localhost:5000";

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const openCheckout = () => setShowCheckout(true);
  const closeCheckout = () => setShowCheckout(false);
  const handlePayment = () => {
    alert("Payment Successful!"); // Mock success alert
    closeCheckout();
  };

  const handleAction = () => {
    if (product.status === "don") {
      alert("Request sent to get this product!");
    } else if (product.status === "echange") {
      alert("Proceed to exchange this product.");
    } else {
      openCheckout();
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="custom-product-details container my-5">
      <div className="row">
        <div className="col-md-6">
          <div id="productCarousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                product.imageUrls.map((imageUrl, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <img
                      src={`${baseURL}${product.images[0]}`}
                      className="d-block w-100 custom-product-image"
                      alt={product.nom}
                    />
                  </div>
                ))
              ) : (
                <div className="carousel-item active">
                  <img
                    src="/placeholder.jpg"
                    alt="Placeholder"
                    className="d-block w-100 custom-product-image"
                  />
                </div>
              )}
            </div>
            <a
              className="carousel-control-prev"
              href="#productCarousel"
              role="button"
              data-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href="#productCarousel"
              role="button"
              data-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
        <div className="col-md-6 custom-product-info">
          <h2 className="custom-product-title">{product.nom}</h2>
          <p className="custom-product-description">{product.description}</p>
          <p><strong>Numéro de téléphone:</strong> {product.numtel}</p>
          <p><strong>Adresse:</strong> {product.adresse}</p>
          <p><strong>Ville:</strong> {product.ville}</p>
          <p><strong>Catégorie:</strong> {product.categorie}</p>
          <p><strong>Statut:</strong> {product.status}</p>
          {product.prix !== null && (
            <p><strong>Prix:</strong> {product.formattedPrice || product.prix}</p>
          )}
          {product.quantityDispo !== null && (
            <p><strong>Quantité disponible:</strong> {product.quantityDispo}</p>
          )}
          <div className="custom-button-group mt-4">
            <button
              className="custom-btn custom-add-to-cart"
              onClick={() => addToCart(product)}
            >
              Ajouter à la carte
            </button>
            <button className="custom-btn custom-buy-now" onClick={handleAction}>
              {product.status === "don"
                ? "Demander"
                : product.status === "echange"
                ? "Échanger"
                : "Acheter"}
            </button>
          </div>
        </div>
      </div>

      {showCheckout && (
        <div className="checkout-modal">
          <div className="checkout-modal-content">
            <h3>Stripe Checkout</h3>
            <p><strong>Product:</strong> {product.nom}</p>
            <p><strong>Amount:</strong> {product.prix} Dt</p>
            <input type="text" placeholder="Card Number" className="checkout-input" />
            <input type="text" placeholder="MM/YY" className="checkout-input" />
            <input type="text" placeholder="CVC" className="checkout-input" />
            <button onClick={handlePayment} className="custom-btn custom-confirm-btn">
              Confirm Payment
            </button>
            <button onClick={closeCheckout} className="custom-btn custom-cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
