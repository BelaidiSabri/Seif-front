
import React from "react";
import '../../CSS/Footer.css';
import { Link } from "react-router-dom";
import Sidebar from "./SideBar";
import NavBar from "./NavBar";

function Footer() {
  return (
    <>
    <Sidebar/>
    <div className="foteeeeer">
      <div className="foteer">
        <hr style={{ color: "#00B4CC" }}></hr>
        <div className="nav-footer">
          <Link to="/Accueil" className="footer-spa">ACCUEIL</Link>
          <Link className="footer-spa">SHOP</Link>
          <Link to='/Communité' className="footer-spa">COMMUNITE</Link>
          <Link to='/Tarif' className="footer-spa">PACK PROMO </Link>
          {/* <Link className="footer-spa">FOIRES</Link> */}
          <Link to='/Profil' className="footer-spa">PROFIL</Link>
          <Link to='/Contact' className="footer-spa">CONTACT</Link>
        </div>
        <hr style={{ color: "#00B4CC" }}></hr>
      </div>
    </div>
    </>
  );
}
export default Footer;