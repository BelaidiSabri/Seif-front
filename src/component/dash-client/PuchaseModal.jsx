import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../CSS/PurchaseModal.css';

export const PurchaseModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onTransactionSuccess 
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
      // Prepare transaction data based on method (online or delivery)
      const transactionData = {
        userId,
        purchaseMethod,
        cartItems: product.cartItems.map(item => ({
          productId: item._id,
          price: item.price,
          sellerId: item.sellerId,
          quantity: item.quantity // Ensure quantity is included in the transaction
        })),
        ...(purchaseMethod === 'online' 
          ? { 
              paymentDetails: formData.online 
          } 
          : { 
              deliveryDetails: formData.delivery 
          })
      };

      // Send the transaction request
      const response = await axios.post('http://localhost:5000/transaction', transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Notify parent component about the successful transaction
      onTransactionSuccess(response.data);
      onClose(); // Close the modal
    } catch (error) {
      console.error('Transaction error:', error);
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
            <button onClick={()=>{console.log(product);
            }} >test</button>
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
