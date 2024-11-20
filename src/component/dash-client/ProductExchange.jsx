import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/ProductExchange.css';
import Cookies from "js-cookie";

const ProductExchange = ({ currentProduct }) => {
  const [userProducts, setUserProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const baseURL = "http://localhost:5000";
  const token = Cookies.get("token");

  useEffect(() => {
    fetchUserProducts();
    fetchExchanges();
  }, []);


  const deleteAll = async () => {
    try {
      const response = await axios.delete(`${baseURL}/exchange`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert(response.data.message || "All exchanges deleted successfully.");
      // Optionally, refresh exchanges or user products after deletion
      fetchExchanges();
      fetchUserProducts();
    } catch (err) {
      console.error("Error deleting all exchanges:", err);
      alert("Failed to delete all exchanges. Please try again.");
    }
  };
  

  const fetchUserProducts = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('No user ID found');
        return;
      }
      const response = await axios.get(`${baseURL}/product/user/products`, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUserProducts(response.data.products.filter(product => product.status === 'echange'));
    } catch (err) {
      setError('Failed to fetch your products');
    }
  };

  const fetchExchanges = async () => {
    try {
      const response = await axios.get(`${baseURL}/exchange`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // Filter out rejected exchanges before setting state
      const filteredExchanges = response.data.exchanges.filter(exchange => 
        exchange.status !== 'rejected'
      );
      setExchanges(filteredExchanges);
    } catch (err) {
      setError('Failed to fetch exchange requests');
    }
  };

  const handleExchangeResponse = async (exchangeId, status) => {
    setLoading(true);
    try {
      await axios.patch(`${baseURL}/exchange/${exchangeId}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      await Promise.all([fetchExchanges(), fetchUserProducts()]);
      setSuccessMessage(`Exchange ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${status} exchange`);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      accepted: 'status-badge accepted',
      cancelled: 'status-badge cancelled',
      pending: 'status-badge pending'
    };
    
    return <span className={statusClasses[status] || statusClasses.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
  };

  return (
    <div className="product-exchange-container">
        <button onClick={deleteAll}>
            delete all 
        </button>
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="close-btn" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          <span>{successMessage}</span>
          <button className="close-btn" onClick={() => setSuccessMessage('')}>×</button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Exchange Requests</h2>
        </div>
        
        <div className="card-content">
          {exchanges.length === 0 ? (
            <div className="empty-state">
              <p>No exchange requests found</p>
              <p className="empty-state-subtitle">Your exchange requests will appear here</p>
            </div>
          ) : (
            <div className="exchange-list">
              {exchanges.map(exchange => (
                <div key={exchange._id} className="exchange-item">
                  <div className="exchange-header">
                    <div className="user-info">
                      <div className="exchange-description">
                        <span className="user-name">{exchange.offeredBy.email}</span>
                        <span className="exchange-text">wants to exchange their product with yours</span>
                      </div>
                    </div>
                    {renderStatusBadge(exchange.status)}
                  </div>

                  <div className="exchange-products">
                    <div className="product-card">
                      <div className="product-label">Their Product</div>
                     {/*  <img 
                        src={`${baseURL}${exchange.productOffered.images[0]}`}
                        alt={exchange.productOffered.nom}
                        className="exchange-product-image"
                      /> */}
                      {/* <h4>{exchange.productOffered.nom}</h4> */}
                    </div>

                    <div className="exchange-arrow">↔</div>

                    <div className="product-card">
                      <div className="product-label">Your Product</div>
                     {/*  <img 
                        src={`${baseURL}${exchange.productRequested.images[0]}`}
                        alt={exchange.productRequested.nom}
                        className="exchange-product-image"
                      />
                      <h4>{exchange.productRequested.nom}</h4> */}
                    </div>
                  </div>

                  {exchange.status === 'pending' && (
                    <div className="exchange-actions">
                      <button
                        className="btn accept-btn"
                        onClick={() => handleExchangeResponse(exchange._id, 'accepted')}
                        disabled={loading}
                      >
                        Accept Exchange
                      </button>
                      <button
                        className="btn reject-btn"
                        onClick={() => handleExchangeResponse(exchange._id, 'rejected')}
                        disabled={loading}
                      >
                        Decline Exchange
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductExchange;