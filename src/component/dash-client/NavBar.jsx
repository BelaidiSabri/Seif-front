import React, { useState } from "react";
import "../../CSS/NavBar.css";
import { FaBell, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

const NavBar = () => {
  const { cartItemCount } = useCart();
  const { unreadCount, notifications, markAsRead, loading } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <nav className="navbarrr">
      <div className="navbar-container">
        <div className="navbar-icons">
          <Link to="/Cart" className="navbar-icon">
            <FaShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
          <div className="notification-wrapper">
            <div className="navbar-icon">

            <FaBell  onClick={toggleDropdown} />
            {unreadCount > 0 && <span className="cart-count">{unreadCount}</span>}
            </div>
            {showDropdown && (
              <NotificationDropdown
                notifications={notifications}
                loading={loading}
              />
            )}
          </div>
          <details className="dropdo">
            <summary role="button">
              <Link to="/profile" className="buttonnnnnt">
                <img
                  src="/ranger-ses-livres_900.jpg"
                  alt="User Avatar"
                  style={{
                    height: "35px",
                    width: "35px",
                    borderRadius: "80px",
                    margin: "0px 20px",
                  }}
                />
              </Link>
            </summary>
          </details>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
