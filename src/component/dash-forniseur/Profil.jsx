import React from "react";
import "../../CSS/Profil.css";
import Footer from "./Footer";

function Profil() {
  return (
    <>
      <div className="app-c">
      <div className="profile-form">
        <div className="prof-for">
          <div className="profile-header">
            <img src="logo2.png" alt="Profile" className="profile-pic" />
            <div className="profile-info">
              <div className="info-group">
                <label className="lbl-info-g">Nom :</label>
                <input type="text" className="inpt-info-g" placeholder="" />
              </div>
              <div className="info-group">
                <label className="lbl-info-g">Prénom:</label>
                <input type="text" className="inpt-info-g" placeholder="" />
              </div>
              <div className="info-group">
                <label className="lbl-info-g">Télephone:</label>
                <input type="text" className="inpt-info-g" placeholder="" />
              </div>
              <div className="info-group">
                <label className="lbl-info-g">Adresse:</label>
                <input type="text" className="inpt-info-g" placeholder="" />
              </div>
              <button className="consult1-button">Modifier</button>
            </div>
          </div>
        </div>
        <div className="profile-body">
          <h4 style={{ fontWeight: "700", color: "black", padding: "2px" }}>
            Devenir un compte pro :
          </h4>

          <form>
            <div className="form-group">
              <label className="lbl-info-g">Domaine:</label>
              <select className="inpt-info-g">
                <option value="societe">Société</option>
                <option value="societe">Société 2</option>
                <option value="societe">Société 3</option>
              </select>
            </div>
            <div className="form-group">
              <label className="lbl-info-g">Company Name:</label>
              <input className="inpt-info-g" type="text" />
            </div>
            <div className="form-group">
              <label className="lbl-info-g">Company Identifier:</label>
              <input className="inpt-info-g" type="text" />
            </div>
            <div className="form-group">
              <label className="lbl-info-g">Director Name:</label>
              <input className="inpt-info-g" type="text" />
            </div>
            <div className="form-group">
              <label className="lbl-info-g">Main Category:</label>
              <input className="inpt-info-g" type="text" />
            </div>
            <div className="form-group">
              <label className="lbl-info-g">Sub Category:</label>
              <input className="inpt-info-g" type="text" />
            </div>
            <div className="form-group">
              <label className="lbl-info-g">Province:</label>
              <input className="inpt-info-g" type="text" />
            </div>
            <div className="form-group">
              <label className="lbl-info-g">Address:</label>
              <input className="inpt-info-g" type="text" />
            </div>
            <div className="form-group">
              {/* <label className='lbl-info-g'>Map:</label> */}
              <div className="map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104888.664870107!2d10.65052600104041!3d34.761366629741254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002cda1486c695%3A0x22dfe0a62c50ce6f!2sSfax!5e0!3m2!1sfr!2stn!4v1717066623257!5m2!1sfr!2stn"
                  width="100%"
                  height="100%"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="form-actions">
              <button type="reset" className="reset-button">
                Réinitialisation
              </button>
              <button type="submit" className="consult1-button">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="sidebar">
      <div className="sponsored-header">Sponsorisé :</div>
      <div className="sponsored-card">
            <div className="sponsored-content">
                <div className="image-container">
                    <img src="logo2.png"  className="imageees" />
                </div>
                <div className="text-content">
                    <h2 className="title">librairie</h2>
                    <span className="badge">Détaillant</span>
                    <p className="description">Lorem Ipsum is simply dummy text of the printing and .</p>
                </div>
                <div className="arrow-container">
                    <div className="arrow">&#10230;</div>
                </div>
            </div>
        </div>
        <br/>
        <div className="sponsored-card">
            <div className="sponsored-content">
                <div className="image-container">
                    <img src="logo2.png"  className="imageees" />
                </div>
                <div className="text-content">
                    <h2 className="title">librairie</h2>
                    <span className="badge">Détaillant</span>
                    <p className="description">Lorem Ipsum is simply dummy text of the printing and .</p>
                </div>
                <div className="arrow-container">
                    <div className="arrow">&#10230;</div>
                </div>
            </div>
        </div>
        <div className="news">
        <h4 style={{fontWeight:"800",color:'black' , padding:'2px'}}>Nouveautés :</h4>                           

          <ul>
            <li><a href="#!">Acheter des libres neuf</a></li>
            <li><a href="#!">Article two</a></li>
            <li><a href="#!">Article three</a></li>
            <li><a href="#!">Article Four</a></li>

          </ul>
        </div>
      </div>
      </div>
      <Footer/>
    </>
  );
}

export default Profil;
