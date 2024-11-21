import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../CSS/PurchaseModal.css';

export const PurchaseModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onPurchaseSuccess 
}) => {
  const [purchaseMethod, setPurchaseMethod] = useState(null);
  const [formData, setFormData] = useState({
    online: {
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: ''
    },
    delivery: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: ''
    }
  });

  const handleInputChange = (method, field, value) => {
    setFormData(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const userId = localStorage.getItem('userId');

    try {
      const purchaseData = {
        productId: product._id,
        userId,
        purchaseMethod,
        ...(purchaseMethod === 'online' ? 
          { paymentDetails: formData.online } : 
          { deliveryDetails: formData.delivery }
        )
      };

      const response = await axios.post('http://localhost:5000/purchase', purchaseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      onPurchaseSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Échec de la transaction. Veuillez réessayer.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="purchase-modal-overlay">
      <div className="purchase-modal-content">
        <button className="purchase-modal-close" onClick={onClose}>×</button>
        <p className='purchase-modal-title'>Choisissez votre option de paiement</p>
        
        <div className="purchase-modal-options">
          <div 
            className={`purchase-option ${purchaseMethod === 'online' ? 'selected' : ''}`}
            onClick={() => setPurchaseMethod('online')}
          >
            <p className='purchase-modal-subtitle'>Paiement en Ligne</p>
            <p>Payez directement sur notre plateforme</p>
          </div>
          
          <div 
            className={`purchase-option ${purchaseMethod === 'delivery' ? 'selected' : ''}`}
            onClick={() => setPurchaseMethod('delivery')}
          >
            <p className='purchase-modal-subtitle'>Livraison</p>
            <p>Paiement à la livraison</p>
          </div>
        </div>

        {purchaseMethod === 'online' && (
          <form onSubmit={handleSubmit} className="purchase-form">
            <p>Détails de Paiement</p>
            <input 
              type="text" 
              placeholder="Nom sur la carte" 
              value={formData.online.cardName}
              onChange={(e) => handleInputChange('online', 'cardName', e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Numéro de carte" 
              value={formData.online.cardNumber}
              onChange={(e) => handleInputChange('online', 'cardNumber', e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Date d'expiration" 
              value={formData.online.expiry}
              onChange={(e) => handleInputChange('online', 'expiry', e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="CVV" 
              value={formData.online.cvv}
              onChange={(e) => handleInputChange('online', 'cvv', e.target.value)}
              required 
            />
            <button type="submit" className="purchase-submit-btn">Payer</button>
          </form>
        )}

        {purchaseMethod === 'delivery' && (
          <form onSubmit={handleSubmit} className="purchase-form">
            <p>Détails de Livraison</p>
            <input 
              type="text" 
              placeholder="Nom complet" 
              value={formData.delivery.fullName}
              onChange={(e) => handleInputChange('delivery', 'fullName', e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Adresse" 
              value={formData.delivery.address}
              onChange={(e) => handleInputChange('delivery', 'address', e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Ville" 
              value={formData.delivery.city}
              onChange={(e) => handleInputChange('delivery', 'city', e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Code postal" 
              value={formData.delivery.postalCode}
              onChange={(e) => handleInputChange('delivery', 'postalCode', e.target.value)}
              required 
            />
            <input 
              type="tel" 
              placeholder="Numéro de téléphone" 
              value={formData.delivery.phone}
              onChange={(e) => handleInputChange('delivery', 'phone', e.target.value)}
              required 
            />
            <button type="submit" className="purchase-submit-btn">Confirmer la Livraison</button>
          </form>
        )}
      </div>
    </div>
  );
};