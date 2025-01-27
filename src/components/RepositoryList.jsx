import React, { useState } from 'react';
import useRepositories from '../hooks/useRepositories';
import '../styles/RepositoryList.css';
import ModalCreateRepository from './ModalCreateRepository';
import { Fab, TextField, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const RepositoryList = () => {
  const { repositories, updateRepository, downloadStatus, updateStatus, fetchRepositories } = useRepositories();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'info', message: '' });
  
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    repo.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepositories.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(filteredRepositories.length / reposPerPage);

  const getSelectionButtonText = () => {
    if (selectAll) {
      return `Deseleccionar todos (${selectedRepos.size})`;
    }
    if (selectedRepos.size > 0) {
      return `Seleccionar todos (${selectedRepos.size})`;
    }
    return 'Seleccionar todos';
  };

  const handleUpdateRepository = async (repositoryId) => {
    setIsUpdating(true);
    try {
      const result = await updateRepository(repositoryId);
      if (result) {
        setSnackbar({ open: true, severity: 'success', message: 'Repositorio actualizado con éxito' });
      }
    } catch (error) {
      setSnackbar({ open: true, severity: 'error', message: 'Error al actualizar el repositorio' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRepos(new Set());
    } else {
      const allReposIds = filteredRepositories.map(repo => repo.repositoryId);
      setSelectedRepos(new Set(allReposIds));
    }
    setSelectAll(!selectAll);
  };

  const handleToggleRepo = (repoId, event) => {
    if (event.target.matches('button, a, button *, a *')) {
      return;
    }

    const newSelected = new Set(selectedRepos);
    if (newSelected.has(repoId)) {
      newSelected.delete(repoId);
      setSelectAll(false);
    } else {
      newSelected.add(repoId);
      if (newSelected.size === filteredRepositories.length) {
        setSelectAll(true);
      }
    }
    setSelectedRepos(newSelected);
  };

  const handleUpdateSelected = async () => {
    if (selectedRepos.size === 0) {
      setSnackbar({ open: true, severity: 'warning', message: 'Seleccione al menos un repositorio' });
      return;
    }

    setIsUpdating(true);
    try {
      const updatePromises = Array.from(selectedRepos).map(repoId => 
        updateRepository(repoId)
      );
      await Promise.all(updatePromises);
      setSnackbar({ open: true, severity: 'success', message: 'Repositorios actualizados con éxito' });
      setSelectedRepos(new Set());
      setSelectAll(false);
    } catch (error) {
      setSnackbar({ open: true, severity: 'error', message: 'Error al actualizar repositorios' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRepositoryCreated = async () => {
    await fetchRepositories();
    setCurrentPage(1);
    setSearchTerm('');
    setIsModalOpenCreate(false);
    setSnackbar({ open: true, severity: 'success', message: 'Repositorio creado con éxito' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="repository-list-container">
      <h2 className="text-center">Lista de Repositorios</h2>

      <div className="header-container">
        <TextField
          label="Buscar por título o propietario"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="action-buttons">
          <button 
            onClick={handleSelectAll}
            className={`select-all-button ${selectAll ? 'selected' : ''}`}
          >
            {getSelectionButtonText()}
          </button>
          <button
            onClick={handleUpdateSelected}
            className={`update-selected-button ${selectedRepos.size > 0 && !isUpdating ? 'enabled' : ''}`}
            disabled={selectedRepos.size === 0 || isUpdating}
          >
            <span className="rotate-icon">↻</span>
            {isUpdating ? 'Actualizando...' : 'Actualizar seleccionados'}
          </button>
        </div>
      </div>

      {downloadStatus && <div className="status-message">{downloadStatus}</div>}
      {updateStatus && <div className="status-message">{updateStatus}</div>}

      {filteredRepositories.length === 0 ? (
        <div className="message no-repos-message">No se encontraron repositorios.</div>
      ) : (
        <div className="repository-list">
          {currentRepos.map(repo => (
            <div 
              key={repo.repositoryId} 
              className={`repository-card ${selectedRepos.has(repo.repositoryId) ? 'selected' : ''} pointer-cursor`}
              onClick={(e) => handleToggleRepo(repo.repositoryId, e)}
            >
              <input 
                type="checkbox" 
                checked={selectedRepos.has(repo.repositoryId)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleToggleRepo(repo.repositoryId, e);
                }}
                className="repository-checkbox"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateRepository(repo.repositoryId);
                }}
                className={`refresh-repo-button ${isUpdating ? 'disabled' : ''}`}
                disabled={isUpdating}
              >
                &#x21bb;
              </button>
              <div className="repository-card-content">
                <h3 className="repo-name">{repo.name}</h3>
                <p className="repo-owner"><strong>Owner:</strong> {repo.owner}</p>
                <p><strong>Git ID:</strong> {repo.gitId}</p>
                <p><strong>Descripcion:</strong> {repo.description ? repo.description : 'Sin descripción'}</p>
              </div>
              <a 
                href={repo.htmlUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="repository-link"
                onClick={(e) => e.stopPropagation()}
              >
                Ver en GitHub
              </a>
            </div>
          ))}
        </div>
      )}

      {filteredRepositories.length > reposPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Anterior
          </button>

          {[...Array(totalPages).keys()].map(pageNumber => (
            <button
              key={pageNumber + 1}
              onClick={() => setCurrentPage(pageNumber + 1)}
              className={`pagination-button ${
                currentPage === pageNumber + 1 ? 'active' : ''
              }`}
            >
              {pageNumber + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      )}

     <div className="floating-buttons-container">
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={() => setIsModalOpenCreate(true)}
        >
          <AddIcon />
        </Fab>
      </div>


      {isModalOpenCreate && (
      <ModalCreateRepository 
        onClose={() => setIsModalOpenCreate(false)}
        onRepositoryCreated={handleRepositoryCreated}
      />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RepositoryList;
