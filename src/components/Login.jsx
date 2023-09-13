import React, { createContext, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles.css";

function Login() {

    const navigate = useNavigate();

    async function loginUser(event) {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div div className="login" >
            <div className="login-container">
                <h1>Write Blog</h1>
                <p>Login</p>
                <form onSubmit={loginUser}>
                    <input type="email" placeholder="Enter email" />
                    <input type="password" placeholder="Enter password" />
                    <button type="submit">Login</button>

                    <p className="haveAccount">Don't have an account
                        <NavLink to="/register"> Register?</NavLink>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
