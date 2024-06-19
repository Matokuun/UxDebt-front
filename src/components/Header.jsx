import React from 'react';
import '../styles/Header.css';


const Header = () => {
    return (
      <header className="page-header">
        <div className="logo">
          <img src="./././logo-unlp.png" alt="UNLP Logo" />
        </div>
        <div className="title">
          <h1>Issue Tracker</h1>
          <p>Universidad de Nacional de La Plata</p>
        </div>
      </header>
    );
  }
  
  export default Header;