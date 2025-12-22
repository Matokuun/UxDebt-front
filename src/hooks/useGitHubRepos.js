import { useState } from 'react';
import { authFetch } from '../utils/authFetch';

const useGitHubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGitHubToken = async () => {
    try {
      const response = await authFetch(
        `${process.env.REACT_APP_API_URL}/GitHubToken/getToken/`
      );

      if (!response.ok) {
        throw new Error('Error al obtener el token.');
      }

      const data = await response.json();
      return data.token;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchRepos = async (username) => {
    if (!username) {
      setError('El nombre de usuario no puede estar vacío.');
      return;
    }

    const tokenGitHub = await fetchGitHubToken();
    if (!tokenGitHub) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Authorization: `Bearer ${tokenGitHub}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener repositorios.');
      }

      const data = await response.json();
      setRepos(data.map(repo => repo.name));
    } catch (err) {
      setError(err.message);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return { repos, fetchRepos, error, loading };
};

export default useGitHubRepos;