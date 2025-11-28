import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Home() {
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
// currentPage  it denotes the current page number.
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Fixed page size
  const navigate = useNavigate();

  const fetchIncidents = async () => {
    try {
      const params = { 
        sort_by: 'created_at',
        skip: (currentPage - 1) * pageSize,
        limit: pageSize
      };
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await api.get('/incidents', { params });
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  useEffect(() => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  if (username && password) {
    api.defaults.auth = { username, password };
  }
    fetchIncidents();
  }, [statusFilter, currentPage]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/incidents/${id}`);
      fetchIncidents(); // Refetch after delete
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    // Assuming there are more if we got full pageSize results
    if (incidents.length === pageSize) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h1>Incident Tracker</h1>
      <button onClick={() => navigate('/create')}>Create New Incident</button>
      <div>
        <label>Filter by Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="In_Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.title}</td>
              <td>{incident.desc}</td>
              <td>{incident.status}</td>
              <td>{incident.priority}</td>
              <td>
                <button onClick={() => navigate(`/edit/${incident.id}`)}>Edit</button>
                <button onClick={() => handleDelete(incident.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={incidents.length < pageSize}>Next</button>
      </div>
    </div>
  );
}

export default Home;
