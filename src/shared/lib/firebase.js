// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHUJYAicGwFwrCkVKABCgogBdRjubufWQ",
    authDomain: "fit-track-life.firebaseapp.com",
    projectId: "fit-track-life",
    storageBucket: "fit-track-life.firebasestorage.app",
    messagingSenderId: "368368473956",
    appId: "1:368368473956:web:368934fc4dc4104ad44c71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export default app;