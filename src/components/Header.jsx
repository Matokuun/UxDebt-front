import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isHome = path === ('/home' | '/' );
  const isProjects = path.startsWith('/projects');
  const isRepositories =
    path.startsWith('/issues') ||
    path.startsWith('/repositories') ||
    path.startsWith('/tags');

  return (
    <header className="page-header">
      <div className="logo-text">
        <a href="/" className="logo">
          <img src="./././logo-unlp.png" alt="UNLP Logo" />
        </a>
        <div className="title">
          <h1>Issue Tracker</h1>
          <p>Universidad Nacional de La Plata</p>
        </div>
      </div>

      <nav className="navbar">
        {isAuthenticated && isProjects && (
          <NavLink to="/projects">Proyectos</NavLink>
        )}

        {isAuthenticated && isRepositories && (
          <>
            <NavLink to="/Issues">Issues</NavLink>
            <NavLink to="/repositories">Repositorios</NavLink>
            <NavLink to="/tags">Tags</NavLink>
          </>
        )}

        {!isAuthenticated ? (
          <>
            <NavLink to="/login">Iniciar sesión</NavLink>
            <NavLink to="/register">Registrarse</NavLink>
          </>
        ) : (
          <>
          <NavLink to="/configuracion"> Configuración </NavLink>
          <NavLink to="/login" onClick={logout}>
            Cerrar sesión
          </NavLink>
          </>
        )}
        {isAuthenticated && !isHome && (
          <NavLink to="/home">Inicio</NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;
