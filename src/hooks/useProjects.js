import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProject = async (owner, projectNumber) => {
    try {
      const res = await authFetch(
        `${process.env.REACT_APP_API_URL}/project/import/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, projectNumber }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Error al importar proyecto');
      }

      await fetchProjects();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await authFetch(
        `${process.env.REACT_APP_API_URL}/project/list/`
      );
      if (!res.ok) throw new Error('Error al obtener proyectos');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProject = async (projectId) => {
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL}/project/${projectId}/refresh/`,
      { method: 'POST' }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error al actualizar proyecto');
    }

    await fetchProjects();
    return res.json();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,     
    loading,
    error,
    createProject,
    getProjects: fetchProjects, 
    refreshProject,
  };
};

export default useProjects;