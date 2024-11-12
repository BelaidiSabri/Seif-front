import '../../CSS/ProductCard.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductComponent = ({ product }) => {
  const baseURL = "http://localhost:5000";
  
  return (
    <div className="product-card-container shadow-sm rounded">
      <img
        src={product.images.length > 0 ? `${baseURL}${product.images[0]}` : "https://via.placeholder.com/200x150"}
        className="product-card-image"
        alt={product.nom}
      />
      <div className="product-card-body">
        <h5 className="product-card-title">{product.nom}</h5>
        <p className="product-card-category text-muted">{product.categorie}</p>
        <p className="product-card-price">
          <strong>Prix:</strong> {product.status === 'vente' ? product.formattedPrice : product.status}
        </p>
        <p className="product-card-location"><strong>Ville:</strong> {product.ville}</p>
        <p className="product-card-contact"><strong>Contact:</strong> {product.numtel || 'Non disponible'}</p>
      </div>
    </div>
  );
};

export default ProductComponent;
