// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFwCqS0NEgerbmqJ0_N8aNqu_Rp0v1Qqc",
  authDomain: "frontendlaboratoryapp-3d808.firebaseapp.com",
  projectId: "frontendlaboratoryapp-3d808",
  storageBucket: "frontendlaboratoryapp-3d808.firebasestorage.app",
  messagingSenderId: "1076007018658",
  appId: "1:1076007018658:web:d78c284d28fa6fe59477fb",
  measurementId: "G-DZSTKF0XQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side (for Next.js SSR compatibility)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };

