import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../CSS/ProductDetails.css";
import Cookies from "js-cookie";
import { useCart } from "../../contexts/CartContext";
import notAvailableImg from "../../assets/Product-inside.png";
import CommandModal from "./CommandModal";



const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [userExchangeProducts, setUserExchangeProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useCart();
  const baseURL = "http://localhost:5000";
  const token = Cookies.get("token");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch product details by ID
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

  // Fetch user's exchange products
  useEffect(() => {
    const fetchUserExchangeProducts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(`${baseURL}/product/user/products`, {
            params: { userId },
          });
          setUserExchangeProducts(
            response.data.products.filter(
              (product) => product.status === "echange"
            )
          );
        }
      } catch (error) {
        console.error("Error fetching user's exchange products:", error);
      }
    };

    if (showExchangeModal) {
      fetchUserExchangeProducts();
    }
  }, [showExchangeModal]);

  const openCheckout = () => setShowCheckout(true);
  const closeCheckout = () => setShowCheckout(false);
  const openExchangeModal = () => setShowExchangeModal(true);
  const closeExchangeModal = () => setShowExchangeModal(false);

  const handlePurchase = async (paymentDetails) => {
    try {
      const token = Cookies.get("token");
      const userId = localStorage.getItem("userId");

      // Validate product availability
      if (product.quantityDispo <= 0) {
        alert("Produit en rupture de stock");
        return false;
      }

      const purchaseData = {
        buyer: userId,
        products: [{
          product: product._id,
          seller: product.user?._id, // Assuming there's a user field for the seller
          quantity: 1, // Default to 1 for single product purchase
          price: product.prix
        }],
        totalAmount: product.prix,
        paymentMethod: paymentDetails.paymentMethod,
        paymentStatus: paymentDetails.paymentMethod === 'online' ? 'completed' : 'pending'
      };

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

      alert('Achat effectué avec succès!');
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error("Transaction error:", error);
      
      // Handle specific error cases
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert(error.response.data.message || "Données de transaction invalides");
            break;
          case 401:
            alert("Session expirée. Veuillez vous reconnecter");
            break;
          case 404:
            alert("Produit non trouvé ou indisponible");
            break;
          default:
            alert("Échec de la transaction. Veuillez réessayer");
        }
      } else {
        alert("Erreur de connexion. Vérifiez votre connexion internet");
      }
      return false;
    }
  };

  const handleExchange = async () => {
    if (!selectedProduct) {
      alert("Please select a product to exchange.");
      return;
    }

    try {
      await axios.post(
        `${baseURL}/exchange`,
        {
          productOfferedId: selectedProduct._id,
          productRequestedId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Exchange request sent!");
      closeExchangeModal();
    } catch (error) {
      alert("Error sending exchange request.");
    }
  };

  const handleAction = async () => {
    if (product.status === "don") {
      try {
        const userId = localStorage.getItem("userId"); 
        if (!userId) {
          alert("User not logged in.");
          return;
        }
  
        const response = await axios.post(
          `${baseURL}/donation`,
          {
            productId: product._id,
            recipientUserId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        alert("Donation request sent successfully!");
      } catch (error) {
        console.error("Error sending donation request:", error);
        alert(
          error.response?.data?.message ||
            "Failed to send donation request. Please try again later."
        );
      }
    } else if (product.status === "echange") {
      openExchangeModal();
    } else {
      setIsModalOpen(true);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="custom-product-details container my-5">
      <div className="row">
        <div className="col-md-6">
          <div
            id="productCarousel"
            className="carousel slide"
            data-ride="carousel"
          >
              <div className="carousel-inner">
                    <img
                      src={`${baseURL}${product.images[0]}`}
                      className="d-block w-100 custom-product-image"
                      alt={product.nom}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = notAvailableImg; 
                      }}
                    />
            </div>
          </div>
        </div>
        <div className="col-md-6 custom-product-info">
          <h2 className="custom-product-title">{product.nom}</h2>
          <p className="custom-product-description">{product.description}</p>
          <p>
            <strong>Numéro de téléphone:</strong> {product.numtel}
          </p>
          <p>
            <strong>Adresse:</strong> {product.adresse}
          </p>
          <p>
            <strong>Ville:</strong> {product.ville}
          </p>
          <p>
            <strong>Catégorie:</strong> {product.categorie}
          </p>
          <p>
            <strong>Statut:</strong> {product.status}
          </p>
          {product.prix !== null && (
            <p>
              <strong>Prix:</strong> {product.formattedPrice || product.prix}
            </p>
          )}
          {product.quantityDispo !== null && (
            <p>
              <strong>Quantité disponible:</strong> {product.quantityDispo}
            </p>
          )}
          <div className="custom-button-group mt-4">
            {product.status !== "don" && product.status !== "echange" && (
              <button
                className="custom-btn custom-add-to-cart"
                onClick={() => addToCart(product)}
              >
                Ajouter au panier
              </button>
            )}
            <button
              className="custom-btn custom-buy-now"
              onClick={handleAction}
            >
              {product.status === "don"
                ? "Demander"
                : product.status === "echange"
                ? "Échanger"
                : "Acheter"}
            </button>
          </div>
        </div>
      </div>

    {/*   {showCheckout && (
        <div className="checkout-modal">
          <div className="checkout-modal-content">
            <h3>Stripe Checkout</h3>
            <p>
              <strong>Product:</strong> {product.nom}
            </p>
            <p>
              <strong>Amount:</strong> {product.prix} Dt
            </p>
            <input
              type="text"
              placeholder="Card Number"
              className="checkout-input"
            />
            <input type="text" placeholder="MM/YY" className="checkout-input" />
            <input type="text" placeholder="CVC" className="checkout-input" />
            <button
              onClick={handlePayment}
              className="custom-btn custom-confirm-btn"
            >
              Confirm Payment
            </button>
            <button
              onClick={closeCheckout}
              className="custom-btn custom-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}

{showExchangeModal && (
  <div className="exchange-modal">
    <div className="exchange-modal-content">
      <h3>Échanger un Produit</h3>
      <p>Sélectionnez le produit que vous souhaitez échanger :</p>
      {userExchangeProducts.length === 0 ? (
        <p>Aucun produit disponible pour échange.</p>
      ) : (
        <div className="product-selection">
          {userExchangeProducts.map((prod) => (
            <div
              key={prod._id}
              className={`product-item ${
                selectedProduct?._id === prod._id ? "selected" : ""
              }`}
              onClick={() => setSelectedProduct(prod)}
            >
              <img
                src={`${baseURL}${prod.imageUrls[0]}`}
                alt={prod.nom}
              />
              <h4>{prod.nom}</h4>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleExchange}
        className="custom-btn custom-confirm-btn"
      >
        Soumettre l'Échange
      </button>
      <button
        onClick={closeExchangeModal}
        className="custom-btn custom-cancel-btn"
      >
        Annuler
      </button>
    </div>
  </div>
)}
 <CommandModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onPurchase={handlePurchase}
        // product={product} // Optional: pass product details to the modal
      />

    </div>
  );
};

export default ProductDetails;

/*     <PurchaseModal
  product={product}
  isOpen={showPurchaseModal}
  onClose={() => setShowPurchaseModal(false)}
  onPurchaseSuccess={handlePurchaseSuccess}
/> */