import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IssueTracker from './components/IssueTracker'; 
import Header from './components/Header'; 
import RepositoryList from './components/RepositoryList'; 
import NotFound from './components/NotFound';
import TagsPage from './components/TagsPage';
import ConfigPage from './components/ConfigPage';
import { AuthProvider } from './components/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import Projects from './components/Projects';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App-container">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate replace to="/Issues" />} />
            <Route
              path="/Issues"
              element={
                <PrivateRoute>
                  <IssueTracker />
                </PrivateRoute>
              }
            />
            <Route
              path="/repositories"
              element={
                <PrivateRoute>
                  <RepositoryList />
                </PrivateRoute>
              }
            />
            <Route
              path="/tags"
              element={
                <PrivateRoute>
                  <TagsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <PrivateRoute>
                  <ConfigPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
