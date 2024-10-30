import React from "react";
import "../../CSS/Login.css";

function Login() {
  return (
    <div className="l">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form>
            <label className="label" htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input className="input" type="text" name="txt" placeholder="nom" required="" />
            <input className="input" type="email" name="email" placeholder=" prenom" required="" />
            <input
              type="text"
              name="email"
              placeholder="email"
              required=""
              className="input"
            />
            <input
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
              className="input"
            />
            <button className="button">Sign up</button>
          </form>
        </div>

        <div className="login">
          <form>
            <label className="label" htmlFor="chk" aria-hidden="true">
              Login
            </label >
            <input className="input" type="email" name="email" placeholder="Email" required="" />
            <input className="input"
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
            />
            <button className="button">Login</button >
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
