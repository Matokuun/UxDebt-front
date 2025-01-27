import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="page-header">
      <div className="logo-text">
        <a href="/issues" className="logo">
          <img src="./././logo-unlp.png" alt="UNLP Logo" />
        </a>
        <div className="title">
          <h1>Issue Tracker</h1>
          <p>Universidad Nacional de La Plata</p>
        </div>
      </div>

      <nav className="navbar">
        <NavLink to="/Issues" className={({ isActive }) => (isActive ? 'active' : '')}>
          Issues
        </NavLink>
        <NavLink to="/repositories" className={({ isActive }) => (isActive ? 'active' : '')}>
          Repositorios
        </NavLink>
        <NavLink to="/tags" className={({ isActive }) => (isActive ? 'active' : '')}>
          Tags
        </NavLink>
        <NavLink to="/configuracion" className={({ isActive }) => (isActive ? 'active' : '')}>
          Configuración
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
