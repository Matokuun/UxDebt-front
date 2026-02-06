import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="page-selection">
        <Link to="/Issues" className="card">
        <img className='card-image' src="./././Gestión_issues.png" alt="Gestión de proyectos" />
          <h2>Gestión de issues</h2>
          <p>En esta sección podremos trabajar con los issues recolectados, tanto los creados por el usuario como tambien los pertenecientes a los repositorios y proyectos extraidos desde GitHub.</p>
        </Link>
        <Link to="/projects" className="card">
          <img className='card-image' src="./././Gestión_proyectos.png" alt="Gestión de proyectos" />
          <h2>Gestión de proyectos</h2>
          <p>En esta página podremos encontrar los proyectos descargados desde GitHub pertenecientes al usuario.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
