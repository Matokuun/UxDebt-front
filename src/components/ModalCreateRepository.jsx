import React, { useState } from 'react';
import '../styles/ModalCreateRepository.css';

const ModalCreateRepository = ({ onClose }) => {
  const [name, setName] = useState('');
  const [gitId, setGitId] = useState('');
  const [htmlUrl, setHtmlUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, por ahora solo vamos a imprimir los valores
    console.log({ name, gitId, htmlUrl, description });
    onClose(); // Cierra el modal después de enviar el formulario
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear Nuevo Repositorio</h2>
        <form onSubmit={handleSubmit}>
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
            <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateRepository;
