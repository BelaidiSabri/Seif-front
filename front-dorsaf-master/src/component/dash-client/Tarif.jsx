import React from "react";
import '../../CSS/Tarif.css'
import Footer from "./Footer";

function Tarif() {
  return (
    <div>
      <div className="pricing-table">
        <h1>TARIF</h1>
        <p>
          Lorem Ipsum est simplement un faux texte de l'industrie de
          l'impression et de la composition. Le Lorem Ipsum est le texte factice
          standard de l'industrie depuis les années 1500, lorsqu'un imprimeur
          inconnu a pris une galle...
        </p>
        <br/>
        <div className="plans">
          <div className="plan">
            <h2>10 pieces</h2>
            <div className="price">50 DT</div>
            <ul>
              <li>Lorem Ipsum est simplement</li>
              <li>Lorem Ipsum est simplement</li>
            </ul>
            <br/>
            <button>Acheter</button>
          </div>
          <div className="plan highlighted">
            <h2>20 pieces</h2>
            <div className="price">100 DT</div>
            <ul>
              <li>Lorem Ipsum est simplement</li>
              <li>Lorem Ipsum est simplement</li>
            </ul>
            <br/>
            <button>Acheter</button>
          </div>
          <div className="plan">
            <h2>30 pieces</h2>
            <div className="price">150 DT</div>
            <ul>
              <li>Lorem Ipsum est simplement</li>
              <li>Lorem Ipsum est simplement</li>
            </ul>
            <br/>
            <button>Acheter</button>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <Footer/>
    </div>
  );
}

export default Tarif;