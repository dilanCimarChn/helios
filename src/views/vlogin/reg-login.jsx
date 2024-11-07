import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './reg-login.css';

function RegLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleIngresarClick = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/registro-paquete'); // Redirige a la vista de registro de paquetes
    } catch (error) {
      setError('Credenciales incorrectas');
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
          <button className="login-button" onClick={handleIngresarClick}>Ingresar</button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default RegLogin;
