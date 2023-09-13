import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom';
import { User } from '../App';
import { auth } from '../firebaseConfig';

function Detail() {
    const location = useLocation();
    const data = location.state?.data;
    const user = useContext(User);

    return (
        <div className="detail">
            <nav>
                <div>
                    <img src="https://img.icons8.com/ios-filled/1x/bebo.png" alt="" />
                    <h3>Write Blog</h3>
                </div>
                <div>
                    <p>{user?.displayName}</p>
                    <img className="profile-pic" src={user?.photoURL} alt="" />
                </div>
            </nav>
            <div className="blog-details">
                <h4>{user?.metadata?.creationTime}</h4>
                <h1>{data?.title}</h1>
                <img className="blog-image" src={data ? data?.imageURL : "https://cdn-icons-png.flaticon.com/128/6114/6114045.png"} alt="Blog Image" width="50px" height="50px" />
                <p>{data?.content}</p>
            </div>
        </div>
    )
}

export default Detail
