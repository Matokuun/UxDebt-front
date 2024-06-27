import React, { useState } from 'react';
import '../styles/Issue.css';
import ModalAddTagToIssue from './ModalAddTagToIssue';
import PopUp from './PopUp';

const Issue = ({ issue, repoName, onSwitchDiscarded, onUpdateIssue }) => {
  const [description, setDescription] = useState(issue.observation || '');
  const [discarded, setDiscarded] = useState(issue.discarded || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalAddTagToIssue, setShowModalAddTagToIssue] = useState(false);
  const [popup, setPopup] = useState({ status: '', show: false, message: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [pageIssue, setPageIssue] = useState(issue);

  // useEffect(() => {

  //   setDescription(issue.observation || '');
  //   setDiscarded(issue.discarded || false);
  // }, [issue]);

  const labelsArray = issue.labels ? issue.labels.split(',').map(label => label.trim()) : [];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSwitchDiscarded = async () => {
    setIsLoading(true);
    try {
      await onSwitchDiscarded(issue.issueId);
      setDiscarded(!discarded);
    } catch (error) {

      //turn back the discarded
      pageIssue.discarded = issue.discarded;
      setPageIssue(pageIssue);

      console.error('Error switching discarded:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const updatedIssue = {
      ...pageIssue,
      observation: description,
    };
    try {
      let resp= await onUpdateIssue(pageIssue.issueId, updatedIssue);
      console.log('resp',resp);
      setPopup({ show: true, status: 'success', message: 'Descripción del issue modificada con éxito' });
    } catch (error) {
      //turn back the description
      pageIssue.observation = issue.observation;
      console.log(issue.observation);
      console.log(pageIssue.observation);
      setPageIssue(pageIssue);
      
      console.error('Error updating issue:', error);
      setPopup({ show: true, status: 'error', message: 'Error al modificar la descripción del issue' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddTagToIssue = () => {
    setShowModalAddTagToIssue(true);
  };

  const handleCloseAddTagToIssue = () => {
    setShowModalAddTagToIssue(false);
  };

  const closePopup = () => {
    setPopup({ show: false, status: '', message: '' });
  };

  return (    
    <div className={`issue-container ${isLoading ? 'loading' : ''}`}>
      {showModalAddTagToIssue && (
        <ModalAddTagToIssue
          show={showModalAddTagToIssue}
          onClose={handleCloseAddTagToIssue}
          issueId={pageIssue.issueId}
          actualsTags={pageIssue.tags}
        />
      )}
      <div className="issue-header">
        <a title='Abrir en GitHub' href={pageIssue.htmlUrl} target="_blank" rel="noopener noreferrer" className="issue-link">
          <h2 className="issue-title">{pageIssue.title}</h2>
        </a>
        <span className={`issue-status status-${pageIssue.status}`}>
          {pageIssue.status === 0 ? 'Open' : pageIssue.status === 1 ? 'Closed' : 'All'}
        </span>
      </div>
      <div className="issue-tags">
        <strong>Tags:</strong>
          <div className="issue-tags-grid">
            {pageIssue.tags?.map(tag => (
              <div key={tag.tagId} className="tag">
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      <div className="issue-link-container">        
      </div>
      <div className="issue-content">
        <div className="issue-details">
          <p className="issue-repo"><strong>Repositorio:</strong> {repoName}</p>
          <p className="issue-created"><strong>Creado:</strong> {new Date(pageIssue.createdAt).toLocaleDateString()}</p>
          <p className="issue-closed"><strong>Cerrado:</strong> {pageIssue.closedAt ? new Date(pageIssue.closedAt).toLocaleDateString() : ''}</p>
          <div className="issue-labels">
            <p><strong>Labels:</strong></p>
            <ul>
              {labelsArray.slice(0, isExpanded ? labelsArray.length : 3).map((label, index) => (
                <li key={index} className="label">{label}</li>
              ))}
            </ul>
            {labelsArray.length > 3 && (
              <button onClick={toggleExpand} className="expand-button">
                {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
              </button>
            )}
          </div>
        </div>          
      </div>
      <div className="issue-description">
        <label htmlFor={`desc-${pageIssue.issueId}`}><strong>Descripción</strong></label>
        <textarea
          id={`desc-${pageIssue.issueId}`}
          value={description}
          onChange={handleDescriptionChange}
          rows="3"
          className="issue-description-input"
          disabled={isLoading}
        />
      </div>
      <div className="issue-actions">
        <div className="switch-container">
          <label className="switch">
            <input
              type="checkbox"
              id={`discard-${pageIssue.issueId}`}
              checked={discarded}
              onChange={handleSwitchDiscarded}
              disabled={isLoading}
            />
            <span className="slider"></span>
          </label>
          <span className="switch-text">Descartado</span>
        </div>
        <button onClick={handleSubmit} className="submit-button" disabled={isLoading}>
          Modificar
        </button>
        <button onClick={handleOpenAddTagToIssue} className="submit-button" disabled={isLoading}>
          Modificar Tags
        </button>
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

export default Issue;
