import React, { useEffect, useState } from 'react';
import {
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import '../styles/RepositoryList.css';
import useProjects from '../hooks/useProjects';
import ModalCreateProject from '../components/ModalCreateProject';

const Projects = () => {
  const { projects, loading, error, refreshProject } = useProjects();

  const [openModal, setOpenModal] = useState(false);
  const [updatingProjectId, setUpdatingProjectId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleUpdateProject = async (projectId) => {
    setUpdatingProjectId(projectId);
    try {
      await refreshProject(projectId);
      setSnackbarMessage('Proyecto actualizado correctamente');
      setSnackbarSeverity('success');
    } catch (err) {
      setSnackbarMessage(err.message || 'No se pudo actualizar el proyecto');
      setSnackbarSeverity('error');
    } finally {
      setUpdatingProjectId(null);
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="repository-list-container">
      <h2 className="text-center">Lista de Proyectos</h2>
      <h4 className="text-center">
        Los proyectos de organizaciones solamente se pueden importar con un token autorizado por la respectiva organización.
        Mismo caso para proyectos de usuarios ajenos al propietario del token.
      </h4>

      {loading && (
        <div className="repository-loading">
          <CircularProgress />
        </div>
      )}

      {!loading && error && (
        <div className="message no-repos-message">
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="message no-repos-message">
          No se han encontrado proyectos.
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="repository-list">
          {projects.map((project) => (
            <div key={project.projectId} className="repository-card">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateProject(project.projectId);
                }}
                className={`refresh-repo-button ${
                  updatingProjectId === project.projectId ? 'disabled' : ''
                }`}
                disabled={updatingProjectId === project.projectId}
              >
                &#x21bb;
              </button>

              <br />

              <h3 className="repo-name">{project.name}</h3>
              <p className="repo-owner">
                <strong>Owner:</strong> {project.owner}
              </p>
              <p><strong>Git ID:</strong> {project.git_id}</p>
              <p>
                <strong>Descripción:</strong>{' '}
                {project.description || 'Sin descripción'}
              </p>
              <p><strong>Issues:</strong> {project.issuesCount}</p>
              <p>
                <strong>Creado el:</strong>{' '}
                {new Date(project.created_at).toLocaleDateString()}
              </p>

              <div>
                <br /><br />
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repository-link"
                >
                  Ver en GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="floating-buttons-container">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenModal(true)}
        >
          <AddIcon />
        </Fab>
      </div>

      {openModal && (
        <ModalCreateProject
          onClose={() => setOpenModal(false)}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Projects;