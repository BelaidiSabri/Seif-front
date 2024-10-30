import React from "react";
import "../../CSS/Livre.css";
import Footer from "./Footer";
import { FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

function Communité() {
  return (
    <>
      <div className="app-containerrs">
        <div className="Livreee">
          <div className="headeeer">
            <img
              src="/ranger-ses-livres_900.jpg"
              style={{
                height: "35px",
                width: "35px",
                borderRadius: " 80px",
                margin: "0px 20px",
              }}
            ></img>
            <div className="user-info">
              <h3 style={{ fontWeight: "600" }}>Maleek Makki</h3>
              <p>Sfax</p>
            </div>
          </div>
          <div className="book-card">
            <img src={"/livres.jpg"} alt="Books" className="book-image" />
            <div className="book-info">
              <span className="badge">Etudiant</span>
              <h2>livres 3eme années</h2>
              <hr></hr>
             <span style={{color:"#007bff",fontWeight:"600",fontSize:"20px"}}>échange avec livre <br/>4eme année</span>
            </div>
          </div>
          <div className="user-details">
            <h3 style={{ fontWeight: "600" }}>livres math</h3>
            <p className="time">13h</p>
            <p className="description">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
          <div className="container01">
            <div className="user-info01">
              <img
                src="/ranger-ses-livres_900.jpg"
                alt="User Avatar"
                className="avatar"
              />
              <div>
                <div className="user-name">Mohamed Truki</div>
                <div className="time">13h</div>
              </div>
            </div>
            <br/>
            <div className="content">
              <div className="images">
                <img src="/livres.jpg" alt="Books" className="content-image" />
                
              </div>
              <div className="text">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </div>
            </div>
            <br/>
            <div className="actions">
              <button className="confirm-button">
                <FaCheckCircle /> Confirmer
              </button>
              <div className="menu">
                <BsThreeDotsVertical />
                <div className="dropdown">
                  <div className="dropdown-item">Conversation</div>
                  <div className="dropdown-item">Supprimer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <div className="sponsored-header">Sponsorisé :</div>
          <div className="sponsored-card">
            <div className="sponsored-content">
              <div className="image-container">
                <img src="logo2.png" className="imageees" />
              </div>
              <div className="text-content">
                <h2 className="title">librairie</h2>
                <span className="badge">Détaillant</span>
                <p className="description">
                  Lorem Ipsum is simply dummy text of the printing and .
                </p>
              </div>
              <div className="arrow-container">
                <div className="arrow">&#10230;</div>
              </div>
            </div>
          </div>
          <br />
          <div className="sponsored-card">
            <div className="sponsored-content">
              <div className="image-container">
                <img src="logo2.png" className="imageees" />
              </div>
              <div className="text-content">
                <h2 className="title">librairie</h2>
                <span className="badge">Détaillant</span>
                <p className="description">
                  Lorem Ipsum is simply dummy text of the printing and .
                </p>
              </div>
              <div className="arrow-container">
                <div className="arrow">&#10230;</div>
              </div>
            </div>
          </div>
          <div className="news">
            <h4 style={{ fontWeight: "800", color: "black", padding: "2px" }}>
              Nouveautés :
            </h4>

            <ul>
              <li>
                <a href="#!">Acheter des libres neuf</a>
              </li>
              <li>
                <a href="#!">Article two</a>
              </li>
              <li>
                <a href="#!">Article three</a>
              </li>
              <li>
                <a href="#!">Article Four</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </>
  );
}

export default Communité;
