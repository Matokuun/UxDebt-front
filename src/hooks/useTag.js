import { useState, useEffect } from 'react';

export const useTag = () => {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTags = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/Tag/GetAll/');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTags(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  const addTag = async (tag) => {
    try {
      const response = await fetch("http://localhost:8000/api/Tag/Create/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newTag = await response.json();
      setTags(prevTags => [...prevTags, newTag]);
      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  };

  const addTagToIssue = async (tagsId, issueId) => {
    try {
      const response = await fetch("http://localhost:8000/api/Tag/AddTagToIssue/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagsId, issueId })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newTag = await response.json();
      return newTag;
    } catch (error) {
      console.error('Error Inserting tags to Issue:', error);
      throw error;
    }
  };

  const updateTag = async (tag) => {
    try {
      const response = await fetch(`http://localhost:8000/api/Tag/Update/${tag.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag),
      });

      if (!response.ok) {
        throw new Error('Failed to update tag');
      }

      const updatedTag = await response.json();
      
      setTags((prevTags) =>
        prevTags.map((t) => (t.id === updatedTag.id ? updatedTag : t))
      );
      return updatedTag;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  };

  const deleteTag = async (tagId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/Tag/${tagId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete tag');
      }
  
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  };

  return { tags, error, loading, getTags, addTag, addTagToIssue, updateTag, deleteTag };
};

export default useTag;
