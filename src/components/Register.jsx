import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { auth, storage, db } from "../firebaseConfig";
import { useNavigate, NavLink } from "react-router-dom";
import Loader from "./Loader";
import "../styles.css";

function Register() {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    async function registerUser(event) {
        setLoader(true);
        event.preventDefault();
        const name = event.target[0].value;
        const email = event.target[1].value;
        const password = event.target[2].value;
        const file = event.target[3].files[0];

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, "Profile Image/" + name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            const snapshot = await uploadTask;
            const downloadURL = await getDownloadURL(snapshot.ref);

            const userData = {
                displayName: name,
                email: email,
                password: password,
                photoURL: downloadURL,
            };

            const userCollection = doc(db, "users", res.user.uid);
            await updateProfile(res.user, userData);
            await setDoc(userCollection, userData);
            setLoader(false);
            navigate("/");
        } catch (err) {
            setLoader(false);
            alert("Invalid Credentials");
        }
    }

    return (
        <div div className="register">
            <div className="register-container">
                <h1>Write Blog</h1>
                <p>Register</p>
                <form onSubmit={registerUser}>
                    <input type="text" placeholder="Enter name" />
                    <input type="email" placeholder="Enter email" />
                    <input type="password" placeholder="Enter password" />
                    <label htmlFor="file">
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/4904/4904233.png"
                            alt="Profile"
                        />
                        <p>Add an avatar</p>
                    </label>
                    <input style={{ display: "none" }} type="file" id="file" />
                    <button style={{ position: "relative" }} type="submit">
                        Register
                        {loader && <Loader />}
                    </button>
                    <p className="haveAccount">
                        Have an account
                        <NavLink to="/login"> Login?</NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
