import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import '../styles/ModalCreateRepository.css';

const ModalAddLabel = ({ onClose, onSave, repo }) => {
  const [label, setLabel] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'info', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) {
      setSnackbar({ open: true, severity: 'warning', message: 'Ingrese una etiqueta' });
      return;
    }
    onSave(repo, label);
    setLabel('');
    setSnackbar({ open: true, severity: 'success', message: 'Etiqueta agregada con éxito' });
    setTimeout(() => onClose(), 1000);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <div className="modal-overlay">
      <div className="modal">
        <Typography variant="h6" gutterBottom>
          Agregar label a {repo.name}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nueva etiqueta"
            variant="outlined"
            value={label}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/[.,-_]/g, "");
              setLabel(cleanValue)
            }}
            fullWidth
            className="labels-input"
            autoFocus
            sx={{ marginTop: 2, marginBottom: 2 }} 
          />
          <div className="button-container">
            <Button variant="contained" color="primary" type="submit" className="create-repo-button">
              Guardar
            </Button>
            <Button variant="contained" color="error" onClick={onClose} className="close-button">
              Cancelar
            </Button>
          </div>
        </form>
      </div>

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

export default ModalAddLabel;