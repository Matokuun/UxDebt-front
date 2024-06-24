import React from 'react';
import '../styles/ModalAddTag.css';

const ModalAddTag = ({ show, onClose, children }) => {

  if (!show) {
    return null;
  }



  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        {children}        
      </div>
    </div>
  );
};

export default ModalAddTag;
