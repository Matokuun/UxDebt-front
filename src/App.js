import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import IssueTracker from './components/IssueTracker'; 
import Header from './components/Header'; 
import RepositoryList from './components/RepositoryList'; 
import NotFound from './components/NotFound';

import './App.css';

function App() {
  return (
    <div className="App-container">
      <Header />
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/Issues" element={<IssueTracker />} />
          <Route path="/repositories" element={<RepositoryList/>} />
          <Route path="*" element={<NotFound />} /> {/* Ruta para páginas no encontradas */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
