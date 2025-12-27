import { useState } from 'react';
import { authFetch } from '../utils/authFetch';

const useGitHubProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = async (owner, projectNumber) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `https://api.github.com/orgs/${owner}/projects/${projectNumber}`
      );

      if (!res.ok) {
        throw new Error('Proyecto no encontrado');
      }

      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProject, loading, error };
};

export default useGitHubProjects;