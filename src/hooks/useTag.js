import { useState, useEffect } from 'react';

export const useTag = () => {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('https://localhost:7237/api/Tag/GetAll');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setError('Failed to fetch tags');
      }
    };

    fetchTags();
  }, []);

  const addTag = async (tag) => {
    try {
      console.log('tag to create',tag);
      const response = await fetch("https://localhost:7237/api/Tag/Create", {
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
      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  };  

  const addTagToIssue = async (tagsId, issueId) => {
    try {
      console.log('addTagToIssue');
      console.log('tagsId',tagsId);
      console.log('issueId',issueId);
      console.log(JSON.stringify({tagsId,issueId}));
      console.log("https://localhost:7237/api/Tag/AddTagToIssue");
      console.log(JSON.stringify({tagsId,issueId}));

      const response = await fetch("https://localhost:7237/api/Tag/AddTagToIssue", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          tagsId: tagsId,
          issueId: issueId
        })
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

  return { tags, error, addTag, addTagToIssue };
};

export default useTag;
