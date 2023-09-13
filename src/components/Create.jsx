import { setDoc, doc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react'
import { auth, db, storage } from '../firebaseConfig';
import { User } from "../App"
import { useLocation, useNavigate } from 'react-router-dom';

function Create() {

    const user = useContext(User);
    const navigate = useNavigate();
    const [blogContent, setBlogContent] = useState({
        title: "",
        content: ""
    });

    const [blogFile, setFile] = useState();

    const location = useLocation();
    const data = location.state?.data;

    async function handleSubmit(event) {
        try {
            const storageRef = ref(storage, "Blog Image/" + blogFile.name);
            const uploadTask = uploadBytesResumable(storageRef, blogFile);

            const snapshot = await uploadTask;
            const downloadURL = await getDownloadURL(snapshot.ref);

            const collName = collection(db, "blog");
            const dataObj = {
                ...blogContent,
                imageURL: downloadURL,
                customId: user.uid
            }
            await addDoc(collName, dataObj);
            alert("Post Published Successfully!");
            navigate("/");
        } catch (err) {
            console.log(err.message);
        }
    }

    async function handleUpdate() {
        let docUpdate = doc(db, "blog", data.id);
        try {
            await updateDoc(docUpdate, blogContent);
            alert("Updated Successfully");
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    }

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setBlogContent(function (prevVal) {
            return { ...prevVal, [name]: value };
        })
    }

    function handleFile(event) {
        setFile(event.target.files[0]);
    }

    useEffect(function () {
        if (data) {
            setBlogContent(function (prev) {
                return { title: data?.title, content: data?.content };
            });
        }
    }, []);

    return (
        <div className="create">
            <nav>
                <div>
                    <img src="https://img.icons8.com/ios-filled/1x/bebo.png" alt="" />
                    <h3>Write Blog</h3>
                </div>
                <div>
                    <button onClick={data ? handleUpdate : handleSubmit} type="submit" className="publish-btn">{data ? "Update" : "Publish"}</button>
                    <img className="profile-pic" src={user?.photoURL} alt="" />
                </div>
            </nav>
            <form>
                <input
                    onChange={handleChange}
                    name="title"
                    className="title-input"
                    type="text"
                    placeholder="Write title"
                    defaultValue={data?.title}
                />
                <textarea
                    onChange={handleChange}
                    name="content"
                    cols="30"
                    rows="10"
                    placeholder="Tell your story..."
                    defaultValue={data?.content}>
                </textarea>
                {!data &&
                    <label htmlFor="file">
                        <img src="https://cdn-icons-png.flaticon.com/128/5175/5175601.png" alt="" />
                        <p>Upload a image</p>
                    </label>
                }
                {!data && <input style={{ display: "none" }} onChange={handleFile} type="file" id="file" />}
            </form>
        </div>
    )
}

export default Create
