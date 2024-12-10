import React, { useState, useEffect, useRef } from "react";
import "../../CSS/NavBar.css";
import { FaBell, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";
import axios from "axios";
import Cookies from "js-cookie";

const NavBar = () => {
  const { cartItemCount } = useCart();
  const { unreadCount } = useNotifications();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get("http://localhost:5000/user/infor", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchUserData();
  }, []);

  const handleClickOutside = (event) => {
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(event.target)
    ) {
      setShowUserDropdown(false);
    }

    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      setShowNotificationDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    deleteCookie("token");
    navigate("/login");
    window.location.reload();
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  return (
    <nav className="navbarrr">
      <div className="navbar-container">
        <div className="navbar-icons">
          {/* Cart Icon */}
          <Link to="/Cart" className="navbar-icon">
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>

          {/* Notifications Icon */}
          <div className="navbar-icon" ref={notificationDropdownRef}>
            <FaBell onClick={toggleNotificationDropdown} />
            {unreadCount > 0 && (
              <span className="cart-count">{unreadCount}</span>
            )}
            {showNotificationDropdown && (
              <NotificationDropdown
                onClose={() => setShowNotificationDropdown(false)}
              />
            )}
          </div>

          {/* User Dropdown */}
          <div className="user-dropdown-container" ref={userDropdownRef}>
            <div className="navbar-icon" onClick={toggleUserDropdown}>
              {loading ? (
                <div className="loading-spinner">Chargement...</div>
              ) : (
                <img
                  src={
                    userData?.image
                      ? `http://localhost:5000${userData.image}`
                      : "/ranger-ses-livres_900.jpg"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/ranger-ses-livres_900.jpg";
                  }}
                  alt="Avatar de l'utilisateur"
                  style={{
                    height: "35px",
                    width: "35px",
                    borderRadius: "50%",
                    margin: "0px 20px",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>

            {showUserDropdown && (
              <div className="user-dropdown">
                {userData ? (
                  <>
                    <div className="user-profile">
                      <img
                        src={
                          userData?.image
                            ? `http://localhost:5000${userData.image}`
                            : "/ranger-ses-livres_900.jpg"
                        }
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "/ranger-ses-livres_900.jpg";
                        }}
                        alt="Avatar de l'utilisateur"
                        style={{
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                          marginRight: "15px",
                        }}
                      />
                      <div>
                        <div className="user-name">{userData.name}</div>
                        <div className="user-email">{userData.email}</div>
                      </div>
                    </div>

                    <div className="user-actions">
                      <Link to="/profile" className="dropdown-item">
                        <FaUser /> Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item logout"
                      >
                        <FaSignOutAlt /> Déconnexion
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="user-actions">
                    <Link to="/login" className="dropdown-item">
                      <FaUser /> Connexion
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
