// Importation des bibliothèques nécessaires
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/ProductExchange.css';
import Cookies from "js-cookie";

const ProductExchange = ({ currentProduct }) => {
  // États pour gérer les données et le statut de l'interface utilisateur
  const [userProducts, setUserProducts] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const baseURL = "http://localhost:5000";
  const token = Cookies.get("token");

  // Chargement initial des données
  useEffect(() => {
    fetchUserProducts();
    fetchExchanges();
  }, []);

  useEffect(() => {
    filterExchanges(filter);
  }, [exchanges, filter]);

  // Récupération des produits de l'utilisateur
  const fetchUserProducts = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Aucun ID utilisateur trouvé');
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
      setError('Échec lors de la récupération de vos produits');
    }
  };

  // Récupération des demandes d'échange
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
      setError('Échec lors de la récupération des demandes d’échange');
    }
  };

  // Gestion des actions sur les échanges
  const handleExchangeAction = async (exchangeId, action) => {
    setLoading(true);
    try {
      let response;
      if (action === 'cancel') {
        response = await axios.post(`${baseURL}/exchange/${exchangeId}/cancel`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await axios.patch(`${baseURL}/exchange/${exchangeId}`, 
          { status: action === 'accept' ? 'accepted' : 'rejected' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      
      await fetchExchanges();
      setSuccessMessage(
        action === 'accept' ? 'Échange accepté avec succès !' :
        action === 'cancel' ? 'Échange annulé avec succès !' :
        'Échange refusé avec succès !'
      );
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Échec lors de ${action} l'échange`);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des échanges
  const filterExchanges = (status) => {
    if (status === 'all') {
      setFilteredExchanges(exchanges);
    } else {
      setFilteredExchanges(exchanges.filter(exchange => exchange.status === status));
    }
  };

  // Rendu des badges de statut
  const renderStatusBadge = (status) => {
    const statusClasses = {
      accepted: 'status-badge accepted',
      cancelled: 'status-badge cancelled',
      rejected: 'status-badge rejected',
      pending: 'status-badge pending'
    };
    
    return <span className={statusClasses[status] || statusClasses.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
  };

  // Rendu des actions disponibles pour chaque échange
  const renderExchangeActions = (exchange) => {
    if (exchange.status !== 'pending') return null;

    if (exchange.userRole === 'recipient') {
      return (
        <div className="exchange-actions">
          <button
            className="btn accept-btn"
            onClick={() => handleExchangeAction(exchange._id, 'accept')}
            disabled={loading}
          >
            Accepter l'échange
          </button>
          <button
            className="btn reject-btn"
            onClick={() => handleExchangeAction(exchange._id, 'reject')}
            disabled={loading}
          >
            Refuser l'échange
          </button>
        </div>
      );
    } else if (exchange.userRole === 'requester') {
      return (
        <div className="exchange-actions">
          <button
            className="btn cancel-btn"
            onClick={() => handleExchangeAction(exchange._id, 'cancel')}
            disabled={loading}
          >
            Annuler la demande
          </button>
        </div>
      );
    }
  };

  // Rendu principal du composant
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

      <div className="filter-controls">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Tous
        </button>
        <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
          En attente
        </button>
        <button className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`} onClick={() => setFilter('accepted')}>
          Acceptés
        </button>
        <button className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>
          Refusés
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Demandes d'échange</h2>
        </div>
        
        <div className="card-content">
          {filteredExchanges.length === 0 ? (
            <div className="empty-state">
              <p>Aucune demande d’échange trouvée</p>
              <p className="empty-state-subtitle">Vos demandes d’échange apparaîtront ici</p>
            </div>
          ) : (
            <div className="exchange-list">
              {filteredExchanges.map(exchange => (
                <div key={exchange._id} className="exchange-item">
                  <div className="exchange-header">
                    <div className="user-info">
                      <div className="exchange-description">
                        <span className="user-name">
                          {exchange.userRole === 'recipient' ? 
                            exchange.offeredBy.email : 
                            'Vous'} 
                        </span>
                        <span className="exchange-text">
                          {exchange.userRole === 'recipient' ? 
                            'souhaite échanger son produit contre le vôtre' : 
                            'a demandé un échange avec'}
                        </span>
                        {exchange.userRole === 'requester' && 
                          <span className="user-name">{exchange.requestedTo.email}</span>}
                      </div>
                    </div>
                    {renderStatusBadge(exchange.status)}
                  </div>

                  <div className="exchange-products">
                    <div className="product-card">
                      <div className="product-label">
                        {exchange.userRole === 'recipient' ? 'Son produit' : 'Votre produit'}
                      </div>
                      <img 
                        src={`${baseURL}${exchange.productOffered.images[0]}`}
                        alt={exchange.productOffered.nom}
                        className="exchange-product-image"
                      />
                      <h4>{exchange.productOffered.nom}</h4>
                    </div>

                    <div className="exchange-arrow">↔</div>

                    <div className="product-card">
                      <div className="product-label">
                        {exchange.userRole === 'recipient' ? 'Votre produit' : 'Son produit'}
                      </div>
                      <img 
                        src={`${baseURL}${exchange.productRequested.images[0]}`}
                        alt={exchange.productRequested.nom}
                        className="exchange-product-image"
                      />
                      <h4>{exchange.productRequested.nom}</h4>
                    </div>
                  </div>

                  {renderExchangeActions(exchange)}
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
