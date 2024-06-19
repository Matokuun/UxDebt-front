import React, { useState } from 'react';
import Modal from './ModalAddTag';
import { useTag } from '../hooks/useTag';
import '../styles/AddTag.css';

const AddTag = () => {
  const [showModal, setShowModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagDescription, setTagDescription] = useState('');
  const [tagCode, setTagCode] = useState('');
  const { addTag } = useTag();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTagName('');
    setTagDescription('');
    setTagCode('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newTag = { name: tagName, code: tagCode, description: tagDescription };
      await addTag(newTag);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  return (
    <div>
      <button className="add-tag-button" onClick={handleOpenModal}>
        Agregar nuevo tag
      </button>
      <Modal show={showModal} onClose={handleCloseModal}>
        <h2>Agregar Nuevo Tag</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tagName">Nombre del Tag:</label>
            <input
              type="text"
              id="tagName"
              name="tagName"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tagCode">Código del Tag:</label>
            <input
              type="text"
              id="tagCode"
              name="tagCode"
              value={tagCode}
              onChange={(e) => setTagCode(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tagDescription">Descripción:</label>
            <textarea
              id="tagDescription"
              name="tagDescription"
              value={tagDescription}
              onChange={(e) => setTagDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </Modal>
    </div>
  );
};

export default AddTag;
