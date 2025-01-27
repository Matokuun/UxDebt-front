import React, { useState } from 'react';
import { TextField, Button, Typography, Autocomplete, CircularProgress, IconButton, Snackbar, Alert } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import '../styles/ModalCreateRepository.css';
import useRepositories from '../hooks/useRepositories';
import useGitHubRepos from '../hooks/useGitHubRepos';

const ModalCreateRepository = ({ onClose, onRepositoryCreated }) => {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [snackbar, setSnackbar] = useState({ show: false, severity: 'success', message: '' });
  const { createNewRepository } = useRepositories();
  const { repos, fetchRepos, error, loading } = useGitHubRepos();
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await createNewRepository(name, owner);
      if (success) {
        setSnackbar({ show: true, severity: 'success', message: 'Repositorio creado con éxito' });
        onRepositoryCreated();
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      setSnackbar({ show: true, severity: 'error', message: error.message || 'Error al crear el repositorio' });
    }
  };

  const isSubmitDisabled = !owner || (!name && repos.length === 0);
  const isSearchDisabled = !owner || loading;

  const handleSearchClick = () => {
    setSearchClicked(true);
    fetchRepos(owner);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, show: false });

  return (
    <div className="modal-overlay">
      <div className="modal">
        <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
          Crear Nuevo Repositorio
        </Typography>
        <form onSubmit={handleSubmit} className="modal-form">
          <TextField
            label="Propietario"
            variant="outlined"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="Buscar repositorios"
                  onClick={handleSearchClick}
                  disabled={isSearchDisabled}
                  edge="end"
                  className="search-icon-button"
                >
                  <SearchIcon />
                </IconButton>
              )
            }}
            className="owner-input"
          />

          {loading && (
            <div className="loading-message">
              <CircularProgress size={20} className="loading-icon" />
              <Typography variant="body2">Buscando repositorios...</Typography>
            </div>
          )}

          {!loading && error && searchClicked && (
            <Typography color="error" variant="body2" className="error-message">
              {error}
            </Typography>
          )}

          {!loading && repos.length === 0 && searchClicked && !error && (
            <Typography color="error" variant="body2" className="error-message">
              No se encontraron repositorios para el owner <strong>{owner}</strong>.
            </Typography>
          )}

          {!loading && repos.length > 0 && searchClicked && (
            <Typography color="primary" variant="body2" className="repos-found-message">
              Se encontraron {repos.length} repositorios.
            </Typography>
          )}

          <Autocomplete
            freeSolo
            options={repos}
            value={name}
            onChange={(event, newValue) => setName(newValue)}
            onInputChange={(event, newInputValue) => setName(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nombre del Repositorio"
                variant="outlined"
                required
                placeholder="Seleccioná un repositorio o ingresá un nombre"
                className="repo-name-input"
              />
            )}
          />

          <div className="button-container">
            <Button variant="contained" color="primary" type="submit" disabled={isSubmitDisabled} className="create-repo-button">
              Crear
            </Button>
            <Button variant="contained" color="error" onClick={onClose} className="close-button">
              Cerrar
            </Button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbar.show}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ModalCreateRepository;
