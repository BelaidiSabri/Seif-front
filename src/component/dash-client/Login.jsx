import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "../../CSS/Login.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Bootstrap from "bootstrap/dist/js/bootstrap.bundle"; // Import Bootstrap JS here


function Login({ socket }) {
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false); // State to manage toast visibility
  const checkboxRef = useRef(null); 
  const toastRef = useRef(null);



  useEffect(() => {
    if (showToast && toastRef.current) {
      const toast = new Bootstrap.Toast(toastRef.current);
      toast.show();
    }
  }, [showToast]);


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
      localStorage.setItem("role", user.role);

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
      await axios.post("http://localhost:5000/user/register", registerData);
      resetSignup();
      setRegisterError(null);

      if (checkboxRef.current) {
        checkboxRef.current.checked = true;
      }

      setShowToast(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        setRegisterError(error.response.data.msg);
      } else {
        // Generic error handling
        setRegisterError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="l">
      <div className="main">
        <input ref={checkboxRef} type="checkbox" id="chk" aria-hidden="true" />
                {/* Toast Notification */}
        <div
          ref={toastRef}
          className="toast align-items-center text-white bg-success border-0 position-fixed bottom-0 start-0 m-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-autohide="true"
          data-bs-delay="3000"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex">
            <div className="toast-body">Signup Successful!</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
    
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
              {signupErrors.name && <p className="error">{signupErrors.name.message}</p>}
              </div>

              <div className="input-wrapper-signup">
              <Controller
    name="role"
    control={signupControl}
    rules={{ required: "Role is required" }}
    render={({ field }) => (
      <select
        {...field}
        style={{
          width: "100%",
          padding: "11px 35px",
          backgroundColor: "white",
          borderRadius: "5px",
          border: "none",
          outline: "none",
        }}
      >
        <option value="" disabled>
          Select Role
        </option>
        <option value="client">Client</option>
        <option value="fournisseur">Fournisseur</option>
      </select>
    )}
  />
  {signupErrors.role && <p className="error">{signupErrors.role.message}</p>}
              </div>

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
              {signupErrors.email && <p className="error">{signupErrors.email.message}</p>}
              </div>

              <div className="input-wrapper-signup">
                <div className="password-input">

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
              </div>

              <div className="input-wrapper-signup">
                <div className="password-input">

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
              </div>

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
            <a style={{alignSelf:'end', width:"70%", margin:'auto', fontSize:'.85rem'}} href="/forgot-password">mot de passe oublié ?</a>
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