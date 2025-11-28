import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function EditIncident() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('Open');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await api.get(`/incidents/${id}`);
        const incident = response.data;
        setTitle(incident.title);
        setDesc(incident.desc || '');
        setStatus(incident.status);
        setPriority(incident.priority);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch incident');
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/incidents/${id}`, {
        title,
        desc,
        status,
        priority,
      });
      navigate('/home');
    } catch (err) {
      setError('Failed to update incident');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Incident</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In_Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Update</button>
        <button type="button" onClick={() => navigate('/home')}>Cancel</button>
      </form>
    </div>
  );
}

export default EditIncident;
