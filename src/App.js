import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IssueTracker from './components/IssueTracker'; 
import Header from './components/Header'; 
import RepositoryList from './components/RepositoryList'; 
import NotFound from './components/NotFound';
import TagsPage from './components/TagsPage';
import ConfigPage from './components/ConfigPage';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App-container">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate replace to="/Issues" />} />
          <Route path="/Issues" element={<IssueTracker />} />
          <Route path="/repositories" element={<RepositoryList />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/configuracion" element={<ConfigPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
