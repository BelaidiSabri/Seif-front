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
  const [showToast, setShowToast] = useState(false);
  const checkboxRef = useRef(null);
  const toastRef = useRef(null);
  const [showMatricule, setShowMatricule] = useState(false);

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
    watch,
  } = useForm({
    defaultValues: {
      role: 'client', // Set default role to client
    }
  });

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  // Watch the role field to show/hide matricule fiscale
  const selectedRole = watch('role');
  useEffect(() => {
    setShowMatricule(selectedRole === 'fournisseur');
  }, [selectedRole]);

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
      setLoginError("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };

  const registerSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setRegisterError("Les mots de passe ne correspondent pas.");
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
        setRegisterError("L'inscription a échoué. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="l">
      <div className="main">
        <input ref={checkboxRef} type="checkbox" id="chk" aria-hidden="true" />
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
            <div className="toast-body">Inscription réussie !</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
              aria-label="Fermer"
            ></button>
          </div>
        </div>

        <div className="signup">
          <form onSubmit={handleSignupSubmit(registerSubmit)}>
            <label className="label" htmlFor="chk" aria-hidden="true">
              S'inscrire
            </label>
            <div className="form-inputs">
              <div className="input-wrapper-signup">
                <Controller
                  name="name"
                  control={signupControl}
                  rules={{ required: "Le nom est requis" }}
                  render={({ field }) => (
                    <input {...field} className="input" type="text" placeholder="Nom" />
                  )}
                />
                {signupErrors.name && <p className="error">{signupErrors.name.message}</p>}
              </div>

              <div className="input-wrapper-signup">
                <Controller
                  name="role"
                  control={signupControl}
                  rules={{ required: "Le rôle est requis" }}
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
                      <option value="client">Client</option>
                      <option value="fournisseur">Fournisseur</option>
                    </select>
                  )}
                />
                {signupErrors.role && <p className="error">{signupErrors.role.message}</p>}
              </div>

              {showMatricule && (
                <div className="input-wrapper-signup">
                  <Controller
                    name="matriculeFiscale"
                    control={signupControl}
                    rules={{ required: "Le matricule fiscale est requis" }}
                    render={({ field }) => (
                      <input {...field} className="input" type="text" placeholder="Matricule Fiscale" />
                    )}
                  />
                  {signupErrors.matriculeFiscale && <p className="error">{signupErrors.matriculeFiscale.message}</p>}
                </div>
              )}

              <div className="input-wrapper-signup">
                <Controller
                  name="email"
                  control={signupControl}
                  rules={{
                    required: "L'email est requis",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Format d'email invalide",
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
                    rules={{ required: "Le mot de passe est requis" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="input"
                        type={visibility.signupPassword ? "text" : "password"}
                        placeholder="Mot de passe"
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
                    rules={{ required: "La confirmation du mot de passe est requise" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="input"
                        type={visibility.confirmPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
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
                S'inscrire
              </button>

              {registerError && <p className="error">{registerError}</p>}
            </div>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLoginSubmit(loginSubmit)}>
            <label className="label" htmlFor="chk" aria-hidden="true">
              Se connecter
            </label>
            <div className="form-inputs">
              <div className="input-wrapper-login">
                <Controller
                  name="email"
                  control={loginControl}
                  rules={{
                    required: "L'email est requis",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Format d'email invalide",
                    },
                  }}
                  render={({ field }) => (
                    <input {...field} className="input" type="email" placeholder="Email" />
                  )}
                />
                {loginErrors.email && <p className="error">{loginErrors.email.message}</p>}
              </div>

              <div className="input-wrapper-login">
              <div className="password-input">
                <Controller
                  name="password"
                  control={loginControl}
                  rules={{ required: "Le mot de passe est requis" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="input"
                      type={visibility.loginPassword ? "text" : "password"}
                      placeholder="Mot de passe"
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
              </div>
              <a style={{alignSelf:'end', width:"70%", margin:'auto', fontSize:'.85rem'}} href="/forgot-password">Mot de passe oublié ?</a>

              <button type="submit" className="button">
                Se connecter
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