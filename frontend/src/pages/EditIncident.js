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

    <div className="flex min-h-screen w-full flex-col items-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-display">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Incident</h1>
        <p className="mt-2 text-base text-slate-500">Fill in the details below to report a new incident.</p>
      </div>

      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input block w-full rounded-lg border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
              placeholder="e.g., Unable to access user dashboard"
              required
            />
          </div>

          {/* Description Textarea */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={6}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="form-textarea block w-full resize-y rounded-lg border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
              placeholder="Provide a detailed explanation of the issue..."
              required
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Status Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-medium text-slate-700">
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select block w-full appearance-none rounded-lg border-slate-200 bg-slate-50/50 p-3 pr-10 text-sm text-slate-900 focus:border-primary focus:ring-primary/20"
                >
                  <option value="Open">Open</option>
                  <option value="In_Progress">In_Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <div className="h-5 w-5 bg-gradient-to-b from-slate-100 to-slate-200 rounded flex items-center justify-center border border-slate-200">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">expand_more</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Priority Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="priority" className="text-sm font-medium text-slate-700">
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-select block w-full appearance-none rounded-lg border-slate-200 bg-slate-50/50 p-3 pr-10 text-sm text-slate-900 focus:border-primary focus:ring-primary/20"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <div className="h-5 w-5 bg-gradient-to-b from-slate-100 to-slate-200 rounded flex items-center justify-center border border-slate-200">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">expand_more</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
              onClick={() => navigate('/home')}>
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              Edit Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditIncident;
