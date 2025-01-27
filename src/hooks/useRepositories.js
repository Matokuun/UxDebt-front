import { useState, useEffect } from 'react';

const useRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [error, setError] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  const fetchRepositories = async () => {
    try {
      const response = await fetch("http://localhost:7237/api/Repository/GetAll");
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
      const response = await fetch(`http://localhost:7237/api/Git/DownloadNewRepository/${obj.owner}/${obj.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('🪝useRepositories - Network response was not ok');
      }

      setDownloadStatus('Downloading...');
      setDownloadStatus('Download complete!');
      return true;
    } catch (error) {
      console.error('🪝useRepositories - Error downloading repository:', error);
      setDownloadStatus('Download failed!');
      throw error;
    }
  };

  const createNewRepository = async (name, owner) => {
    try {
      const response = await fetch('http://localhost:7237/api/Repository/Create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, owner }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error}`);
      }

      return true;
    } catch (error) {
      console.error('🪝useRepositories - Error creating repository:', error);
      throw error;
    }
  };

  const updateRepository = async (repoId) => {
    try {
      const response = await fetch(`http://localhost:7237/api/Git/UpdateRepository/${repoId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setUpdateStatus('Update successful!');
        return true;
      } else {
        const errorData = await response.json();
        setUpdateStatus(`Error: ${errorData.error || 'Update failed!'}`);
        throw new Error(errorData.error || 'Update failed');
      }
    } catch (error) {
      console.error('🪝useRepositories - Error updating repository:', error);
      setUpdateStatus('Update failed!');
      throw error;
    }
  };

  return { repositories, error, downloadNewRepository, createNewRepository, updateRepository, downloadStatus, updateStatus, fetchRepositories };
};

export default useRepositories;
