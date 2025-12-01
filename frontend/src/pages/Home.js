import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const StatusBadge = ({ status }) => {
  const styles = {
    'Open': 'bg-orange-100 text-orange-700',
    'In_Progress': 'bg-blue-100 text-blue-700',
    'Resolved': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
};


const PriorityBadge = ({ priority }) => {
  const styles = {
    'High': 'bg-red-100 text-red-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'Low': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[priority] || 'bg-slate-100 text-slate-700'}`}>
      {priority}
    </span>
  );
};


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
      const response = await api.get('/incidents/', { params });
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  useEffect(() => {
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

    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-display">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Incident Tracker Dashboard</h1>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer text-sm font-medium shadow-sm hover:border-slate-300 transition-colors"
             value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Filter by Status: All</option>
              <option value="Open">Open</option>
              <option value="In_Progress">In_Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <span className="material-symbols-outlined text-xl">expand_more</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New Incident
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider w-1/3">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 text-sm font-medium text-slate-900">{incident.title}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{incident.description}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-6 py-5">
                      <PriorityBadge priority={incident.priority} />
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" 
                            onClick={() => navigate(`/edit/${incident.id}`)}>
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                Edit
                            </button>
                             <button className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                              onClick={() => handleDelete(incident.id)}>
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                Delete
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-sm text-slate-500">
                Showing Page {currentPage}
            </p>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all disabled:opacity-50 bg-white"
                 onClick={handlePrevPage} disabled={currentPage === 1}>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    Prev
                </button>
                 <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all bg-white" 
                 onClick={handleNextPage} disabled={incidents.length < pageSize}>
                    Next
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Home;