import React from "react";
import "../../CSS/NavBar.css";
import { FaBell, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

const NavBar = () => {
  return (
    <nav className="navbarrr">
      <div className="navbar-container">
        <div className="navbar-search">
          <select
            name="role"
            id="role"
            // value={role}
            // onChange={handleChange}
            required
            className="selct"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="user">Type</option>
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>

          <input type="text" placeholder="Ou.." />
          <FaSearch className="search-icon" />
        </div>
        <div className="navbar-icons">
          <FaBell className="navbar-icon" />
          <details className="dropdo">
            <summary role="button">
              <a className="buttonnnnnt"><img src="/ranger-ses-livres_900.jpg" style={{height:"35px", width:'35px',borderRadius:" 80px",margin:'0px 20px'}}></img></a>
            </summary>
            <ul>
              <li>
                <a href="#">I'm a dropdown.</a>
              </li>
              <li>
                <a href="#">In Pure CSS</a>
              </li>
              <li>
                <a href="#">As in...</a>
              </li>
              <li>
                <a href="#">No JavaScript.</a>
              </li>
              <li>
                <a href="#">At All.</a>
              </li>
            </ul>
          </details>
        </div>
      </div>
      {/* <hr style={{color:"#00B4CC"}}></hr> */}
    </nav>
  );
};

export default NavBar;
