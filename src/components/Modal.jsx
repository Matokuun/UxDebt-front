import React from 'react';
import '../styles/Modal.css';

const Modal = ({ title, description, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
