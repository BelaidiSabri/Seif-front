import React from "react";
import "../../CSS/Accueil.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Container, Row, Col, Button } from "react-bootstrap";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Map from "./Map";

function Accueil() {
  return (
    <>
      {" "}
      <div className="total-accueil">
        <div className="left-accueil">
          <h1 style={{lineHeight:'normal' ,fontSize:'2rem'}}> 69 Resultats </h1>
          <div className="inpt">
            <div className="cont">
              <select className="dropdown1">
                <option value="">Sélectionnez un livre</option>
                <option value="livre1">Livre 1</option>
                <option value="livre2">Livre 2</option>
                <option value="livre2">Livre 3</option>
              </select>

              <select className="dropdown1">
                <option value="">Sélectionnez une ville</option>
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
            <Row>
              <Col>
                <Carousel interval={2000}>
                  <Carousel.Item>
                    <Row>
                      {[...Array(2)].map((_, index) => (
                        <Col key={index} xs={12} sm={6} md={6}>
                          <div className="thumbnail">
                            <Link to="/Livre">
                              <img
                                src="/livres.jpg"
                                alt=""
                                className="d-block w-100"
                              />
                            </Link>
                            <br />
                            <div className="caption">
                              <span
                                style={{
                                  backgroundColor: "#F3BCA6",
                                  padding: "5px",
                                  borderRadius: "15px",
                                  color: "#E6815D",
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
                                  color: "#E6815D",
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
                                  color: "#E6815D",
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
          <Map />
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
}

export default Accueil;
