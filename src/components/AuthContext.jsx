import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem('access_token')
  );

  const isAuthenticated = !!token;

  const login = async (username, password) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/login/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!res.ok) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setToken(data.access);

    return 'Sesión iniciada correctamente';
  };

  const register = async (form) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/register/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      if (data?.username) {
        throw new Error('Usuario ya existente');
      }
      throw new Error('Error al crear la cuenta');
    }

    return 'Cuenta creada con éxito';
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};