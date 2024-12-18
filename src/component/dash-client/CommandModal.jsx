import{ useState, useEffect } from 'react';
import "../../CSS/CommandModal.css"


export const CommandModal = ({ isOpen, onClose, onPurchase, cart, isProcessing }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod(null);
      setPaymentDetails({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
      setDeliveryDetails({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
      });
    }
  }, [isOpen]);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber' && value.length > 16) return;
    if (name === 'cvv' && value.length > 3) return;
    if (name === 'cardName' && value.length > 50) return;
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeliveryInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && value.length > 10) return;
    if (name === 'postalCode' && value.length > 5) return;
    
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine payment method and corresponding details
    const paymentData = {
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'completed' : 'pending',
      ...(paymentMethod === 'online' 
        ? { paymentDetails } 
        : { deliveryDetails }
      )
    };

    const success = await onPurchase(paymentData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="commander-modal-overlay">
      <div className="commander-modal-content">
        <button className="commander-modal-close" onClick={onClose}>×</button>
        <p className="command-modal-title">Choisissez votre option</p>
        
        <div className="commander-modal-options">
          <div 
            className={`commander-option ${paymentMethod === 'online' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('online')}
          >
            <p className="command-modal-subtitle">Paiement en Ligne</p>
            <p>Payez directement sur notre plateforme</p>
          </div>
          
          <div 
            className={`commander-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('cash')}
          >
            <p className="command-modal-subtitle">Livraison</p>
            <p>Paiement à la livraison</p>
          </div>
        </div>

        {paymentMethod === 'online' && (
          <form className="commander-form" onSubmit={handleSubmit}>
            <p>Détails de Paiement en Ligne</p>
            <div className="input-wrapper">
              <input 
                type="text" 
                name="cardName"
                placeholder="Nom sur la carte"
                maxLength={50}
                className="input-field"
                value={paymentDetails.cardName}
                onChange={handlePaymentInputChange}
                required
              />
              <span className="input-counter">{paymentDetails.cardName.length}/50</span>
            </div>

            <div className="input-wrapper">
              <input 
                type="text" 
                name="cardNumber"
                placeholder="Numéro de carte"
                pattern="[0-9]*"
                maxLength={16}
                className="input-field"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentInputChange}
                required
              />
              <span className="input-counter">{paymentDetails.cardNumber.length}/16</span>
            </div>

            <div className="card-details-row">
              <div className="input-wrapper">
                <input 
                  type="month"
                  name="expiryDate"
                  placeholder="MM/YY"
                  className="input-field"
                  value={paymentDetails.expiryDate}
                  onChange={handlePaymentInputChange}
                  required
                  min={new Date().toISOString().slice(0, 7)}
                />
              </div>

              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="cvv"
                  placeholder="CVV"
                  pattern="[0-9]*"
                  maxLength={3}
                  className="input-field"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentInputChange}
                  required
                />
                <span className="input-counter">{paymentDetails.cvv.length}/3</span>
              </div>
            </div>
            <button type="submit" className="commander-submit-btn">
              {isProcessing ? 'Traitement...' : 'Payer'}
            </button>
          </form>
        )}

        {paymentMethod === 'cash' && (
          <form className="commander-form" onSubmit={handleSubmit}>
            <p>Détails de Livraison</p>
            <input 
              type="text" 
              name="fullName"
              placeholder="Nom complet"
              maxLength={50}
              value={deliveryDetails.fullName}
              onChange={handleDeliveryInputChange}
              required
            />
            <input 
              type="text" 
              name="address"
              placeholder="Adresse"
              maxLength={100}
              value={deliveryDetails.address}
              onChange={handleDeliveryInputChange}
              required
            />
            <input 
              type="text" 
              name="city"
              placeholder="Ville"
              maxLength={50}
              value={deliveryDetails.city}
              onChange={handleDeliveryInputChange}
              required
            />
            <div className="input-wrapper">
              <input 
                type="text" 
                name="postalCode"
                placeholder="Code postal"
                pattern="[0-9]*"
                maxLength={5}
                className="input-field"
                value={deliveryDetails.postalCode}
                onChange={handleDeliveryInputChange}
                required
              />
              <span className="input-counter">{deliveryDetails.postalCode.length}/5</span>
            </div>
            <div className="input-wrapper">
              <input 
                type="tel" 
                name="phone"
                placeholder="Numéro de téléphone"
                pattern="[0-9]*"
                maxLength={8}
                className="input-field"
                value={deliveryDetails.phone}
                onChange={handleDeliveryInputChange}
                required
              />
              <span className="input-counter">{deliveryDetails.phone.length}/10</span>
            </div>
            <button type="submit" className="commander-submit-btn">
              Confirmer la Livraison
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommandModal;