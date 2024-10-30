// Livre.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../CSS/Livre.css";
import Footer from "./Footer";

function Livre() {

  const navigate = useNavigate();
  const location = useLocation();
  const offer = location.state?.offer; // Get the offer data
  console.log(location);

  const handleBuy = () => {
    navigate("/Payment", { state: { offer } });
  };

  return (
    <>
      <div className="app-containerrs">
        <div className="Livreee">
          <div className="headeeer">
            <h1>{offer?.nom || "Livre"}</h1>
            <p className="time">13h</p>
          </div>
          <div className="book-card">
            <img src={"/livres.jpg"} alt="Books" className="book-image" />
            <div className="book-info">
              <span className="badge">
                {offer?.status ? offer.status : "status"}
              </span>
              <h2>{offer?.nom || "Titre du livre"}</h2>
              <p className="price">
                {offer?.prix ? `${offer.prix} DT` : "Prix non disponible"}
              </p>
              <button className="buy-button" onClick={handleBuy}>
                Achetez
              </button>
            </div>
          </div>
          <div className="user-details">
            <img
              src="/ranger-ses-livres_900.jpg"
              style={{
                height: "35px",
                width: "35px",
                borderRadius: " 80px",
                margin: "0px 20px",
              }}
            />
            <div className="user-info">
              <h3>Mohamed Truki</h3>
              <p>Sfax</p>
            </div>
            <p className="description">
              {offer?.description ||
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
            </p>
          </div>
        </div>
        <div className="sidebar">{/* Sidebar content */}</div>
      </div>
      <Footer />
    </>
  );
}

export default Livre;
