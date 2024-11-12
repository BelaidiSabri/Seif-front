import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import "../../CSS/Homee.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

class Homee extends React.Component {

 /*  componentDidMount() {
    // Include jQuery and Fancybox initialization if needed
    $(document).ready(function () {
      $("[data-fancybox]").fancybox();
    });
  } */

  render() {
    return (
      <div>
        <div id="button">^</div>
        <section id="bloc1">
          <header>
            <nav className="navvvv">
              <div className="logo">
                <a href="/index.html">
                  <img
                    className="logo"
                    src="/logo.png"
                    width="130px"
                    alt="Logo"
                  />
                </a>
                {/* <h1>MH CERAMICS</h1> */}
              </div>
              <input type="checkbox" id="menu-toggle" />
              <label htmlFor="menu-toggle" className="menu-icon"></label>
              <ul className="menu">
                <li>
                  <a href="#">HOME</a>
                </li>
                <li>
                  <a href="#bloc2">ABOUT</a>
                </li>
                <li>
                  <a href="#bloc002">Activité</a>
                </li>
                <li>
                  <a href="#bloc001">SHOP</a>
                </li>
                <li>
                  <a href="#bloc4">CONTACT</a>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </nav>
          </header>
          {/* <div className="content">
            <h4>WELCOME TO MH CERAMICS</h4>
            <h1>Beautifully crafted, <br /> Designed to last</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisi <br /> Quibusdam quasi snjkxcbqsjkcbsqjkbcj...</p>
            <a href="#">
              <button className="button">READ MORE</button>
            </a>
          </div> */}
        </section>
        <section id="bloc2">
          <div className="container cont">
            <div className="text">
              <div className="product-section mt-150 mb-150">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-8 offset-lg-2 text-center">
                      <div className="section-title">
                        <h3>
                          <span className="orange-text">Notre</span> Matriere
                        </h3>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Aliquid, fuga quas itaque eveniet beatae optio.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-6 text-center">
                      <div className="single-product-item">
                        <div className="product-image">
                          <a href="single-product.html">
                            <img
                              src="/stock-photo-shocked-blonde-beautiful-woman-sweater-holding-head-isolated-blue.jpg"
                              alt
                            />
                          </a>
                        </div>
                        <h3>Personne</h3>
                        <p className="product-price"> 85$ </p>
                        <a href="cart.html" className="cart-btn">
                          <i className="fas fa-shopping-cart" /> Add to Cart
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 text-center">
                      <div className="single-product-item">
                        <div className="product-image">
                          <a href="single-product.html">
                            <img src="/feature.jpg" alt />
                          </a>
                        </div>
                        <h3>Social</h3>
                        <p className="product-price"> 35$ </p>
                        <a href="cart.html" className="cart-btn">
                          <i className="fas fa-shopping-cart" /> Add to Cart
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 text-center">
                      <div className="single-product-item">
                        <div className="product-image">
                          <a href="single-product.html">
                            <img src="/image.webp" alt />
                          </a>
                        </div>
                        <h3>Economic</h3>
                        <p className="product-price"> 70$ </p>
                        <a href="cart.html" className="cart-btn">
                          <i className="fas fa-shopping-cart" /> Add to Cart
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="image">
              <img src="/eleve.jpg" alt="Image 2" />
            </div>
          </div>
        </section>

        <div id="bloc002" className="latest-news pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2 text-center">
                <div style={{ cursor: "pointer" }} className="section-title">
                  <h3>
                    <span className="orange-text">Nos</span> Activité
                  </h3>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="single-latest-news">
                  <a href="">
                    <div className="latest-news-bg news-bg-1" />
                  </a>
                  <div className="news-text-box">
                    <h3>
                      <a style={{ fontSize: "2.5rem" }} href="">
                        Shoping
                      </a>
                    </h3>

                    <p className="excerpt">
                      Vivamus lacus enim, pulvinar vel nulla sed, scelerisque
                      rhoncus nisi. Praesent vitae mattis nunc, egestas viverra
                      eros.
                    </p>
                    <a href="single-news.html" className="read-more-btn">
                      read more <i className="fas fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-latest-news">
                  <a href="single-news.html">
                    <div className="latest-news-bg news-bg-2" />
                  </a>
                  <div className="news-text-box">
                    <h3>
                      <a style={{ fontSize: "2.5rem" }} href="">
                        Formation
                      </a>
                    </h3>

                    <p className="excerpt">
                      Vivamus lacus enim, pulvinar vel nulla sed, scelerisque
                      rhoncus nisi. Praesent vitae mattis nunc, egestas viverra
                      eros.
                    </p>
                    <a href="single-news.html" className="read-more-btn">
                      read more <i className="fas fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0">
                <div className="single-latest-news">
                  <a href="single-news.html">
                    <div className="latest-news-bg news-bg-3" />
                  </a>
                  <div className="news-text-box">
                    <h3>
                      <a style={{ fontSize: "2.5rem" }} href="">
                        Loisir
                      </a>
                    </h3>

                    <p className="excerpt">
                      Vivamus lacus enim, pulvinar vel nulla sed, scelerisque
                      rhoncus nisi. Praesent vitae mattis nunc, egestas viverra
                      eros.
                    </p>
                    <a href="single-news.html" className="read-more-btn">
                      read more <i className="fas fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 text-center">
                <a href="news.html" className="boxed-btn">
                  More News
                </a>
              </div>
            </div>
          </div>
        </div>
        <div id="bloc001" className="latest-news pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2 text-center">
                <div style={{ cursor: "pointer" }} className="section-title">
                  <h3>
                    <span className="orange-text">Offre</span> Communautaire !
                  </h3>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="single-latest-news">
                  <a href="">
                    <div className="latest-news-bg news2-bg-1" />
                  </a>
                  <div className="news-text-box">
                    <h3>
                      <a style={{ fontSize: "2.5rem" }} href="">
                        Livre
                      </a>
                    </h3>

                    <p className="excerpt">
                      Vivamus lacus enim, pulvinar vel nulla sed, scelerisque
                      rhoncus nisi. Praesent vitae mattis nunc, egestas viverra
                      eros.
                    </p>
                    <a href="single-news.html" className="read-more-btn">
                      read more <i className="fas fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-latest-news">
                  <a href="single-news.html">
                    <div className="latest-news-bg news2-bg-2" />
                  </a>
                  <div className="news-text-box">
                    <h3>
                      <a style={{ fontSize: "2.5rem" }} href="">
                        Projet
                      </a>
                    </h3>

                    <p className="excerpt">
                      Vivamus lacus enim, pulvinar vel nulla sed, scelerisque
                      rhoncus nisi. Praesent vitae mattis nunc, egestas viverra
                      eros.
                    </p>
                    <a href="single-news.html" className="read-more-btn">
                      read more <i className="fas fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-latest-news">
                  <a href="single-news.html">
                    <div className="latest-news-bg news3-bg-3" />
                  </a>
                  <div className="news-text-box">
                    <h3>
                      <a style={{ fontSize: "2.5rem" }} href="">
                      Backpack
                      </a>
                    </h3>

                    <p className="excerpt">
                      Vivamus lacus enim, pulvinar vel nulla sed, scelerisque
                      rhoncus nisi. Praesent vitae mattis nunc, egestas viverra
                      eros.
                    </p>
                    <a href="single-news.html" className="read-more-btn">
                      read more <i className="fas fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 offset-md-3 offset-lg-0">
                <div className="single-latest-news">
                  <a href="single-news.html">
                    <div className="latest-news-bg news4-bg-4" />
                  </a>
                  <div className="news-text-box">
                    <h3>
                      <a style={{ fontSize: "2.5rem" }} href="">
                        Eleve
                      </a>
                    </h3>

                    <p className="excerpt">
                      Vivamus lacus enim, pulvinar vel nulla sed, scelerisque
                      rhoncus nisi. Praesent vitae mattis nunc, egestas viverra
                      eros.
                    </p>
                    <a href="single-news.html" className="read-more-btn">
                      read more <i className="fas fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
         
          </div>
        </div>
        <section id="bloc3">
          <div className="container">
            <h4>Latest</h4>
            <h2>Products:</h2>
            <div className="product">
              {[
                {
                  src: "/article.jpg",
                  
                  name: "Article",
                  price: "2169",
                },
                {
                  src: "/memoire.jpg",
                  name: "Memoir",
                  price: "10000",
                },
                {
                  src: "/raite.jpg",
                  name: "Rate",
                  price: "7200",
                },
                {
                  src: "/boutique.jpg",
                  name: "Boutique",
                  price: "2600",
                },
             
              ].map((product, index) => (
                <div key={index}>
                  <img src={product.src} alt="" />
                  <br/>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                  <button value="add to cart">ADD TO CART</button>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="bloc4">
          <div className="container con">
            <img src="/img/bloc4 img.jpg" alt="" />
            <div>
              <h3>Contactez Nous</h3>
              <form>
                <div className="input-row">
                  <input
                    placeholder="First Name"
                    type="text"
                    id="name"
                    name="name"
                    required
                  />
                  <input
                    placeholder="Last Name"
                    type="text"
                    id="last-name"
                    name="last-name"
                    required
                  />
                </div>
                <div className="input-row">
                  <input
                    placeholder="Your Email"
                    type="email"
                    id="email"
                    name="email"
                    required
                  />
                  <input
                    placeholder="Phone Number"
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                  />
                </div>
                <textarea
                  placeholder="Your Message"
                  id="message"
                  name="message"
                  cols="50"
                  required
                ></textarea>
                <div className="btn">
                  <button type="submit">Send</button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <section id="footer">
          <div className="container conte">
            <div className="left section">
              <h2>About Us</h2>
              <div className="content">
                <p>
                  MultiWebPress is an educational blog where we post blogs
                  related to Website Development, Technology, Tips & Hacks, and
                  much more creative coding stuff.
                </p>
                <div className="social">
                  <a href="#">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                </div>
              </div>
            </div>
            <div className="center section">
              <h2>Contact Us</h2>
              <div className="content">
                <div className="place">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span className="text"> Mahdia</span>
                </div>
                <div className="phone">
                  <FontAwesomeIcon icon={faPhoneAlt} />
                  <span className="text">
                    <a href="tel:+216 24075991">+216 99874512 </a>
                  </span>
                </div>
                <div className="email">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span className="text">
                    <a href="mailto:MHceramics@gmail.com">
                      Dorsaf@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="right section">
              <h2>Subscribe</h2>
              <div className="content">
                <form action="#">
                  <div className="email">
                    <div className="text">Email*</div>
                  </div>
                  <input type="email" required />
                  <div className="btn">
                    <button type="submit">SUBSCRIBE</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <center>
              <div>
                <span>
                  Powered By{" "}
                  <a href="#">
                    © 2024 | All Rights Reserved | Made By Dorsaf
                  </a>
                </span>
              </div>
            </center>
          </div>
        </section>
      </div>
    );
  }
}

export default Homee;
