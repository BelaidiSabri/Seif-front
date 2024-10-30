import React from 'react';
import { Link } from 'react-router-dom';
import '../../CSS/SideBar.css';

function Sidebar() {
  return (
    <div>
      <div id="sidebarrr">
        <header>
          <span><img src='/logo.png' style={{width:"10rem",height:'7rem'}} alt="logo" /></span>
        </header>
        <ul className="navv">
          <li>
            <Link to="/Dashboard">
              <i className="fa-solid fa-laptop"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/Accueil">
              <i className="fa-solid fa-house"></i> Fil Accueil
            </Link>
          </li>
          <li>
            <Link to="/Offer">
              <i className="fa-solid fa-money-check-dollar"></i> Mes Offres 
            </Link>
          </li>
          {/* <li>
            <Link to="#">
              <i className="fa-solid fa-cart-shopping"></i> Mes Demandes
            </Link>
          </li> */}
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
