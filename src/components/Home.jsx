import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { User } from "../App";
import { auth, db } from "../firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import DefaultLoader from "./DefaultLoader";

function Home() {
  const user = useContext(User);
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [blogArray, setBlogArray] = useState([]);
  const [searchArray, setSearchArray] = useState([]);

  async function getBlog() {
    setLoader(true);
    const collName = collection(db, "blog");
    try {
      const blogs = await getDocs(collName);
      setBlogArray(
        blogs.docs.map(function (blogObj) {
          return { ...blogObj.data(), id: blogObj.id };
        })
      );
      setSearchArray(
        blogs.docs.map(function (blogObj) {
          return { ...blogObj.data(), id: blogObj.id };
        })
      );
      setLoader(false);
    } catch {
      setLoader(false);
    }
  }

  useEffect(() => {
    getBlog();
  }, []);

  function handleSearch() {
    const filterArray = blogArray.filter((blog) =>
      blog.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchArray(filterArray);
  }

  function handleKey(event) {
    if (event.code === "Enter") {
      handleSearch();
    }
  }

  function handleSignOut() {
    signOut(auth)
      .then(() => {})
      .catch((err) => {
        alert("Logout error. Please retry");
      });
  }

  async function handleDelete(id) {
    const docToBeDeleted = doc(db, "blog", id);
    try {
      await deleteDoc(docToBeDeleted);
      getBlog();
    } catch (err) {
      alert("Error deleting blog.");
    }
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
          <button className="logout-btn" onClick={handleSignOut}>
            Logout
          </button>
          <img className="profile-pic" src={user.photoURL} alt="" />
        </div>
      </nav>
      <div className="middle-container">
        <div className="top-container">
          <h1 className="heading">Write Blog</h1>
          <p>Transform Ideas into Stunning Blogs Instantly</p>
          <input
            onChange={(event) => {
              if (event.target.value === "") {
                getBlog();
              }
              setSearchText(event.target.value);
            }}
            onKeyDown={handleKey}
            id="search-blog"
            type="text"
            placeholder="Search Blog"
          />
        </div>
        {loader && (
          <div style={{ position: "absolute", top: "50%" }}>
            <DefaultLoader />
          </div>
        )}
        {!loader && searchArray.length === 0 && (
          <h1 style={{ position: "absolute", top: "50%" }}>Not Found</h1>
        )}
        <div className="bottom-container">
          {searchArray.map(function (obj) {
            return (
              <div className="blog-card" key={obj.id}>
                <NavLink
                  className="nav-link"
                  to="/detail"
                  state={{ data: obj }}
                >
                  <img className="blog-img" src={obj.imageURL} alt="" />
                </NavLink>
                <div className="blog-title">
                  <h2>{obj.title}</h2>
                  {user.uid === obj.customId && (
                    <div className="edit-delete-container">
                      <NavLink to="/create" state={{ data: obj }}></NavLink>
                      <button onClick={() => handleDelete(obj.id)}></button>
                    </div>
                  )}
                </div>
                <p>{shrinkContent(obj.content)}</p>
              </div>
            );
          })}
        </div>
      </div>
      <button
        style={{ position: "fixed" }}
        onClick={() => navigate("/create")}
        className="add-btn"
      >
        +
      </button>
    </div>
  );
}

export default Home;
