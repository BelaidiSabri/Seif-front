import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../../CSS/SideBar.css';

function Sidebar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Initialize state for user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get('http://localhost:5000/user/infor', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData(response.data); // Set user data in state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=0; path=/';
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    deleteCookie('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div>
      <div id="sidebarrr">
        <header>
          <span><img src='/logo.png' style={{ width: "10rem", height: '7rem' }} alt="logo" /></span>
        </header>
        <ul className="navv">
          {/* Conditionally render the "ADMIN" link */}
          {userData && userData.role === "admin" && (
            <li>
              <Link to="/admin">
                <i className="fa-solid fa-network-wired"></i> ADMIN
              </Link>
            </li>
          )}
          <li>
            <Link to="/">
              <i className="fa-solid fa-laptop"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/Products">
              <i className="fa-solid fa-box"></i> Produits
            </Link>
          </li>
          <li>
            <Link to="/Offer">
              <i className="fa-solid fa-money-check-dollar"></i> Mes Offres
            </Link>
          </li>
          <li>
            <Link to="/ordre">
              <i className="fa-solid fa-clipboard-list"></i> Ordres
            </Link>
          </li>
          <li>
            <Link to="/exchange">
              <i className="fa-solid fa-right-left"></i> Echanges
            </Link>
          </li>
          <li>
            <Link to="/don">
              <i className="fa-solid fa-gift"></i> Don
            </Link>
          </li>
          <li>
            <Link to="/Chat">
              <i className="fa-solid fa-comment"></i> Mes Contacts
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
