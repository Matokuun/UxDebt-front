import React, { useState } from 'react';
import '../styles/Issue.css';
import gitIcon from '../git_icon.png';
import useTag from '../hooks/useTag';
import {
  Chip,
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authFetch } from '../utils/authFetch';

dayjs.extend(relativeTime);
dayjs.locale('es');

const Issue = ({ issue, repoName, onSwitchDiscarded, onIssueUpdate }) => {
  const { tags } = useTag();
  const [description, setDescription] = useState(issue.observation || '');
  const [discarded, setDiscarded] = useState(issue.discarded || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const [pageIssue, setPageIssue] = useState(issue);
  const [selectedTags, setSelectedTags] = useState(issue.tags || []);
  const predicted = pageIssue.predicted_tags || [];
  const primary = predicted.find(p => p.rank === 1);
  const secondary = predicted.find(p => p.rank === 2);
  const labelsArray = issue.labels
    ? issue.labels.split(',').map((label) => label.trim())
    : [];

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
    const tagIds = selectedTags.map((tag) => tag.tagId);

    try {
      const isDescriptionChanged = description !== pageIssue.observation;
      const isDescriptionEmpty = description.trim() === '';

      if (isDescriptionChanged || isDescriptionEmpty) {
        const issueUpdateResponse = await authFetch(
          `${process.env.REACT_APP_API_URL}/Issue/Update/${pageIssue.issueId}/`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ observation: description }),
          }
        );

        if (!issueUpdateResponse.ok) {
          throw new Error('Error al actualizar la observación');
        }

        setPageIssue((prev) => ({
          ...prev,
          observation: description,
        }));

        if (onIssueUpdate) {
          onIssueUpdate({
            ...pageIssue,
            observation: description,
            tags: selectedTags,
          });
        }
      }

      if (
        JSON.stringify(tagIds) !==
        JSON.stringify(pageIssue.tags.map((tag) => tag.tagId))
      ) {
        const tagsUpdateResponse = await authFetch(
          `${process.env.REACT_APP_API_URL}/Tag/AddTagToIssue/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              issueId: pageIssue.issueId,
              tagsId: tagIds,
            }),
          }
        );

        if (!tagsUpdateResponse.ok) {
          throw new Error('Error al actualizar los tags');
        }
      }

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Issue actualizado con éxito',
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error al modificar la descripción y/o los tags del issue',
      });
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

  const handleApplyPredictedTag = async (predicted) => {
    if (!predicted || !predicted.tag) return;

    // Si ya tiene el tag, avisamos y no hacemos nada
    if (selectedTags.some(t => t.tagId === predicted.tag.tagId)) {
      setSnackbar({
        open: true,
        severity: 'info',
        message: 'El issue ya tiene este Tag aplicado',
      });
      return;
    }

    // Agregar el tag a los seleccionados
    const newTags = [...selectedTags, predicted.tag];
    setSelectedTags(newTags);

    try {
      setIsLoading(true);

      const tagIds = newTags.map(t => t.tagId);

      const tagsUpdateResponse = await authFetch(
        `${process.env.REACT_APP_API_URL}/Tag/AddTagToIssue/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            issueId: pageIssue.issueId,
            tagsId: tagIds,
          }),
        }
      );

      if (!tagsUpdateResponse.ok) {
        throw new Error('Error al aplicar el Tag');
      }

      // Actualiza estado del issue sin recargar
      const updatedIssue = {
        ...pageIssue,
        tags: newTags,
      };
      setPageIssue(updatedIssue);

      if (onIssueUpdate) onIssueUpdate(updatedIssue);

      setSnackbar({
        open: true,
        severity: 'success',
        message: `Tag "${predicted.tag.name}" aplicado con éxito`,
      });

    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Error al aplicar el Tag',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createdAt = dayjs(pageIssue.createdAt);
  const closedAt = isClosed ? dayjs(pageIssue.closedAt) : null;
  const resolutionTime = isClosed ? closedAt.from(createdAt) : null;

  const simplifiedResolutionTime = resolutionTime
    ? resolutionTime.replace(/^hace /, '').replace(/^en /, '')
    : null;

  return (
    <div
      className={`issue-container ${isLoading ? 'loading' : ''} ${
        isClosed ? 'status-closed' : 'status-open'
      }`}
    >
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
            <img src={gitIcon} alt="GitHub" className="github-icon" />
          </a>
        </div>
        <span className="repo-name">
          <strong>
            <em>{repoName}</em>
          </strong>
        </span>
      </div>

      <div className="issue-details-inline">
        <p>
          <strong>Creado:</strong> {createdAt.format('DD/MM/YYYY HH:mm')}
        </p>
        {isClosed && (
          <p>
            <strong>Tiempo de resolución:</strong> {simplifiedResolutionTime}
          </p>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="issue-details-inline">
          <strong>Tags:</strong>
          {selectedTags.map((tag) => (
            <Chip
              key={tag.tagId}
              label={tag.name}
              className="tag-chip"
              size="small"
            />
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
          <strong>Observación:</strong>
          <span>{pageIssue.observation}</span>
        </div>
      )}
      
      {primary && (
        <div className="issue-details-inline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>Predicción modelo:</strong>
          <Chip
            label={`${primary.tag.name} (${(primary.confidence * 100).toFixed(1)}%)`}
            size="small"
            sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}
          />

          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#1e3a8a',
              '&:hover': { bgcolor: '#172554' },
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 1.5,
            }}
            onClick={() => handleApplyPredictedTag(primary)}
          >
            Aplicar Tag
          </Button>
        </div>
      )}

      {secondary && (
        <div className="issue-details-inline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>2da Predicción:</strong>
          <Chip
            label={`${secondary.tag.name} (${(secondary.confidence * 100).toFixed(1)}%)`}
            size="small"
            sx={{ backgroundColor: '#9c27b0', color: 'white', fontWeight: 'bold' }}
          />

          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#424242',
              '&:hover': { bgcolor: '#333333' },
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 1.5,
            }}
            onClick={() => handleApplyPredictedTag(secondary)}
          >
            Aplicar Tag
          </Button>
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

        <button
          onClick={() => setIsEditing(true)}
          className="submit-button"
          disabled={isLoading}
        >
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={isEditing}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
      >
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
                isOptionEqualToValue={(option, value) =>
                  option.tagId === value.tagId
                }
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
          <Button
            onClick={handleCancelEdit}
            color="secondary"
            disabled={isLoading}
          >
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
