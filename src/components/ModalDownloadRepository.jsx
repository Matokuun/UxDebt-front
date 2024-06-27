import React, { useState } from 'react';
import '../styles/ModalCreateRepository.css';
import PopUp from './PopUp';
import useRepositories from '../hooks/useRepositories';

const ModalDownloadRepository = ({ onClose }) => {
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  const [popup, setPopup] = useState({ status:'', show: false, message: '' });
  const { downloadNewRepository } = useRepositories(); // Include downloadNewRepository

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup({ show: true, status:'success', message :'Esta operacion puede demorar.' })
    await handleDownloadRepository({ owner, name });
  };

  const handleDownloadRepository = async (_sender) => {
    try {
      //setPopup({ show: true, status:'success', message :'Esta operacion puede demorar.' })
      await downloadNewRepository(_sender);
      setPopup({ show: true, status:'success', message :'Repositorio descargado con exito' })
    } 
    catch (error) {
      setPopup({ show: true, status:'error', message :'Error al descargar el repositorio' }) 
      console.error('Error downloading repo:', error);
    } finally {
      //onClose();
    }
  };

  const closePopup = () => {
    setPopup({ show: false, status: '', message: '' });
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
              Cerrar
            </button>
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

export default ModalDownloadRepository;