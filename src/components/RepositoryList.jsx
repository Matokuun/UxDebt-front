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
  const [popup, setPopup] = useState({ status: '', show: false, message: '' });

  const handleUpdateRepository = async (repositoryId) => {
    try {
      await updateRepository(repositoryId);
      setPopup({ show: true, status: 'success', message: 'Repositorio actualizado con exito' })

    } catch (error) {
      console.log('catch error updating repo', error);
      setPopup({ show: true, status: 'error', message: 'Error al actualizar' })
    }
  };

  const closePopup = () => {
    setPopup({ show: false, status: '', message: '' });
  };

  return (
    <div className="repository-list-container">
      <h2 className="text-center">Lista de Repositorios</h2>          
      <button onClick={() => setIsModalOpenCreate(true)} className="create-repo-button">Crear Nuevo Repositorio</button>
      <button onClick={() => setIsModalOpenDownload(true)} className="download-repo-button">Descargar Nuevo Repositorio</button>

      {repositories.length === 0 ? (
        error ? (
          <div className="message error-message">{error}</div>
        ) : (
          <div className="message no-repos-message">No repositories found</div>
        )
      ) : (
        <div className="repository-list">
          {repositories.map(repo => (
            <div key={repo.repositoryId} className="repository-card">
              <button
                onClick={() => handleUpdateRepository(repo.repositoryId)}
                className="refresh-repo-button">&#x21bb;</button>
              <div className="repository-card-content">
                <h3 className="repo-name">{repo.name}</h3>
                <p className="repo-owner"><strong>Owner:</strong> {repo.owner}</p>
                <p><strong>Git ID:</strong> {repo.gitId}</p>
                <p><strong>Descripcion:</strong> {repo.description ? repo.description : 'Sin descripción'}</p>
              </div>
              <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="repository-link">
                Ver en GitHub
              </a>
            </div>
          ))}
        </div>
      )}
      {isModalOpenCreate && <ModalCreateRepository onClose={() => setIsModalOpenCreate(false)} />}
      {isModalOpenDownload && <ModalDownloadRepository onClose={() => setIsModalOpenDownload(false)} /> }
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