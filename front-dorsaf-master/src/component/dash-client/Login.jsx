import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "../../CSS/Login.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login({ socket }) {
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const [visibility, setVisibility] = useState({
    signupPassword: false,
    confirmPassword: false,
    loginPassword: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const {
    control: signupControl,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm();

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const loginSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/user/login", data);
      const { accesstoken, user } = res.data;

      Cookies.set("token", accesstoken);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userId", user._id);

      socket.emit("newUser", {
        userName: user.name,
        userId: user._id,
        socketID: socket.id,
      });

      window.location.href = "/";
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
    }
  };

  const registerSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setRegisterError("Passwords do not match.");
        return;
      }

      const { confirmPassword, ...registerData } = data;
      const res = await axios.post("http://localhost:5000/user/register", registerData);
      console.log(res.data);
      resetSignup();
      // Optionally, you can show a success message or automatically log the user in
    } catch (error) {
      setRegisterError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="l">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form onSubmit={handleSignupSubmit(registerSubmit)}>
            <label className="label" htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <div className="form-inputs">
              <div className="input-wrapper-signup">
                <Controller
                  name="name"
                  control={signupControl}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <input {...field} className="input" type="text" placeholder="Name" />
                  )}
                />
              </div>
              {signupErrors.name && <p className="error">{signupErrors.name.message}</p>}

              <div className="input-wrapper-signup">
                <Controller
                  name="role"
                  control={signupControl}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <input {...field} className="input" type="text" placeholder="Role" />
                  )}
                />
              </div>
              {signupErrors.role && <p className="error">{signupErrors.role.message}</p>}

              <div className="input-wrapper-signup">
                <Controller
                  name="email"
                  control={signupControl}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Invalid email format",
                    },
                  }}
                  render={({ field }) => (
                    <input {...field} className="input" type="email" placeholder="Email" />
                  )}
                />
              </div>
              {signupErrors.email && <p className="error">{signupErrors.email.message}</p>}

              <div className="input-wrapper-signup">
                <Controller
                  name="password"
                  control={signupControl}
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="input"
                      type={visibility.signupPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                  )}
                />
                <FontAwesomeIcon
                  icon={visibility.signupPassword ? faEyeSlash : faEye}
                  onClick={() => toggleVisibility("signupPassword")}
                  className="icon"
                  style={{ cursor: "pointer" }}
                />
              </div>
              {signupErrors.password && <p className="error">{signupErrors.password.message}</p>}

              <div className="input-wrapper-signup">
                <Controller
                  name="confirmPassword"
                  control={signupControl}
                  rules={{ required: "Confirm Password is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="input"
                      type={visibility.confirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                    />
                  )}
                />
                <FontAwesomeIcon
                  icon={visibility.confirmPassword ? faEyeSlash : faEye}
                  onClick={() => toggleVisibility("confirmPassword")}
                  className="icon"
                  style={{ cursor: "pointer" }}
                />
              </div>
              {signupErrors.confirmPassword && <p className="error">{signupErrors.confirmPassword.message}</p>}

              <button type="submit" className="button">
                Sign up
              </button>

              {registerError && <p className="error">{registerError}</p>}
            </div>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLoginSubmit(loginSubmit)}>
            <label className="label" htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <div className="form-inputs">

            <div className="input-wrapper-login">
              <Controller
                name="email"
                control={loginControl}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <input {...field} className="input" type="email" placeholder="Email" />
                )}
                />
            </div>
            {loginErrors.email && <p className="error">{loginErrors.email.message}</p>}

            <div className="input-wrapper-login">
              <Controller
                name="password"
                control={loginControl}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <input
                  {...field}
                  className="input"
                  type={visibility.loginPassword ? "text" : "password"}
                  placeholder="Password"
                  />
                )}
                />
              <FontAwesomeIcon
                icon={visibility.loginPassword ? faEyeSlash : faEye}
                onClick={() => toggleVisibility("loginPassword")}
                className="icon"
                style={{ cursor: "pointer" }}
                />
            </div>
            {loginErrors.password && <p className="error">{loginErrors.password.message}</p>}

            <button type="submit" className="button">
              Login
            </button>

            {loginError && <p className="error">{loginError}</p>}
                </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;