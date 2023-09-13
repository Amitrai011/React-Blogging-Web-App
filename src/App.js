import React, { createContext, useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Create from "./components/Create";
import Detail from "./components/Detail";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const User = createContext();

function App() {

    const [user, setUser] = useState();

    useEffect(function () {
        onAuthStateChanged(auth, function (currentUser) {
            setUser(currentUser);
        });
    }, []);

    return (
        <User.Provider value={user}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={user ? <Home /> : <Login />} />
                    <Route path="/login" element={user ? <Home /> : <Login />} />
                    <Route path="/register" element={user ? <Home /> : <Register />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/detail" element={<Detail />} />
                </Routes>
            </BrowserRouter>
        </User.Provider>
    )
}

export default App
