import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFd6u9gLEdIqrTSHR9igmxZgPDY_VY9iE",
  authDomain: "sistemahelios-127b9.firebaseapp.com",
  projectId: "sistemahelios-127b9",
  storageBucket: "sistemahelios-127b9.firebasestorage.app",
  messagingSenderId: "280266227473",
  appId: "1:280266227473:web:53b0448b1de0f3167316b0",
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancias de Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
