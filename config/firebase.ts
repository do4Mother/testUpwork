// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVa0A_y-0RBHXzhoQULNbpQil5PGihMzw",
  authDomain: "next-firebase-auth-44ef9.firebaseapp.com",
  projectId: "next-firebase-auth-44ef9",
  storageBucket: "next-firebase-auth-44ef9.appspot.com",
  messagingSenderId: "81320803444",
  appId: "1:81320803444:web:f3d74800b5271f71a5a521"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()

export const storage =  getStorage(app);
export const db = getFirestore(app);