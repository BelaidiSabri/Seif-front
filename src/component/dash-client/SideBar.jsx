
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import '../../CSS/SideBar.css';

function Sidebar() {
  const navigate = useNavigate(); // useNavigate hook

  function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=0; path=/';
}


// Function to handle deconnexion
const handleLogout = () => {
  // Remove tokens or other logout logic
  localStorage.removeItem('authToken');
  deleteCookie('token');
  
  navigate('/login'); // Change the route
  window.location.reload(); // Force a full reload to update the state
};


  return (
    <div>
      <div id="sidebarrr">
        <header>
          <span><img src='/logo.png' style={{ width: "10rem", height: '7rem' }} alt="logo" /></span>
        </header>
        <ul className="navv">
          <li>
            <Link to="/">
              <i className="fa-solid fa-laptop"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/Products">
            <i className="fa-solid fa-box"></i>Produits
            </Link>
          </li>
          {/* <li>
            <Link to="/Accueil">
              <i className="fa-solid fa-house"></i> Fil Accueil
            </Link>
          </li> */}
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
            <i class="fa-solid fa-right-left"></i>
            Echanges
            </Link>
          </li>
          <li>
            <Link to="/don">
            <i class="fa-solid fa-gift"></i>
            don
            </Link>
          </li>
          <li>
            <Link to="/Chat">
              <i className="fa-solid fa-comment"></i> Mes Contacts
            </Link>
          </li>
        </ul>

        {/* Add Déconnexion button here */}
        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
