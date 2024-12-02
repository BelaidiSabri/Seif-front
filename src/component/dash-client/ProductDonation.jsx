import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/ProductExchange.css';
import Cookies from "js-cookie";

const ProductDonation = () => {
  const [donations, setDonations] = useState([]);
  console.log(donations);
  
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const baseURL = "http://localhost:5000";
  const token = Cookies.get("token");

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    filterDonations(filter);
  }, [donations, filter]);

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`${baseURL}/donation`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDonations(response.data.donations);
    } catch (err) {
      setError('Échec lors de la récupération des dons');
    }
  };

  const handleDonationAction = async (donationId, action) => {
    setLoading(true);
    try {
      const response = await axios.patch(`${baseURL}/donation/${donationId}`, 
        { status: action === 'accept' ? 'accepted' : 'rejected' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      await fetchDonations();
      setSuccessMessage(
        action === 'accept' ? 'Don accepté avec succès !' : 'Don refusé avec succès !'
      );
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Échec lors de ${action} du don`);
    } finally {
      setLoading(false);
    }
  };

  const filterDonations = (status) => {
    if (status === 'all') {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(donations.filter(donation => donation.status === status));
    }
  };

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

  const renderDonationActions = (donation) => {
    if (donation.status !== 'pending' || !donation.actions.canAccept) return null;

    return (
      <div className="exchange-actions">
        <button
          className="exchange-btn accept-btn"
          onClick={() => handleDonationAction(donation._id, 'accept')}
          disabled={loading}
        >
          Accepter le don
        </button>
        <button
          className="exchange-btn reject-btn"
          onClick={() => handleDonationAction(donation._id, 'reject')}
          disabled={loading}
        >
          Refuser le don
        </button>
      </div>
    );
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
          <h2>Demandes de Dons</h2>
        </div>
        
        <div className="card-content">
          {filteredDonations.length === 0 ? (
            <div className="empty-state">
              <p>Aucune demande de don trouvée</p>
              <p className="empty-state-subtitle">Vos demandes de dons apparaîtront ici</p>
            </div>
          ) : (
            <div className="exchange-list">
              {filteredDonations.map(donation => (
                <div key={donation._id} className="exchange-item">
                  <div className="exchange-header">
                    <div className="user-info">
                      <div className="exchange-description">
                        <span className="user-name">
                          {donation.userRole === 'recipient' ? 
                            donation.donatedBy.email : 
                            'Vous'} 
                        </span>
                        <span className="exchange-text">
                          {donation.userRole === 'recipient' ? 
                            'souhaite vous faire un don' : 
                            'a proposé un don à'}
                        </span>
                        {donation.userRole === 'donor' && 
                          <span className="user-name">{donation.donatedTo.email}</span>}
                      </div>
                    </div>
                    {renderStatusBadge(donation.status)}
                  </div>

                  <div className="exchange-products">
                    <div className="exchange-product-card">
                      <div className="product-label">
                        {donation.userRole === 'recipient' ? 'Don proposé' : 'Votre don'}
                      </div>
                      <div className='exchange-item-wrapper'>
                        <img 
                          src={`${baseURL}${donation.product.images[0]}`}
                          alt={donation.product.nom}
                          className="exchange-product-image"
                        />
                        <h4>{donation.product.nom}</h4>
                      </div>
                    </div>
                  </div>

                  {renderDonationActions(donation)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDonation;