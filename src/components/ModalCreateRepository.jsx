import React, { useState } from 'react';
import '../styles/ModalCreateRepository.css';
import PopUp from './PopUp';
import useRepositories from '../hooks/useRepositories';

const ModalCreateRepository = ({ onClose }) => {
  const [name, setName] = useState('');
  const [gitId, setGitId] = useState('');
  const [htmlUrl, setHtmlUrl] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [popup, setPopup] = useState({ status:'', show: false, message: '' });
  const { createNewRepository } = useRepositories(); // Include downloadNewRepository

  const handleSubmit = (e) => {

    try {
      e.preventDefault();
      
      createNewRepository(name, owner, gitId, htmlUrl, description)
      setPopup({ show: true, status:'success', message :'Repositorio creado con exito' })
      console.log({ name, gitId, htmlUrl, description });
      onClose(); // Cierra el modal después de enviar el formulario
      
    } catch (error) {
      setPopup({ show: true, status:'error', message :'Error al crear Repositorio' })        
      console.error('Error adding tag:', error);    
    }
    
  };

  const closePopup = () => {
    setPopup({ show: false, status: '', message: '' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Nuevo Repositorio</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="owner">Dueño</label>
            <input
              type="text"
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gitId">Git ID</label>
            <input
              type="text"
              id="gitId"
              value={gitId}
              onChange={(e) => setGitId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="htmlUrl">HTML URL</label>
            <input
              type="url"
              id="htmlUrl"
              value={htmlUrl}
              onChange={(e) => setHtmlUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">Crear</button>
            <button type="button" onClick={onClose} className="cancel-button">Cerrar</button>
          </div>
        </form>
      </div>
      <PopUp 
        status={popup.status} 
        message={popup.message} 
        show={popup.show} 
        onClose={closePopup}
      />
    </div>
  );
};

export default ModalCreateRepository;
