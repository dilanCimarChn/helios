import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFd6u9gLEdIqrTSHR9igmxZgPDY_VY9iE",
  authDomain: "sistemahelios-127b9.firebaseapp.com",
  projectId: "sistemahelios-127b9",
  storageBucket: "sistemahelios-127b9.firebasestorage.app",
  messagingSenderId: "280266227473",
  appId: "1:280266227473:web:53b0448b1de0f3167316b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias de Auth y Firestore para usarlas en otras partes de la aplicación
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
