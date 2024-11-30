
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/Profile.css";
import Cookies from "js-cookie";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: null,
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  }); // For storing error messages
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const userId = localStorage.getItem("userId");
  const token = Cookies.get("token");

  // Fetch user information when component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/user/infor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, email, phone, address, image } = response.data;
        setUserData({
          name: name || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          profileImage: image ? `http://localhost:5000${image}` : null,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des informations :", error);
        setError(
          error.response?.data?.msg || "Échec de la récupération des informations"
        );
        alert(error.response?.data?.msg || "Échec de la récupération des informations");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Clear the error for the specific field
    setFormErrors((prev) => ({
      ...prev,
      [name]: "", // Clear error message for this field
    }));
  
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const handleSaveProfile = async () => {
    // Reset form errors
    setFormErrors({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    let isValid = true;
    const errors = {};

    // Validate phone number (must be 8 digits)
    const phonePattern = /^[0-9]{8}$/;
    if (!phonePattern.test(userData.phone)) {
      errors.phone = "Le numéro de téléphone doit contenir exactement 8 chiffres.";
      isValid = false;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(userData.email)) {
      errors.email = "Veuillez entrer un email valide.";
      isValid = false;
    }

    if (!userData.name || !userData.email || !userData.phone || !userData.address) {
      if (!userData.name) errors.name = "Le nom est requis.";
      if (!userData.email) errors.email = "L'email est requis.";
      if (!userData.phone) errors.phone = "Le numéro de téléphone est requis.";
      if (!userData.address) errors.address = "L'adresse est requise.";
      isValid = false;
    }

    setFormErrors(errors);

    if (!isValid) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);

      if (userData.profileImage instanceof File) {
        formData.append("image", userData.profileImage);
      }

      const res = await axios.put(
        `http://localhost:5000/user/updateusers/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.msg || "Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error) {
      alert(error.response?.data?.msg || "Échec de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
  
    if (value.length <= 8) {
      setFormErrors((prev) => ({
        ...prev,
        phone: "", 
      }));
  
      setUserData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/user/reset-password",
        {
          token,
          newPassword: passwordData.newPassword,
          email: userData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.msg || "Mot de passe changé avec succès !");
      setPasswordData({
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsModalOpen(false); // Close the modal after password change
    } catch (error) {
      alert(error.response?.data?.msg || "Échec du changement de mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return <div>Chargement des informations...</div>;
  }

  // Render error state
  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mon Profil</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="edit-button"
        >
          {isEditing ? "Annuler" : "Modifier le Profil"}
        </button>
      </div>

      <div className="profile-content">
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
            id="profileImage"
            disabled={!isEditing}
          />
          <label htmlFor="profileImage" className="image-label">
            {userData.profileImage ? (
              userData.profileImage instanceof File ? (
                <img
                  src={URL.createObjectURL(userData.profileImage)} 
                  alt="Profil"
                  className="profile-image"
                />
              ) : (
                <img
                  src={userData.profileImage}
                  alt="Profil"
                  className="profile-image"
                />
              )
            ) : (
              <div className="placeholder-image">Télécharger la Photo</div>
            )}
          </label>
        </div>

        <div className="profile-details">
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
            {formErrors.name && <span className="profile-error-message">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
            {formErrors.email && <span className="profile-error-message">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handlePhoneChange}
              disabled={!isEditing}
              className="form-input"
            />
            {formErrors.phone && <span className="profile-error-message">{formErrors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <textarea
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-textarea"
            />
            {formErrors.address && <span className="profile-error-message">{formErrors.address}</span>}
          </div>

          {isEditing && (
            <div className="form-actions">
              <button onClick={handleSaveProfile} className="save-button">
                Sauvegarder
              </button>
            </div>
          )}
      <button onClick={() => setIsModalOpen(true)} className="change-mdp-button">
        Modifier le Mot de Passe
      </button>
        </div>
      </div>


      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-modal"
              onClick={() => setIsModalOpen(false)}  // Close modal
            >
              &times;
            </span>
            <h3>Changer le Mot de Passe</h3>
            <div className="form-group">
              <label>Nouveau Mot de Passe</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Confirmer le Nouveau Mot de Passe</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                className="form-input"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="save-button"
              disabled={loading}
            >
              {loading ? "Changement..." : "Changer le Mot de Passe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

