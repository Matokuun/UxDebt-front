import React, { useState } from 'react';
import '../styles/Issue.css';
import gitIcon from '../git_icon.png';
import useTag from '../hooks/useTag';
import { Chip, Autocomplete, TextField, CircularProgress, Box, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('es');

const Issue = ({ issue, repoName, onSwitchDiscarded, onIssueUpdate }) => {
  const { tags } = useTag();
  const [description, setDescription] = useState(issue.observation || '');
  const [discarded, setDiscarded] = useState(issue.discarded || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: '', message: '' });
  const [pageIssue, setPageIssue] = useState(issue);
  const [selectedTags, setSelectedTags] = useState(issue.tags || []);
  const labelsArray = issue.labels ? issue.labels.split(',').map(label => label.trim()) : [];

  const isClosed = pageIssue.closedAt != null;

  const handleSwitchDiscarded = async () => {
    setIsLoading(true);
    try {
      await onSwitchDiscarded(issue.issueId);
      const newDiscardedState = !discarded;
      setDiscarded(newDiscardedState);

      setSnackbar({
        open: true,
        severity: 'info',
        message: newDiscardedState
          ? 'El issue fue marcado como descartado'
          : 'El issue ya no está marcado como descartado',
      });
    } catch (error) {
      console.error('Error switching discarded:', error);
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error al cambiar el estado del issue',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const handleSubmit = async () => {
    setIsLoading(true);
    const tagIds = selectedTags.map(tag => tag.tagId);

    try {
      const isDescriptionChanged = description !== pageIssue.observation;
      const isDescriptionEmpty = description.trim() === '';

      if (isDescriptionChanged || isDescriptionEmpty) {
        const issueUpdateResponse = await fetch(`http://localhost:8000/api/Issue/Update/${pageIssue.issueId}/`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ observation: description }),
        });

        if (!issueUpdateResponse.ok) {
          throw new Error('Error al actualizar la observación');
        }

        setPageIssue(prev => ({
          ...prev,
          observation: description
        }));

        if (onIssueUpdate) {
          onIssueUpdate({
            ...pageIssue,
            observation: description,
            tags: selectedTags
          });
        }
      }

      if (JSON.stringify(tagIds) !== JSON.stringify(pageIssue.tags.map(tag => tag.tagId))) {
        const tagsUpdateResponse = await fetch(`http://localhost:8000/api/Tag/AddTagToIssue/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ issueId: pageIssue.issueId, tagsId: tagIds }),
        });

        if (!tagsUpdateResponse.ok) {
          throw new Error('Error al actualizar los tags');
        }
      }

      setSnackbar({ open: true, severity: 'success', message: 'Issue actualizado con éxito' });
      setIsEditing(false);

    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, severity: 'error', message: 'Error al modificar la descripción y/o los tags del issue' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDescription(pageIssue.observation || '');
    setSelectedTags(pageIssue.tags || []);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const createdAt = dayjs(pageIssue.createdAt);
  const closedAt = isClosed ? dayjs(pageIssue.closedAt) : null;
  const resolutionTime = isClosed
    ? closedAt.from(createdAt)
    : null;

  const simplifiedResolutionTime = resolutionTime ? resolutionTime.replace(/^hace /, '').replace(/^en /, '') : null;

  return (
    <div className={`issue-container ${isLoading ? 'loading' : ''} ${isClosed ? 'status-closed' : 'status-open'}`}>
      <div className="issue-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 className="issue-title">{pageIssue.title}</h2>
          <a
            href={pageIssue.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="view-on-github-icon"
            title="Abrir en GitHub"
          >
            <img
              src={gitIcon}
              alt="GitHub"
              className="github-icon"
            />
          </a>
        </div>
        <span className="repo-name"><strong><em>{repoName}</em></strong></span>
      </div>

      <div className="issue-details-inline">
        <p><strong>Creado:</strong> {createdAt.format('DD/MM/YYYY HH:mm')}</p>
        {isClosed && <p><strong>Tiempo de resolución:</strong> {simplifiedResolutionTime}</p>}
      </div>

      {selectedTags.length > 0 && (
        <div className="issue-details-inline">
          <strong>Tags:</strong>
          {selectedTags.map((tag) => (
            <Chip key={tag.tagId} label={tag.name} className="tag-chip" size="small" />
          ))}
        </div>
      )}

      {labelsArray.length > 0 && (
        <div className="issue-details-inline">
          <strong>Labels (GitHub):</strong> {labelsArray.join(', ')}
        </div>
      )}

      {!isEditing && pageIssue.observation && (
        <div className="issue-details-inline">
          <strong>Observación:</strong><span>{pageIssue.observation}</span>
        </div>
      )}

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

        <button onClick={() => setIsEditing(true)} className="submit-button" disabled={isLoading}>
          Editar
        </button>
      </div>

      {isLoading && (
        <Box display="flex" justifyContent="center" marginTop="20px">
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={isEditing} onClose={handleCancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>Editar Issue: {pageIssue.title}</DialogTitle>
        <DialogContent>
          <div className="edit-form-container">
            <div className="edit-form-row">
              <label>Tags:</label>
              <Autocomplete
                multiple
                value={selectedTags}
                onChange={(event, newValues) => setSelectedTags(newValues)}
                options={tags || []}
                getOptionLabel={(tag) => tag?.name || ''}
                isOptionEqualToValue={(option, value) => option.tagId === value.tagId}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" size="small" />
                )}
                disabled={isLoading}
              />
            </div>

            <div className="edit-form-row">
              <label htmlFor={`desc-${pageIssue.issueId}`}>Observación:</label>
              <TextField
                id={`desc-${pageIssue.issueId}`}
                value={description || ''}
                onChange={handleDescriptionChange}
                variant="outlined"
                rows={1}
                multiline
                fullWidth
                disabled={isLoading}
                size="small"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="secondary" disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Issue;
