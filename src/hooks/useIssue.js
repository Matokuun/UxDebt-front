import { useState, useEffect } from 'react';

export const useIssue = () => {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    Title: null,
    CreatedAt: null,
    Discarded: null,
    Status: null,
    RepositoryId: null,
    Tags: [],
    Labels: []
  });

  useEffect(() => {
    fetchIssues(filters);
  }, [filters]);

  const fetchIssues = async (filters) => {
    const { pageNumber, pageSize, Title, CreatedAt, Discarded, Status, RepositoryId, Tags, Labels } = filters;
    try {
      console.log(`https://localhost:7237/api/Issue/GetAllByFilter/${pageNumber}/${pageSize}`);
      console.log(JSON.stringify({
        Title: Title || null,
        CreatedAt,
        Discarded,
        Status,
        RepositoryId,
        Tags,
        Labels
      }));

      let body = {
        Title: Title || null,
        CreatedAt,
        Discarded,
        Status,
        RepositoryId,
        Tags,
        Labels
      }      
              
      const response = await fetch(`https://localhost:7237/api/Issue/GetAllByFilter/${pageNumber}/${pageSize}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setIssues(data.items ? data.items : []);
    } catch (error) {
      console.error('🪝useIssue - Error fetching issues:', error);
    }
  };

  //Switch discarded prop 
  const switchDiscarded = async (code) => {
    try {

      console.log(code);
      const response = await fetch(`https://localhost:7237/api/Issue/SwitchDiscarded/${code}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('🪝useIssue - Network response was not ok');
      }
      return true;
    } catch (error) {
      console.error('🪝useIssue - Error switching discarded:', error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  };

  //Update Issue
  const updateIssue = async (issueId, updatedIssue) => {
    try {
      const response = await fetch(`https://localhost:7237/api/Issue/Update/${issueId}`, {
        method: 'PUT', // Use PUT if the API expects it
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedIssue),
      });

      if (!response.ok) {
        throw new Error('🪝useIssue - Network response was not ok');
      }

      setIssues((prevIssues) =>
        prevIssues.map((i) =>
          i.issueId === issueId ? updatedIssue : i
        )
      );
      return updatedIssue;
    } catch (error) {
      console.error('🪝useIssue - Error updating issue:', error);
      throw error;
    }
  };

  const updateFilters = (newFilters) => {
    console.log("updateFilters",newFilters);
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const getIssue = async (id) => {
    try {
      const response = await fetch(`https://localhost:7237/api/Issue/Get/${id}`);
      const data = await response.json();   
      return data;

    } catch (error) {
      console.error('Error fetching issue:', error);
    }
  };

  return { issues, switchDiscarded, updateIssue, updateFilters, getIssue};
};

export default useIssue;
