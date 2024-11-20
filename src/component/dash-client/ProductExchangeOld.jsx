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
      setExchanges(response.data.exchanges);
    } catch (err) {
      setError('Failed to fetch exchange requests');
    }
  };

/*   const proposeExchange = async () => {
    if (!selectedProduct) {
      setError('Please select a product to exchange');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${baseURL}/exchange`, {
        productOffered: selectedProduct._id,
        productRequested: currentProduct._id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage('Exchange proposal sent successfully!');
      setSelectedProduct(null);
      await fetchExchanges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to propose exchange');
    } finally {
      setLoading(false);
    }
  };
 */
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
      rejected: 'status-badge rejected',
      cancelled: 'status-badge cancelled',
      pending: 'status-badge pending'
    };
    
    return <span className={statusClasses[status] || statusClasses.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
  };



  return (
    <div className="product-exchange-container">
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

     {/*  <div className="card">
        <div className="card-header">
          <h2>Select Your Product to Exchange</h2>
          <span className="product-count">
            {userProducts.length} products available
          </span>
        </div>
        
        <div className="card-content">
          {userProducts.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any products available for exchange</p>
              <p className="empty-state-subtitle">Add products to your inventory to start exchanging</p>
            </div>
          ) : (
            <>
              <div className="product-list">
                {userProducts.map(product => (
                  <div 
                    key={product._id} 
                    className={`product-item ${selectedProduct?._id === product._id ? 'selected' : ''}`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="product-image-container">
                      <img 
                        src={`${baseURL}${product.images[0]}`} 
                        alt={product.nom}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.nom}</h3>
                      <p className="product-description">{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="action-container">
                <button 
                  className="btn primary-btn"
                  onClick={proposeExchange}
                  disabled={!selectedProduct || loading}
                >
                  {loading ? 'Processing...' : 'Propose Exchange'}
                </button>
              </div>
            </>
          )}
        </div>
      </div> */}

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
                console.log('test',exchange),
                
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
                      <img 
                        src={`${baseURL}${exchange.productOffered.images[0]}`}
                        alt={exchange.productOffered.nom}
                        className="exchange-product-image"
                      />
                      <h4>{exchange.productOffered.nom}</h4>
                    </div>

                    <div className="exchange-arrow">↔</div>

                    <div className="product-card">
                      <div className="product-label">Your Product</div>
                      <img 
                        src={`${baseURL}${exchange.productRequested.images[0]}`}
                        alt={exchange.productRequested.nom}
                        className="exchange-product-image"
                      />
                      <h4>{exchange.productRequested.nom}</h4>
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