import React, { useState } from 'react';
import '../styles/Issue.css';
import Modal from './Modal';

const Issue = ({ issue, onSwitchDiscarded, onUpdateIssue }) => {
  const [description, setDescription] = useState(issue.observation || '');
  const [discarded, setDiscarded] = useState(issue.discarded || false);
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga de la operación
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSwitchDiscarded = async () => {
    setIsLoading(true); // Activamos la carga mientras se realiza la operación

    try {
      await onSwitchDiscarded(issue.issueId);
      setDiscarded(!discarded); // Actualizamos el estado local solo si la operación tiene éxito
    } catch (error) {
      console.error('Error switching discarded:', error);
      setErrorMessage('Hubo un error al cambiar el estado de descartado.');
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false); // Desactivamos la carga al finalizar la operación, ya sea éxito o error
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Activamos la carga mientras se realiza la operación

    const updatedIssue = {
      ...issue,
      observation: description,
    };

    try {
      await onUpdateIssue(issue.issueId, updatedIssue);
      // Podemos agregar lógica adicional aquí después de una actualización exitosa si es necesario
    } catch (error) {
      console.error('Error updating issue:', error);
      setErrorMessage('Hubo un error al actualizar el issue.');
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false); // Desactivamos la carga al finalizar la operación, ya sea éxito o error
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  return (
    <div className={`issue-container ${isLoading ? 'loading' : ''}`}>
      {errorModalOpen && (
        <Modal
          title="Error"
          description={errorMessage}
          onClose={handleCloseErrorModal}
        />
      )}
      <div className="issue-header">
        <h2 className="issue-title">{issue.title}</h2>
        <div className={`issue-status status-${issue.status}`}>
          {issue.status === 0 ? 'Open' : issue.status === 1 ? 'Closed' : 'All'}
        </div>
      </div>
      <div className="issue-link-container">
        <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer" className="issue-link">
          Ver en GitHub
        </a>
      </div>
      <div className="issue-tags">
        {issue.tags?.map(tag => (
          <div key={tag.tagId} className="tag">
            {tag.name}
          </div>
        ))}
      </div>
      <div className="issue-details">
        <p className="issue-id"><strong>ID:</strong> {issue.issueId}</p>
        <p className="issue-created"><strong>Creado:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
        <p className="issue-closed"><strong>Cerrado:</strong> {issue.closedAt ? new Date(issue.closedAt).toLocaleDateString() : ''}</p>
        <div className="issue-description">
          <label htmlFor={`desc-${issue.issueId}`}><strong>Descripción</strong></label>
          <textarea
            id={`desc-${issue.issueId}`}
            value={description}
            onChange={handleDescriptionChange}
            rows="3"
            className="issue-description-input"
            disabled={isLoading} // Deshabilitamos el textarea mientras se realiza la operación
          />
        </div>
        <div className="issue-action">
          <label className="switch-container">
            <input
              type="checkbox"
              id={`discard-${issue.issueId}`}
              className="switch-checkbox"
              checked={discarded}
              onChange={handleSwitchDiscarded}
              disabled={isLoading} // Deshabilitamos el switch mientras se realiza la operación
            />
            <span className="switch-slider"></span>
          </label>
          <span className="switch-text">Descartado</span>
        </div>
        <button onClick={handleSubmit} className="submit-button" disabled={isLoading}>
          Modificar
        </button>
      </div>
    </div>
  );
};

export default Issue;
