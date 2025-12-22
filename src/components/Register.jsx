import React, { useState } from 'react';
import '../styles/Auth.css';

const Register = ({ onRegister }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onRegister(form);
  };

  return (
    <div className="auth-container">
      <h2>Registrarse</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuario"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  );
};

export default Register;