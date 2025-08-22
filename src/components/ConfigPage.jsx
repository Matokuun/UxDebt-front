import React, { useState, useEffect } from 'react';
import '../styles/ConfigPage.css';
import { TextField, Button, Snackbar, Alert, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ConfigPage = () => {
  const [token, setToken] = useState('');
  const [originalToken, setOriginalToken] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Recuperar el token desde la base de datos
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/GitHubToken/`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && data[0].token) {
            setOriginalToken(data[0].token);
            setToken(data[0].token); // Actualiza el estado con el token
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchToken();
  }, []);

  // Cambiar el valor del token en el estado
  const handleTokenChange = (event) => setToken(event.target.value);

  // Guardar el token actualizado en la base de datos
  const handleSaveToken = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'El token no puede estar vacío',
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/GitHubToken/saveToken/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al guardar el token');
      }

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Token guardado con éxito',
      });
      setOriginalToken(token);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error al guardar el token',
      });
    }
  };

  // Iniciar la edición del token
  const handleEditToken = () => {
    setIsEditing(true);
    setToken(''); // Borra el token al comenzar la edición
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <div className="config-container">
      <h2>Configuración</h2>
      <div className="config-section">
        <p>Introduce tu token de GitHub</p>

        <div
          className="token-input"
          style={{ position: 'relative', width: '350px' }}
        >
          <TextField
            label="Token de Git"
            variant="outlined"
            value={token}
            onChange={handleTokenChange}
            fullWidth
            size="small"
            type={isEditing ? 'text' : 'password'}
            disabled={!isEditing && originalToken}
          />
          {originalToken && !isEditing && (
            <IconButton
              onClick={handleEditToken}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveToken}
          disabled={!token || (originalToken && !isEditing)}
          sx={{ marginTop: '20px' }}
        >
          {originalToken ? 'Actualizar Token' : 'Guardar Token'}
        </Button>

        <p style={{ marginTop: '20px' }}>
          ¿No posees un token? Crealo desde GitHub{' '}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
          >
            aquí
          </a>
          . ¿Dudas? Consultá la{' '}
          <a
            href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token"
            target="_blank"
            rel="noopener noreferrer"
          >
            documentación de GitHub
          </a>{' '}
          para aprender cómo crear uno.
        </p>
        <p style={{ fontStyle: 'italic' }}>
          Con este token podrás realizar solicitudes adicionales a GitHub,
          permitiéndote acceder a más recursos y aumentar el límite de
          peticiones por hora.
        </p>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ConfigPage;
