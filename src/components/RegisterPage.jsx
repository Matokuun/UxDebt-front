import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import Register from '../components/Register';
import { Snackbar, Alert } from '@mui/material';

const RegisterPage = () => {
  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleRegister = async (form) => {
    try {
      await register(form);
      await login(form.username, form.password);

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Cuenta creada e iniciada correctamente',
      });

      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: err.message,
      });
    }
  };

  return (
    <>
      <Register onRegister={handleRegister} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterPage;