export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  console.log('JWT enviado:', token);

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn('Token expirado o inválido. Cerrando sesión.');

    localStorage.clear();

    // redirección forzada
    window.location.href = '/login';

    throw new Error('Sesión expirada');
  }

  return response;
};