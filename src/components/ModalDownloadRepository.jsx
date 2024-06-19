import React, { useState } from 'react';
import '../styles/ModalCreateRepository.css';

const ModalDownloadRepository = ({ onClose, onDownload }) => {
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass owner and name to onDownload function (assuming onDownload receives data)
    onDownload({ owner, name });
    onClose(); // Close the modal after download initiation
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Descargar Repositorio</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="owner">Owner</label>
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
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Descargar
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDownloadRepository;