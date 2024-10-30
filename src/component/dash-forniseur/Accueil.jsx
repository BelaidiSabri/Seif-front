import React from "react";
import "../../CSS/Accueil.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Container, Row, Col, Button } from "react-bootstrap";
import Footer from "./Footer";

function Accueil() {
  return (
    <>
      {" "}
      <div className="total-accueil">
        <div className="left-accueil">
          <div className="inpt">
            <div className="cont">
              <select className="dropdown1">
                <option value="">Select Livre</option>
                <option value="livre1">Livre 1</option>
                <option value="livre2">Livre 2</option>
                <option value="livre2">Livre 3</option>
              </select>

              <select className="dropdown1">
                <option value="">Select Country</option>
                <option value="country1">Tunis</option>
                <option value="country2">Soussa</option>
                <option value="country2">Sfax</option>
                <option value="country2">Gafsa</option>
                <option value="country2">Klibia</option>
                <option value="country2">Hamamet</option>
              </select>

              <button className="r-button">Reinitialisation</button>
            </div>
          </div>
          <Container fluid>
            <h1> 69 Resultats </h1>
            <Row>
              <Col>
                <Carousel interval={2000}>
                  <Carousel.Item>
                    <Row>
                      {[...Array(2)].map((_, index) => (
                        <Col key={index} xs={12} sm={6} md={6}>
                          <div className="thumbnail">
                            <a href="#">
                              <img
                                src="/livres.jpg"
                                alt=""
                                className="d-block w-100"
                              />
                            </a>
                            <br />
                            <div className="caption">
                              <span
                                style={{
                                  backgroundColor: "#F3BCA6",
                                  padding: "5px",
                                  borderRadius: "15px",
                                  color:'#E6815D',
                                }}
                              >
                                Etudiant
                              </span>
                              <br />
                              <br />
                              <h4
                                style={{
                                  fontWeight: "800",
                                  color: "black",
                                  padding: "2px",
                                }}
                              >
                                Livres 3eme années
                              </h4>
                              <p>Nullam Condimentum Nibh Etiam Sem</p>
                              {/* <Button variant="primary" size="sm" href="#">
                             &raquo; Read More
                           </Button> */}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>

                  <Carousel.Item>
                    <Row>
                      {[...Array(2)].map((_, index) => (
                        <Col key={index} xs={12} sm={6} md={6}>
                          <div className="thumbnail">
                            <a href="#">
                              <img
                                src="/livres.jpg"
                                alt=""
                                className="d-block w-100"
                              />
                            </a>
                            <br />
                            <div className="caption">
                              <span
                                style={{
                                  backgroundColor: "#F3BCA6",
                                  padding: "5px",
                                  borderRadius: "15px",
                                  color:'#E6815D',
                                }}
                              >
                                Etudiant
                              </span>
                              <br />
                              <br />
                              <h4
                                style={{
                                  fontWeight: "800",
                                  color: "black",
                                  padding: "2px",
                                
                                }}
                              >
                                Livres 3eme années
                              </h4>
                              <p>Nullam Condimentum Nibh Etiam Sem</p>
                              {/* <Button variant="primary" size="sm" href="#">
                            &raquo; Read More
                          </Button> */}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>

                  <Carousel.Item>
                    <Row>
                      {[...Array(2)].map((_, index) => (
                        <Col key={index} xs={12} sm={6} md={6}>
                          <div className="thumbnail">
                            <a href="#">
                              <img
                                src="/livres.jpg"
                                alt=""
                                className="d-block w-100"
                              />
                            </a>
                            <br />
                            <div className="caption">
                              <span
                                style={{
                                  backgroundColor: "#F3BCA6",
                                  padding: "5px",
                                  borderRadius: "15px",
                                  color:'#E6815D',
                                }}
                              >
                                Etudiant
                              </span>
                              <br />
                              <br />
                              <h4
                                style={{
                                  fontWeight: "800",
                                  color: "black",
                                  padding: "2px",
                                  
                                }}
                              >
                                Livres 3eme années
                              </h4>
                              <p>Nullam Condimentum Nibh Etiam Sem</p>
                              {/* <Button variant="primary" size="sm" href="#">
                              &raquo; Read More
                            </Button> */}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Carousel.Item>
                </Carousel>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="right-accueil">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104888.664870107!2d10.65052600104041!3d34.761366629741254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002cda1486c695%3A0x22dfe0a62c50ce6f!2sSfax!5e0!3m2!1sfr!2stn!4v1717066623257!5m2!1sfr!2stn"
            width="600"
            height="100%"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <br/>
      <Footer/>
    </>
  );
}

export default Accueil;
