import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../../CSS/ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Extract email from query params
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Prepare body based on token availability
      const body = token 
        ? JSON.stringify({ token, newPassword, email }) 
        : JSON.stringify({ newPassword, email });

      const response = await fetch("http://localhost:5000/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.msg);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reset-password">
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;