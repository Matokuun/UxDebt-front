import { useState, useEffect } from 'react';

const useRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [error, setError] = useState(null);

  const fetchRepositories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Repository/GetAll/`
      );
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to fetch repositories');
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const downloadNewRepository = async (obj) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Git/DownloadNewRepository/${obj.owner}/${obj.name}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('🪝useRepositories - Network response was not ok');
      }

      return true;
    } catch (error) {
      console.error('🪝useRepositories - Error downloading repository:', error);
      throw error;
    }
  };

  const createNewRepository = async (name, owner, labels) => {
    try {
      const labelsArray = labels ? labels.split(",").map(l => l.trim()).filter(l => l.length > 0) : [];
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Repository/Create/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, owner, labels: labelsArray})
        }
      );
      const result = await response.json();
      console.log(result.new_issues);
      if (!response.ok) {
        throw new Error(`Error: ${result.error}`);
      }

      localStorage.setItem('new_issues', result.new_issues || 0);

      return result;
    } catch (error) {
      console.error('🪝useRepositories - Error creating repository:', error);
      throw error;
    }
  };

  const updateRepository = async (repoId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Git/UpdateRepository/${repoId}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result= await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('🪝useRepositories - Error updating repository:', error);
      throw error;
    }
  };

  const addLabel = async (id, newLabel) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Repository/AddLabel/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id, newLabel})
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error}`);
      }

      return true;
    } catch (error) {
      console.error('🪝useRepositories - Error adding label:', error);
      throw error;
    }
  };

  return {
    repositories,
    error,
    downloadNewRepository,
    createNewRepository,
    updateRepository,
    fetchRepositories,
    addLabel
  };
};

export default useRepositories;
