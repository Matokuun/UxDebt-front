import { useState, useEffect, useCallback, useRef } from 'react';
import { authFetch } from '../utils/authFetch';

const DEFAULT_FILTERS = {
  pageNumber: 1,
  pageSize: 5,
  Title: undefined,
  startDate: undefined,
  endDate: undefined,
  Discarded: undefined,
  Status: undefined,
  RepositoryId: undefined,
  ProjectId: undefined,
  ProjectStatus: undefined,
  Tags: [],
  Labels: [],
  OrderBy: 'created_at',
};

export const useIssue = () => {
  const [issues, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    totalItems: 0,
    pageSize: 5,
  });

  const isFirstRender = useRef(true);

  /* ============================
     FETCH ALL ISSUES (una vez)
  ============================ */
  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        const response = await authFetch(
          `${process.env.REACT_APP_API_URL}/Issue/GetAll/`
        );
        const data = await response.json();
        setAllIssues(data || []);
      } catch (error) {
        console.error('🪝 useIssue - Error fetching all issues:', error);
      }
    };

    fetchAllIssues();
  }, []);

  /* ============================
     FETCH ISSUES CON FILTROS
  ============================ */
  const fetchIssues = useCallback(async () => {
    try {
      const response = await authFetch(
        `${process.env.REACT_APP_API_URL}/Issue/GetAllByFilter/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filters),
        }
      );

      const data = await response.json();

      console.log('🔍 Respuesta del backend:', data);

      setIssues(data.results || []);
      setPagination({
        totalItems: data.count,
        currentPage: filters.pageNumber,
        pageSize: filters.pageSize,
        hasNext: data.next !== null,
        hasPrevious: data.previous !== null,
        totalPages: Math.ceil(data.count / filters.pageSize),
      });
    } catch (error) {
      console.error('🪝 useIssue - Error fetching issues:', error);
    }
  }, [filters]);

  /* ============================
     EFECTO CONTROLADO
  ============================ */
  useEffect(() => {
    // evita doble request en mount (React StrictMode)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchIssues();
      return;
    }

    fetchIssues();
  }, [fetchIssues]);

  /* ============================
     ACTIONS
  ============================ */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const switchDiscarded = async (issueId) => {
    await authFetch(
      `${process.env.REACT_APP_API_URL}/Issue/SwitchDiscarded/${issueId}/`,
      { method: 'POST' }
    );
  };

  const updateIssue = async (issueId, updatedIssue) => {
    const response = await authFetch(
      `${process.env.REACT_APP_API_URL}/Issue/Update/${issueId}/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedIssue),
      }
    );

    if (!response.ok) {
      throw new Error('Error actualizando issue');
    }

    setIssues((prev) =>
      prev.map((i) => (i.issueId === issueId ? updatedIssue : i))
    );
  };

  const getIssue = async (id) => {
    const response = await authFetch(
      `${process.env.REACT_APP_API_URL}/Issue/Get/${id}`
    );
    return response.json();
  };

  const getFile = async () => {
    const response = await authFetch(
      `${process.env.REACT_APP_API_URL}/Issue/GetFile/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `issues_${Date.now()}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const addIssues = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    await authFetch(
      `${process.env.REACT_APP_API_URL}/Issue/ImportIssues/`,
      {
        method: 'POST',
        body: formData,
      }
    );
  };

  return {
    issues,
    allIssues,
    pagination,
    updateFilters,
    switchDiscarded,
    updateIssue,
    getIssue,
    getFile,
    addIssues,
  };
};

export default useIssue;
