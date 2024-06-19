import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="page-selection">
        <Link to="/Issues" className="card">
          <h2>Listado de Issues</h2>
          <p>En esta pagina podremos encontrar todos los issues de la BD</p>
        </Link>
        <Link to="/repositories" className="card">
          <h2>Listado de Repositorios</h2>
          <p>En esta página podremos encontrar todos los repositorios.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
