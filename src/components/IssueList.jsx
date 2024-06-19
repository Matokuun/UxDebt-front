import React, { useState } from 'react';
import useIssue from '../hooks/useIssue';
import Issue from './Issue';
import Modal from './Modal';
import '../styles/IssueList.css';

const IssueList = () => {
  const { issues, switchDiscarded, updateIssue, updateFilters } = useIssue();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCreatedAt, setSearchCreatedAt] = useState('');
  const [searchDiscarded, setSearchDiscarded] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [searchLabels, setSearchLabels] = useState([]);

  const handleSwitchDiscarded = async (issueId) => {
    try {
      await switchDiscarded(issueId);
    } catch (error) {
      setErrorMessage('Hubo un error al cambiar el estado de descartado.');
      setErrorModalOpen(true);
    }
  };

  const handleUpdateIssue = async (issueId, updatedIssue) => {
    try {
      await updateIssue(issueId, updatedIssue);
    } catch (error) {
      setErrorMessage('Hubo un error al actualizar el issue.');
      setErrorModalOpen(true);
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleSearch = () => {
    updateFilters({
      Title: searchTitle.trim() || null,
      CreatedAt: searchCreatedAt || null,
      Discarded: searchDiscarded || null,
      Status: searchStatus || null,
      Tags: searchTags.length > 0 ? searchTags : null,
      Labels: searchLabels.length > 0 ? searchLabels : null,
      pageNumber: 1
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSearchCreatedAt('');
    setSearchDiscarded('');
    setSearchStatus('');
    setSearchTags([]);
    setSearchLabels([]);
    updateFilters({
      Title: null,
      CreatedAt: null,
      Discarded: null,
      Status: null,
      Tags: null,
      Labels: null,
      pageNumber: 1
    });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateFilters({ pageNumber: newPage });
  };

  return (
    <div className="issue-list-container">
      <h2 className="text-center">Lista de Issues</h2>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          type="date"
          className="search-input"
          placeholder="Buscar por fecha de creación"
          value={searchCreatedAt}
          onChange={(e) => setSearchCreatedAt(e.target.value)}
        />
        <select
          className="search-select"
          value={searchDiscarded}
          onChange={(e) => setSearchDiscarded(e.target.value)}
        >
          <option value="">Descartado</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
        <select
          className="search-select"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">Estado</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
        <button className="search-button" onClick={handleSearch}>Buscar</button>
        <button className="search-button" onClick={handleClearFilters}>Limpiar filtros</button>
      </div>
      {errorModalOpen && (
        <Modal
          title="Error"
          description={errorMessage}
          onClose={handleCloseErrorModal}
        />
      )}
      <div className="issue-columns">
        {Array.isArray(issues) && issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue.issueId} className="issue-column">
              <Issue
                issue={issue}
                onSwitchDiscarded={handleSwitchDiscarded}
                onUpdateIssue={handleUpdateIssue}
              />
            </div>
          ))
        ) : (
          <div>No issues found</div>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default IssueList;
