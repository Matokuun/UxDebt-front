import { useState, useEffect } from 'react';
//import axios from 'axios';
//import { saveAs } from 'file-saver';

export const useIssue = () => {
  const [issues, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    totalItems: 0,
    pageSize: 5
  });
  const [filters, setFilters] = useState({
    pageSize: 5,
    Title: null,
    startDate: null,
    endDate: null,
    Discarded: null,
    Status: null,
    RepositoryId: null,
    Tags: [],
    Labels: [],
    OrderBy: 'created_at'
  });

  useEffect(() => {
    fetchIssues(); 
    fetchAllIssues(); 
  }, [filters]);

  const fetchAllIssues = async () => {
    try {
      const response = await fetch('http://localhost:7237/api/Issue/GetAll');
      const data = await response.json();
      setAllIssues(data || []);
    } catch (error) {
      console.error('🪝useIssue - Error fetching all issues:', error);
    }
  };

  const fetchIssues = async () => {
    const { pageNumber, pageSize, Title, startDate, endDate, Discarded, Status, RepositoryId, Tags, Labels, OrderBy } = filters;
    
    const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

    let body = {
      Title: Title || undefined,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      Discarded,
      Status,
      RepositoryId,
      Tags,
      Labels,
      OrderBy,
      pageNumber,
      pageSize
    };

    try {
      const url = `http://localhost:7237/api/Issue/GetAllByFilter/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('🔍 Respuesta del backend:', data);

      setIssues(data.results || []);

      setPagination({
        totalItems: data.count,
        currentPage: pageNumber,
        pageSize: pageSize,
        hasNext: data.next !== null,
        hasPrevious: data.previous !== null,
        totalPages: Math.ceil(data.count / pageSize)
      });

    } catch (error) {
      console.error('🪝useIssue - Error fetching issues:', error);
    }
  };

  const switchDiscarded = async (code) => {
    try {
      const response = await fetch(`http://localhost:7237/api/Issue/SwitchDiscarded/${code}/`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('🪝useIssue - Network response was not ok');
      }
      return true;
    } catch (error) {
      console.error('🪝useIssue - Error switching discarded:', error);
      throw error;
    }
  };

  const updateIssue = async (issueId, updatedIssue) => {
    try {
      const response = await fetch(`http://localhost:7237/api/Issue/Update/${issueId}/`, {
        method: 'PUT',
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
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const getIssue = async (id) => {
    try {
      const response = await fetch(`http://localhost:7237/api/Issue/Get/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching issue:', error);
    }
  };

  const getFile = async () => {
    const { pageNumber, pageSize, Title, startDate, endDate, Discarded, Status, RepositoryId, Tags, Labels, OrderBy } = filters;
    
    const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

    let body = {
      Title: Title || undefined,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      Discarded,
      Status,
      RepositoryId,
      Tags,
      Labels,
      OrderBy,
      pageNumber,
      pageSize
    };

    try{
      const url = `http://localhost:7237/api/Issue/GetFile/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
      throw new Error('Error al descargar el archivo');
    }

    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);

    const now = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    const formattedDate = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const filename = `issues_${formattedDate}.csv`;

    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(urlBlob);

    } catch (error){
      console.error("Fallo en frontend: ", error);
    }
  };

  return {
    issues,
    allIssues,
    pagination,
    switchDiscarded,
    updateIssue,
    updateFilters,
    getIssue,
    getFile
  };
};

export default useIssue;
