import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const ManualIssueForm = ({ onSuccess, onError }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/Issue/newIssue/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, tag }),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(`Issue creado con ID ${data.id}`);
        setTitle('');
        setBody('');
        setTag('');
      } else {
        const errorData = await response.json();
        onError(errorData.error || 'Error al crear el issue');
      }
    } catch (error) {
      onError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        marginTop: 2,
        backgroundColor: '#fafafa'
      }}
    >
      <TextField
        label="Nombre del issue (obligatorio)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        size="small"
      />
      <TextField
        label="Descripción (opcional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        multiline
        rows={3}
        size="small"
      />
      <TextField
        label="Tag (opcional)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        size="small"
      />
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Creando...' : 'Crear Issue'}
      </Button>
    </Box>
  );
};

export default ManualIssueForm;