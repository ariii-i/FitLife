// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg8mgMykW6ZH0ekdrhu83ejTNaFVGnGYY",
  authDomain: "fitlife-186dc.firebaseapp.com",
  projectId: "fitlife-186dc",
  storageBucket: "fitlife-186dc.firebasestorage.app",
  messagingSenderId: "208056943759",
  appId: "1:208056943759:web:ec626d3c65cbc4e4541cfa",
  measurementId: "G-4SF0BERR8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export default app;