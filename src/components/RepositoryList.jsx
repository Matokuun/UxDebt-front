import React, { useState } from 'react';
import useRepositories from '../hooks/useRepositories';
import '../styles/RepositoryList.css';
import ModalCreateRepository from './ModalCreateRepository';
import ModalDownloadRepository from './ModalDownloadRepository'; // Updated import
import PopUp from './PopUp';

const RepositoryList = () => {
  const { repositories, error, updateRepository } = useRepositories(); // Include downloadNewRepository
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDownload, setIsModalOpenDownload] = useState(false);
  const [popup, setPopup] = useState({ status:'', show: false, message: '' });

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
  const handleUpdateRepository = async (repositoryId) => {
    try {
      await updateRepository(repositoryId);
      setPopup({ show: true, status:'success', message :'Repositorio actualizado con exito' })    

    } catch (error) {
      setPopup({ show: true, status:'error', message :'Error al actualizar' })    
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (repositories.length === 0) {
    return <div>No repositories found</div>;
  }

  
  const closePopup = () => {
    setPopup({ show: false, status: '', message: '' });
  };

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
        />
      )}
      <PopUp 
        status={popup.status} 
        message={popup.message} 
        show={popup.show} 
        onClose={closePopup}
      />
    </div>
  );
};

export default RepositoryList;