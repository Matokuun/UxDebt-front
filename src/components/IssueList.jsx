import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { es } from "date-fns/locale/es";
import useIssue from '../hooks/useIssue';
import useRepositories from '../hooks/useRepositories';
import Issue from './Issue';
import '../styles/IssueList.css';
import useTag from '../hooks/useTag';
import PopUp from './PopUp';
import { debounce } from 'lodash';

const IssueList = ({ refreshTrigger }) => {
  const { issues, pagination, switchDiscarded, updateIssue, updateFilters, getExcel } = useIssue();
  const { repositories } = useRepositories();
  const { tags, getTags } = useTag();
  const [popup, setPopup] = useState({ status: '', show: false, message: '' });

  const [filters, setFilters] = useState({
    title: '',
    dateRange: [null, null],
    discarded: '',
    status: '',
    repository: [],
    tags: [],
    orderBy: 'created_at',
    currentPage: 1
  });

  const filterParams = useMemo(() => {
    const [startDate, endDate] = filters.dateRange;
    return {
      Title: filters.title || null,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      Discarded: filters.discarded !== "" ? filters.discarded : null,
      Status: filters.status !== "" ? filters.status : null,
      Tags: filters.tags.length > 0 ? filters.tags.map(tag => tag.tagId) : null,
      RepositoryId: filters.repository.length > 0 ? filters.repository : null,
      OrderBy: filters.orderBy || 'created_at',
      pageNumber: filters.currentPage,
      pageSize: 5,
    };
  }, [filters]);

  const debouncedUpdateFilters = useCallback(
    debounce((params) => {
      updateFilters(params);
    }, 500),
    []
  );

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    debouncedUpdateFilters(filterParams);
  }, [filterParams, debouncedUpdateFilters]);

  useEffect(() => {
    if (refreshTrigger) {
      debouncedUpdateFilters(filterParams);
    }
  }, [refreshTrigger]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      currentPage: key === 'currentPage' ? value : 1
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      dateRange: [null, null],
      discarded: '',
      status: '',
      repository: [],
      tags: [],
      orderBy: 'created_at',
      currentPage: 1
    });
  };

  const handleCreateExcel = () => {
    getExcel();
  };

  const handleSwitchDiscarded = async (issueId) => {
    try {
      await switchDiscarded(issueId);
      setPopup({ show: true, status: 'success', message: 'El estado del issue fue modificado con éxito' });
    } catch (error) {
      setPopup({ show: true, status: 'error', message: 'Error al modificar el estado del issue' });
      console.error('Error switching issue:', error);
    }
  };

  const handleUpdateIssue = async (issueId, updatedIssue) => {
    try {
      await updateIssue(issueId, updatedIssue);
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const closePopup = () => {
    setPopup({ show: false, status: '', message: '' });
  };

  return (
    <div className="issue-list-container">
      <h2 className="text-center">Lista de Issues</h2>


      <div className="search-bar">
        <div className="search-field">
          <TextField
            id="searchTitle"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            label="Buscar por título"
            variant="outlined"
            size="small"
          />
        </div>

        <div className="search-field">
          <Autocomplete
            multiple
            value={repositories.filter(repo => filters.repository.includes(repo.repositoryId))}
            onChange={(event, newValues) => handleFilterChange('repository', newValues.map(repo => repo.repositoryId))}
            options={repositories || []}
            getOptionLabel={(repo) => repo?.name || ''}
            isOptionEqualToValue={(option, value) => option.repositoryId === value.repositoryId}
            renderInput={(params) => <TextField {...params} label="Repositorios" variant="outlined" size="small"/>}
          />
        </div>

        <div className="search-field">
          <Autocomplete
            multiple
            id="searchTags"
            value={filters.tags}
            onChange={(e, newValue) => handleFilterChange('tags', newValue)}
            options={tags || []}
            getOptionLabel={(tag) => tag.name || ''}
            isOptionEqualToValue={(option, value) => option.tagId === value.tagId}
            renderInput={(params) => <TextField {...params} label="Buscar por Tags" variant="outlined" size="small" />}
          />
        </div>

        <div className="search-field" style={{ position: 'relative' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DateRangePicker
              localeText={{ start: 'Fecha inicio', end: 'Fecha fin' }}
              value={filters.dateRange}
              onChange={(newValue) => handleFilterChange('dateRange', newValue)}
              slotProps={{
                textField: { size: 'small' },
              }}
            />
          </LocalizationProvider>
          {filters.dateRange[0] || filters.dateRange[1] ? (
            <button
              onClick={() => handleFilterChange('dateRange', [null, null])}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                color: '#666'
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ) : null}
        </div>

        <div className="search-field">
          <FormControl fullWidth size="small">
            <InputLabel>Buscar por Descarte</InputLabel>
            <Select
              value={filters.discarded}
              label="Buscar por Descarte"
              onChange={(e) => handleFilterChange('discarded', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value={1}>Sí</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="search-field">
          <FormControl fullWidth size="small">
            <InputLabel>Buscar por Estado</InputLabel>
            <Select
              value={filters.status}
              label="Buscar por Estado"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value={1}>Abierto</MenuItem>
              <MenuItem value={0}>Cerrado</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="search-field">
          <FormControl fullWidth size="small">
            <InputLabel>Ordenar Por</InputLabel>
            <Select
              value={filters.orderBy}
              label="Ordenar Por"
              onChange={(e) => handleFilterChange('orderBy', e.target.value)}
            >
              <MenuItem value="created_at">Fecha Creación (más reciente a más antiguo)</MenuItem>
              <MenuItem value="-created_at">Fecha Creación (más antiguo a más reciente)</MenuItem>
              <MenuItem value="title">Título (Orden ascendente)</MenuItem>
              <MenuItem value="-title">Título (Orden descendente)</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="search-buttons">
        <button className="search-button" onClick={handleClearFilters}>
          Limpiar filtros
        </button>
        <button className="download-button" onClick={handleCreateExcel}>
          Descargar archivo excel
        </button>
      </div>

      <div className="legend">
        <p style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ backgroundColor: '#28a745', width: '20px', height: '20px', display: 'inline-block', borderRadius: '50%' }}></span> Abierto
          <span style={{ backgroundColor: '#6f42c1', width: '20px', height: '20px', display: 'inline-block', borderRadius: '50%' }}></span> Cerrado
        </p>
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

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handleFilterChange('currentPage', 1)}
            className={`pagination-button ${filters.currentPage === 1 ? 'active' : ''}`}
          >
            1
          </button>
          {filters.currentPage > 4 && <span className="pagination-dots">...</span>}
          {[...Array(5).keys()]
            .map(offset => filters.currentPage - 3 + offset)
            .filter(pageNumber => pageNumber > 1 && pageNumber < pagination.totalPages)
            .map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => handleFilterChange('currentPage', pageNumber)}
                className={`pagination-button ${filters.currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            ))}
          {filters.currentPage < pagination.totalPages - 4 && <span className="pagination-dots">...</span>}
          <button
            onClick={() => handleFilterChange('currentPage', pagination.totalPages)}
            className={`pagination-button ${filters.currentPage === pagination.totalPages ? 'active' : ''}`}
          >
            {pagination.totalPages}
          </button>
        </div>
      )}

      <PopUp popup={popup} closePopup={closePopup} />
    </div>
  );
};

export default IssueList;
