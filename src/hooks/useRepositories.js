import { useState, useEffect } from 'react';

const useRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [error, setError] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null); // Download status state
  const [updateStatus, setUpdateStatus] = useState(null); // Download status state

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch("https://localhost:7237/api/Repository/GetAll");
        const data = await response.json();
        setRepositories(data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setError('Failed to fetch repositories');
      }
    };

    fetchRepositories();
  }, []);

  const downloadNewRepository = async (owner, name) => {
    try {
      const response = await fetch(`https://localhost:7237/api/Git/DownloadNewRepository/${owner}/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner, name }),
      });

      if (!response.ok) {
        throw new Error('🪝useRepositories - Network response was not ok');
      }

      // Update download status in state
      setDownloadStatus('Downloading...');

      // Assuming a successful response from the backend
      setDownloadStatus('Download complete!');

      return true; // Indicate successful initiation of the download process
    } catch (error) {
      console.error('🪝useRepositories - Error downloading repository:', error);
      setDownloadStatus('Download failed!');
      throw error;
    }
  };

  const updateRepository = async (repoId) => {
    try {
      const response = await fetch(`https://localhost:7237/api/Git/UpdateRepository/${repoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('🪝useRepositories - Network response was not ok');
      }

      // Update download status in state
      setUpdateStatus('Updating...');

      // Assuming a successful response from the backend
      setUpdateStatus('Update complete!');

      return true; // Indicate successful initiation of the download process
    } catch (error) {
      console.error('🪝useRepositories - Error updating repository:', error);
      setUpdateStatus('Update failed!');
      throw error;
    }
  };

  return { repositories, error, downloadNewRepository, updateRepository, downloadStatus, updateStatus }; // Add downloadStatus to return value
};

export default useRepositories;