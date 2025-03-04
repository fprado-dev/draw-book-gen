// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEes23UZEEk4rPFdQY15xtsc_QKr_8e1c",
  authDomain: "draw-book-gen.firebaseapp.com",
  projectId: "draw-book-gen",
  storageBucket: "draw-book-gen.firebasestorage.app",
  messagingSenderId: "327754612094",
  appId: "1:327754612094:web:1a9cb44a62a7a4be1bc72f",
  measurementId: "G-6W1M6GYM8Z",
  databaseURL: "https://draw-book-gen-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };