import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import Login from '../components/Login';
import { Snackbar, Alert } from '@mui/material';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleLogin = async (username, password) => {
    try {
      const message = await login(username, password);

      setSnackbar({
        open: true,
        severity: 'success',
        message,
      });

      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: err.message,
      });
      throw err; // mantiene el error en Login.jsx
    }
  };

  return (
    <>
      <Login onLogin={handleLogin} />

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

export default LoginPage;