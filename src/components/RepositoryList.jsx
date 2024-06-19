import React, { useState } from 'react';
import useRepositories from '../hooks/useRepositories';
import '../styles/RepositoryList.css';
import ModalCreateRepository from './ModalCreateRepository';
import ModalDownloadRepository from './ModalDownloadRepository'; // Updated import

const RepositoryList = () => {
  const { repositories, error, downloadNewRepository,updateRepository } = useRepositories(); // Include downloadNewRepository
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDownload, setIsModalOpenDownload] = useState(false);

  const handleOpenModalCreate = () => {
    setIsModalOpenCreate(true);
  };

  const handleCloseModalCreate = () => {
    setIsModalOpenCreate(false);
  };

  const handleOpenModalDownload = () => {
    setIsModalOpenDownload(true);
  };

  const handleCloseModalDownload = () => {
    setIsModalOpenDownload(false);
  };

  const handleCreateRepository = (data) => {
    // Aquí iría la lógica para crear un nuevo repositorio con los datos enviados desde el modal
    console.log('Creando nuevo repositorio:', data);
    handleCloseModalCreate(); // Cierra el modal después de crear el repositorio
  };

  const handleDownloadRepository = async (data) => {
    // Get owner and name from data (assuming data contains owner and name)
    const { owner, name } = data;

    try {
      // Call downloadNewRepository
      await downloadNewRepository(owner, name);
      console.log('Download initiated for repository:', data); 
    } catch (error) {
      console.error('Error downloading repository:', error);
      // Handle download error (optional)
    } finally {
      handleCloseModalDownload(); // Close the modal after download initiation or error
    }
  };

  const handleUpdateRepository = async (repositoryId) => {
    try {
      await updateRepository(repositoryId);
      console.log('Repository updated:', repositoryId);
    } catch (error) {
      console.error('Error updating repository:', error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (repositories.length === 0) {
    return <div>No repositories found</div>;
  }

  return (
    <div className="repository-list-container">
      <h2 className="text-center">Lista de Repositorios</h2>
      <button onClick={handleOpenModalCreate} className="create-repo-button">Crear Nuevo Repositorio</button>
      <button onClick={handleOpenModalDownload} className="download-repo-button">Descargar Nuevo Repositorio</button>
      <div className="repository-list">
        {repositories.map(repo => (
          <div key={repo.repositoryId} className="repository-card">
            <button 
              onClick={() => handleUpdateRepository(repo.repositoryId)} 
              className="refresh-repo-button">&#x21bb;</button>
            <h3 className="repo-name">{repo.name}</h3>
            <p className="repo-owner"><strong>Owner:</strong> {repo.owner}</p>
            <p><strong>ID:</strong> {repo.repositoryId}</p>
            <p><strong>Git ID:</strong> {repo.gitId}</p>
            <p><strong>Descripcion:</strong> {repo.description}</p>
            <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="repository-link">
              Ver en GitHub
            </a>
            
          </div>
        ))}
      </div>
      {isModalOpenCreate && <ModalCreateRepository onClose={handleCloseModalCreate} onCreate={handleCreateRepository} />}
      {isModalOpenDownload && (
        <ModalDownloadRepository // Updated usage
          onClose={handleCloseModalDownload}
          onDownload={handleDownloadRepository} // Pass handleDownloadRepository
        />
      )}
    </div>
  );
};

export default RepositoryList;