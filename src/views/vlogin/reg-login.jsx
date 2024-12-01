import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../../utils/firebase'; // Asegúrate de importar correctamente Firebase Firestore
import './reg-login.css';

function RegLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleIngresarClick = async () => {
    const auth = getAuth();
    try {
      // Iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar usuario en Firestore por correo
      const q = query(collection(db, 'usuarios'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // Verificar si el usuario está activo
        if (!userData.active) {
          throw new Error('Tu cuenta está deshabilitada. Contacta al administrador.');
        }

        const userRole = userData.role;

        // Almacenar el rol en localStorage
        localStorage.setItem('userRole', userRole);

        // Redirigir según el rol
        navigate('/registro-paquete');
      } else {
        throw new Error('Usuario no encontrado en Firestore.');
      }
    } catch (error) {
      // Mostrar mensaje de error según el caso
      setError(
        error.message.includes('deshabilitada')
          ? 'Tu cuenta está deshabilitada. Contacta al administrador.'
          : 'Credenciales incorrectas'
      );
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleIngresarClick}>
            Ingresar
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default RegLogin;
