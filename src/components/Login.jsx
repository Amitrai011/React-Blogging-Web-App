import React, { useRef, useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";
import Loader from "./Loader";
import "../styles.css";

function Login() {
  const [loader, setLoader] = useState(false);
  const [defaultLoader, setDefaultLoader] = useState(false);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  function handleLoader(isLoading) {
    if (buttonRef.current === "login") {
      setLoader(isLoading);
    } else {
      setDefaultLoader(isLoading);
    }
  }

  async function loginUser(event) {
    handleLoader(true);
    event.preventDefault();
    let email = event.target[0].value;
    let password = event.target[1].value;
    try {
      if (buttonRef.current === "testLogin") {
        email = "amit22@gmail.com";
        password = "1234567890";
      }
      await signInWithEmailAndPassword(auth, email, password);
      handleLoader(false);
      navigate("/");
    } catch (err) {
      handleLoader(false);
      alert("Invalid Credentials");
    }
  }

  function handleButtonClick(type) {
    buttonRef.current = type;
  }

  return (
    <div div className="login">
      <div className="login-container">
        <h1>Write Blog</h1>
        <p>Login</p>
        <form onSubmit={loginUser}>
          <input type="email" placeholder="Enter email" />
          <input type="password" placeholder="Enter password" />
          <button
            style={{ position: "relative" }}
            type="submit"
            onClick={() => handleButtonClick("login")}
          >
            Login
            {loader && <Loader />}
          </button>
          <button
            style={{ position: "relative" }}
            type="submit"
            onClick={() => handleButtonClick("testLogin")}
          >
            Test Login
            {defaultLoader && <Loader />}
          </button>
          <p className="haveAccount">
            Don't have an account
            <NavLink to="/register"> Register?</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
