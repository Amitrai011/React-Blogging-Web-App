import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAwI83ikBQ4aO2K8ZFl3Mf94Sykj-lr1BM",
    authDomain: "write-blog-191a3.firebaseapp.com",
    projectId: "write-blog-191a3",
    storageBucket: "write-blog-191a3.appspot.com",
    messagingSenderId: "238447217819",
    appId: "1:238447217819:web:9baf4b6061c4966c7b0a3e",
    measurementId: "G-T5BRK9GHK0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();