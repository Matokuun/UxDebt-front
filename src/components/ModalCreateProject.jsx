import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import '../styles/ModalCreateRepository.css';
import useProjects from '../hooks/useProjects';

const ModalCreateProject = ({ onClose, onProjectCreated }) => {
  const [owner, setOwner] = useState('');
  const [projectNumber, setProjectNumber] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    show: false,
    severity: 'success',
    message: '',
  });

  const { createProject } = useProjects();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createProject(owner, projectNumber);
      setSnackbar({
        show: true,
        severity: 'success',
        message: 'Proyecto importado con éxito',
      });
      if (typeof onProjectCreated === 'function') {
        onProjectCreated();
      }
      setTimeout(onClose, 1500);
    } catch (err) {
      setSnackbar({
        show: true,
        severity: 'error',
        message: err.message || 'Error al importar proyecto',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const isSubmitDisabled = !owner || !projectNumber;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <Typography variant="h5" textAlign="center" gutterBottom>
          Importar Proyecto de GitHub
        </Typography>

        <form onSubmit={handleSubmit} className="modal-form">
          <TextField
            label="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Número de Proyecto"
            value={projectNumber}
            onChange={(e) => setProjectNumber(e.target.value)}
            required
            fullWidth
          />

          <div className="info-text">
            Para obtener el numero de proyecto, ve a la página del proyecto en GitHub, y obtener el número desde la URL. Por ejemplo, en la URL "https://github.com/users/usuarioX/projects/12", el número de proyecto es 12.
          </div>

          <div className="button-container">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitDisabled || isCreating}
            >
              {isCreating ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Importando...
                </>
              ) : (
                'Importar'
              )}
            </Button>

            <Button variant="contained" color="error" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbar.show}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, show: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ModalCreateProject;