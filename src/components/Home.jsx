import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { User } from "../App";
import { auth, db } from "../firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";

function Home() {

    const user = useContext(User);
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const [blogArray, setBlogArray] = useState([]);
    const [searchArray, setSearchArray] = useState([]);

    async function getBlog() {
        const collName = collection(db, "blog");
        const blogs = await getDocs(collName);
        setBlogArray(blogs.docs.map(function (blogObj) {
            return { ...blogObj.data(), id: blogObj.id };
        }));
    }

    useEffect(function () {
        getBlog();
    }, [searchText.length]);

    async function handleSearch() {
        const blogCollection = collection(db, "blog");
        const que = query(blogCollection, where("title", "==", searchText));
        const querySnapshot = await getDocs(que);

        setSearchArray(querySnapshot.docs.map(function (blogItem) {
            return { ...blogItem.data(), id: blogItem.id };
        }));
        setBlogArray(searchArray);
    }

    function handleKey(event) {
        if (event.code == "Enter") {
            handleSearch();
        }
    }

    function handleSignOut() {
        signOut(auth).then(() => {
            console.log("Successfully Signed Out");
        }).catch((err) => {
            alert(err.message);
        })
    }

    async function handleDelete(id) {
        const docToBeDeleted = doc(db, "blog", id);
        try {
            await deleteDoc(docToBeDeleted);
            getBlog();
            alert("Deleted Successfully!");
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleEdit(id, obj) {
        navigate("/create");
    }

    function shrinkContent(str) {
        return str.substr(0, 100) + "...";
    }

    return (
        <div className="home">
            <nav>
                <div className="left-nav">
                    <img src="https://img.icons8.com/ios-filled/1x/bebo.png" alt="" />
                    <h3>Write Blog</h3>
                </div>
                <div className="right-nav">
                    <button className="logout-btn" onClick={handleSignOut}>Logout</button>
                    <img className="profile-pic" src={user.photoURL} alt="" />
                </div>
            </nav>
            <div className="middle-container">
                <div className="top-container">
                    <h1 className="heading">Write Blog</h1>
                    <p>Aweosome place to write blogs about life, techology and enterained throught daily updates</p>
                    <input
                        onChange={(event) => {
                            setSearchText(event.target.value);
                        }}
                        onKeyDown={handleKey}
                        id="search-blog"
                        type="text"
                        placeholder="Search Blog"
                    />
                </div>
                <div className="bottom-container">
                    {blogArray.map(function (obj) {
                        return (
                            <div className="blog-card" key={obj.id}>
                                <NavLink className="nav-link" to="/detail" state={{ data: obj }}>
                                    <img className="blog-img" src={obj.imageURL} alt="" />
                                </NavLink>
                                <div className="blog-title">
                                    <h2>{obj.title}</h2>
                                    {user.uid === obj.customId &&
                                        <div className="edit-delete-container">
                                            <NavLink to="/create" state={{ data: obj }}></NavLink>
                                            <button onClick={() => handleDelete(obj.id)}></button>
                                        </div>
                                    }
                                </div>
                                <p>{shrinkContent(obj.content)}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <button style={{ position: "fixed" }} onClick={() => navigate("/create")} className="add-btn">+</button>
        </div>
    )
}

export default Home
