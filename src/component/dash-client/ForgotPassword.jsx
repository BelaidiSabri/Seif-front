import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/ForgotPassword.css";

const MotDePasseOublie = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.msg);
        
        // Check if the email is the special one and redirect accordingly
        if (email !== "maktba178@gmail.com") {
          // Navigate to reset-password page with email as a query parameter
          navigate(`/reset-password?email=${email}`);
        }
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Réinitialiser le mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </button>

          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}
        </form>

        <button 
          className="back-to-login-btn" 
          onClick={goBackToLogin}
        >
          ← Retour à la connexion
        </button>
      </div>
    </div>
  );
};

export default MotDePasseOublie;
