import React, { useState, useEffect } from 'react';
import useIssue from '../hooks/useIssue';
import useRepositories from '../hooks/useRepositories';
import Issue from './Issue';
import '../styles/IssueList.css';
import useTag from '../hooks/useTag';
import PopUp from './PopUp';

const IssueList = () => {
  const { issues, switchDiscarded, updateIssue, updateFilters} = useIssue();
  const { repositories } = useRepositories();
  const { tags } = useTag();
  const [searchTitle, setSearchTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCreatedAt, setSearchCreatedAt] = useState('');
  const [searchDiscarded, setSearchDiscarded] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchLabels, setSearchLabels] = useState([]);
  const [searchRepository, setSearchRepository] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const [popup, setPopup] = useState({ status:'', show: false, message: '' });

  useEffect(() => {  }, []);


  const handleSwitchDiscarded = async (issueId) => {
    try {
      await switchDiscarded(issueId);
      setPopup({ show: true, status:'success', message :'El estado del issue fue modificado con exito' })    

    } catch (error) {
      setPopup({ show: true, status:'error', message :'Error al modificar el estado del issue' })        
      console.error('Error swiching issue:', error);    
    }
  };

  const handleUpdateIssue = async (issueId, updatedIssue) => {
    try {
      await updateIssue(issueId, updatedIssue);
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };


  const handleSearch = () => {

    console.log('searchDiscarded',searchDiscarded);
    updateFilters({
      Title: searchTitle.trim() || null,
      CreatedAt: searchCreatedAt || null,
      Discarded: searchDiscarded || null,
      Status: searchStatus !== null && searchStatus !== undefined && searchStatus !== "" ? searchStatus : null,
      Tags: searchTags.length > 0 ? searchTags : null,
      Labels: searchLabels.length > 0 ? searchLabels : null,
      RepositoryId: searchRepository || null,
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
    setSearchRepository('');
    updateFilters({
      Title: null,
      CreatedAt: null,
      Discarded: null,
      Status: null,
      RepositoryId: null,
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

  const handleTagClick = (tagId) => {
    setSearchTags((prevTags) => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter((id) => id !== tagId);
      } else {
        return [...prevTags, tagId];
      }
    });
  };

  const closePopup = () => {
    setPopup({ show: false, status: '', message: '' });
  };

  return (
    <div className="issue-list-container">
      <h2 className="text-center">Lista de Issues</h2>
      <div className="search-bar">
        <div className="search-field">
          <label htmlFor="searchTitle">Buscar por título</label>
          <input
            id="searchTitle"
            type="text"
            className="search-input"
            placeholder="Buscar por título"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div className="search-field">
          <label htmlFor="searchDate">Buscar por Fecha</label>
          <input
            id="searchDate"
            type="date"
            className="search-input"
            placeholder="Buscar por fecha de creación"
            value={searchCreatedAt}
            onChange={(e) => setSearchCreatedAt(e.target.value)}
          />
        </div>
        <div className="search-field">
          <label htmlFor="searchDiscarded">Buscar por Descarte</label>
          <select
            id="searchDiscarded"
            className="search-select"
            value={searchDiscarded}
            onChange={(e) => setSearchDiscarded(e.target.value)}
          >
            <option value="">Todos</option>
            <option value={true}>Sí</option>
            <option value={false}>No</option>
          </select>
        </div>
        <div className="search-field">
          <label htmlFor="searchStatus">Buscar por Estado</label>
          <select
            id="searchStatus"
            className="search-select"
            value={searchStatus}
            onChange={(e) => setSearchStatus(parseInt(e.target.value, 10))} // Convertir el valor a entero
          >
            <option value="">Todos</option>
            <option value="0">Open</option>
            <option value="1">Closed</option>
            <option value="2">All</option>
          </select>
        </div>
        <div className="search-field">
          <label htmlFor="searchRepository">Buscar por Repositorio</label>
          <select          
            id="searchRepository"
            className="search-select"
            value={searchRepository}
            onChange={(e) => setSearchRepository(e.target.value)}
          >
            <option value={null}>Todos</option>
            {repositories?.map(repo => (
              <option 
                key={repo.repositoryId}
                value={repo.repositoryId}>{repo.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="search-field">
        <label htmlFor="searchTags">Buscar por Tags</label>
        <div className="issue-tags">
          {tags?.map(tag => (
            <div
              key={tag.tagId}
              className="tag tag-search"
              style={{ backgroundColor: searchTags.includes(tag.tagId) ? "#007bff" : "#e0e0e0", cursor: "pointer" }}
              onClick={() => handleTagClick(tag.tagId)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>
      {/* BUTTONS */}
      <div className="search-buttons">
        <button className="search-button" onClick={handleSearch}>Buscar</button>
        <button className="search-button" onClick={handleClearFilters}>Limpiar filtros</button>
      </div>      
      <div className="issue-columns">
        {Array.isArray(issues) && issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue.issueId} className="issue-column">
              <Issue
                issue={issue}
                repoName={repositories.find(x => x.repositoryId === issue.repositoryId)?.name || 'No Name Found'}
                onSwitchDiscarded={handleSwitchDiscarded}
                onUpdateIssue={handleUpdateIssue}
              />
            </div>
          ))
        ) : (
          <div className="message no-issues-message">No issues found.</div>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
        <span>{`Página ${currentPage}`}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
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

export default IssueList;
