import React, { useState } from 'react';
import '../../CSS/CommandModal.css';

export const CommandModal = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
    console.log('Submitting with method:', paymentMethod);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="commander-modal-overlay">
      <div className="commander-modal-content">
        <button className="commander-modal-close" onClick={onClose}>×</button>
        <p className='command-modal-title'>Choisissez votre option</p>
        
        <div className="commander-modal-options">
          <div 
            className={`commander-option ${paymentMethod === 'online' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('online')}
          >
            <p className='command-modal-subtitle'>Paiement en Ligne</p>
            <p>Payez directement sur notre plateforme</p>
          </div>
          
          <div 
            className={`commander-option ${paymentMethod === 'livraison' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('livraison')}
          >
            <p className='command-modal-subtitle'>Livraison</p>
            <p>Paiement à la livraison</p>
          </div>
        </div>

        {paymentMethod === 'online' && (
          <form className="commander-form" onSubmit={handleSubmit}>
            <p>Détails de Paiement en Ligne</p>
            <input type="text" placeholder="Nom sur la carte" required />
            <input type="text" placeholder="Numéro de carte" required />
            <input type="text" placeholder="Date d'expiration" required />
            <input type="text" placeholder="CVV" required />
            <button type="submit" className="commander-submit-btn">Payer</button>
          </form>
        )}

        {paymentMethod === 'livraison' && (
          <form className="commander-form" onSubmit={handleSubmit}>
            <p>Détails de Livraison</p>
            <input type="text" placeholder="Nom complet" required />
            <input type="text" placeholder="Adresse" required />
            <input type="text" placeholder="Ville" required />
            <input type="text" placeholder="Code postal" required />
            <input type="tel" placeholder="Numéro de téléphone" required />
            <button type="submit" className="commander-submit-btn">Confirmer la Livraison</button>
          </form>
        )}
      </div>
    </div>
  );
};