import { useState, useEffect } from "react";
import "../../CSS/CommandModal.css";

export const Buy = ({
  isOpen,
  onClose,
  onPurchase,
  cart,
  isProcessing,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod(null);
      setPaymentDetails({
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
      setDeliveryDetails({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
      });
    }
  }, [isOpen]);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    // Group digits into blocks of 4, separated by spaces
    return digitsOnly.match(/.{1,4}/g)?.join(" ") || "";
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: formatCardNumber(value), // Use the updated formatCardNumber
      }));
    } else if (name === "cvv" && !/^\d*$/.test(value)) {
      return;
    } else {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDeliveryInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && value.length > 10) return;
    if (name === "postalCode" && value.length > 5) return;

    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedPaymentDetails = {
      ...paymentDetails,
      cardNumber: paymentDetails.cardNumber.replace(/\s+/g, ""),
    };
    const success = await onPurchase({
      paymentMethod,
      paymentDetails:
        paymentMethod === "online" ? sanitizedPaymentDetails : deliveryDetails,
    });
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="commander-modal-overlay">
      <div className="commander-modal-content">
        <button className="commander-modal-close" onClick={onClose}>
          ×
        </button>
        <p className="command-modal-title">Choisissez votre option</p>

        <div className="commander-modal-options">
          <div
            className={`commander-option ${
              paymentMethod === "online" ? "selected" : ""
            }`}
            onClick={() => handlePaymentMethodSelect("online")}
          >
            <p className="command-modal-subtitle">Paiement en Ligne</p>
            <p>Payez directement sur notre plateforme</p>
          </div>

          <div
            className={`commander-option ${
              paymentMethod === "livraison" ? "selected" : ""
            }`}
            onClick={() => handlePaymentMethodSelect("livraison")}
          >
            <p className="command-modal-subtitle">Livraison</p>
            <p>Paiement à la livraison</p>
          </div>
        </div>

        {paymentMethod === "online" && (
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
              <span className="input-counter">
                {paymentDetails.cardName.length}/50
              </span>
            </div>

            <div className="input-wrapper">
              <input
                type="text"
                name="cardNumber"
                placeholder="Numéro de carte"
                maxLength={19} 
                className="input-field"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentInputChange}
                required
              />
              <span className="input-counter">
                {paymentDetails.cardNumber.replace(/\s/g, "").length}/16
              </span>
            </div>

            <div className="card-details-row">
              <div className="input-wrapper">
                <input
                  type="month"
                  name="expiryDate"
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
                  pattern="\d{3,4}"
                  maxLength={4}
                  className="input-field"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentInputChange}
                  required
                />
                <span className="input-counter">
                  {paymentDetails.cvv.length}/4
                </span>
              </div>
            </div>
            <button type="submit" className="commander-submit-btn">
              {isProcessing ? "Traitement..." : "Payer"}
            </button>
          </form>
        )}

        {paymentMethod === "livraison" && (
          <form className="commander-form" onSubmit={handleSubmit}>
            <p>Détails de Livraison</p>
            {/* Delivery details form remains unchanged */}
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
                pattern="\d{5}"
                maxLength={5}
                className="input-field"
                value={deliveryDetails.postalCode}
                onChange={handleDeliveryInputChange}
                required
              />
              <span className="input-counter">
                {deliveryDetails.postalCode.length}/5
              </span>
            </div>
            <div className="input-wrapper">
              <input
                type="tel"
                name="phone"
                placeholder="Numéro de téléphone"
                pattern="\d{10}"
                maxLength={10}
                className="input-field"
                value={deliveryDetails.phone}
                onChange={handleDeliveryInputChange}
                required
              />
              <span className="input-counter">
                {deliveryDetails.phone.length}/10
              </span>
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

export default Buy;
