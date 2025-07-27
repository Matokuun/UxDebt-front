import { useState } from 'react';

const useGitHubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGitHubToken = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/GitHubToken/');
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].token) {
          return data[0].token;
        } else {
          throw new Error("No se encontró el token en la base de datos.");
        }
      } else {
        throw new Error("Error al obtener el token de la base de datos.");
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchRepos = async (username) => {
    if (!username) {
      setError("El nombre de usuario no puede estar vacío.");
      setRepos([]);
      return;
    }

    const token = await fetchGitHubToken();
    if (!token) {
      setError("No se pudo obtener el token de GitHub.");
      return;
    }

    const perPage = 100;
    let page = 1;
    let allRepos = [];

    setLoading(true);
    setError(null);

    try {
      while (true) {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 404) {
          throw new Error(`El usuario "${username}" no fue encontrado.`);
        }

        if (!response.ok) {
          throw new Error(`Error al obtener repositorios del usuario "${username}".`);
        }

        const data = await response.json();
        if (data.length === 0) break;

        allRepos = [...allRepos, ...data];
        page += 1;
      }

      setRepos(allRepos.map(repo => repo.name));
    } catch (err) {
      setRepos([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { repos, fetchRepos, error, loading };
};

export default useGitHubRepos;
