import React, { useState, useEffect } from 'react';
import { Button, IconButton, TextField, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Dialog, DialogTitle, DialogContent, Box, Snackbar, Alert, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useTag } from '../hooks/useTag';
import '../styles/TagsPage.css';

const TagsPage = () => {
  const { tags, error, loading, getTags, updateTag, deleteTag, addTag } = useTag();
  const [selectedTag, setSelectedTag] = useState(null);
  const [editedTag, setEditedTag] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagDescription, setTagDescription] = useState('');
  const [tagCode, setTagCode] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!loading && tags.length === 0) {
      getTags();
    }
  }, [loading, tags.length, getTags]);

  useEffect(() => {
    if (selectedTag) {
      setEditMode(true);
      setTagName(selectedTag.name);
      setTagDescription(selectedTag.description);
      setTagCode(selectedTag.code);
      setShowAddTagModal(true);
    }
  }, [selectedTag]);

  const removeDuplicates = (tagsArray) => {
    const seen = new Map();
    return tagsArray.filter(tag => {
      const key = `${tag.name}-${tag.description}`;
      if (seen.has(key)) return false;
      seen.set(key, true);
      return true;
    });
  };

  const handleEdit = (tag) => {
    setSelectedTag(tag);
  };

  const handleDeleteRequest = (tagId) => {
    setTagToDelete(tagId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (tagToDelete) {
        await deleteTag(tagToDelete);
        getTags();
        setSnackbarMessage('Tag eliminado con éxito.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Ocurrió un error al eliminar el tag.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setConfirmDialogOpen(false);
      setTagToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setTagToDelete(null);
  };

  const handleAddTag = () => {
    setShowAddTagModal(true);
    setEditMode(false);
    setTagName('');
    setTagDescription('');
    setTagCode('');
  };

  const handleCloseAddTagModal = () => {
    setShowAddTagModal(false);
    setSelectedTag(null);
    setEditMode(false);
  };

  const handleSubmitAddTag = async (event) => {
    event.preventDefault();
    try {
      if (editMode) {
        const updatedTag = { name: tagName, code: tagCode, description: tagDescription };
        const success = await updateTag({ ...updatedTag, id: selectedTag.tagId });

        if (success) {
          setSnackbarMessage('Tag actualizado con éxito');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setShowAddTagModal(false);
          getTags();
        }
      } else {
        const newTag = { name: tagName, code: tagCode, description: tagDescription };
        const success = await addTag(newTag);

        if (success) {
          setSnackbarMessage('Tag creado con éxito');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setShowAddTagModal(false);
          getTags();
        }
      }
    } catch (error) {
      setSnackbarMessage('Error desconocido al procesar el tag');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const filteredTags = React.useMemo(() => {
    const searchFiltered = tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return removeDuplicates(searchFiltered);
  }, [tags, searchTerm]);

  const paginatedTags = filteredTags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="tags-page">
      <div className="header">
        <h1>Listado de Tags</h1>
        <Button
          onClick={handleAddTag}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#e8f5e9',
            color: '#388E3C',
            border: '3px solid #388E3C',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '16px',
            marginLeft: '15px',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
        >
          Agregar Tag
        </Button>
      </div>
      
      <TextField
        label="Buscar Tag"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchTerm && (
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
      
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="tableContainer">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Nombre</TableCell>
                <TableCell className="table-header">Descripción</TableCell>
                <TableCell className="table-header">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTags.length > 0 ? (
                paginatedTags.map((tag) => (
                  <TableRow key={tag.tagId}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell className="description-cell">{tag.description}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(tag)} className="icon-button">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteRequest(tag.tagId)} className="icon-button delete">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>No hay tags disponibles</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTags.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}

      <Dialog open={showAddTagModal} onClose={handleCloseAddTagModal}>
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
          {editMode ? 'Editar Tag' : 'Agregar Nuevo Tag'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitAddTag}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 2rem', marginTop: '1rem' }}>
              <TextField
                label="Nombre del Tag"
                variant="outlined"
                fullWidth
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
              <TextField
                label="Código del Tag"
                variant="outlined"
                fullWidth
                value={tagCode}
                onChange={(e) => setTagCode(e.target.value)}
              />
              <TextField
                label="Descripción"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={tagDescription}
                onChange={(e) => setTagDescription(e.target.value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <Button
                  onClick={handleCloseAddTagModal}
                  variant="outlined"
                  sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {editMode ? 'Actualizar' : 'Guardar'}
                </Button>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar este tag?</p>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <Button
              onClick={handleCancelDelete}
              variant="outlined"
              sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="primary"
            >
              Eliminar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagsPage;
