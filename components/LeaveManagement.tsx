
import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { LeaveService } from '../services/leaveService';
import { MessLeave } from '../types';

const LeaveManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [leaves, setLeaves] = useState<MessLeave[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await LeaveService.getAllLeaves();
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: string) => {
    try {
      await LeaveService.updateLeaveStatus(id, status);
      // Optimistic update
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch (error) {
      console.error("Error updating leave:", error);
      alert("Failed to update status");
    }
  };

  // Normalize status for UI consistency
  const getNormalizedStatus = (status: string | undefined): 'Pending' | 'Approved' | 'Rejected' | string => {
    const s = (status || '').toUpperCase();
    if (s === 'PENDING_APPROVAL' || s === 'PENDING') return 'Pending';
    if (s === 'APPROVED' || s === 'APPROVE') return 'Approved';
    if (s === 'REJECTED' || s === 'REJECT') return 'Rejected';
    return status || 'Pending';
  };

  const filteredLeaves = activeFilter === 'All'
    ? leaves
    : leaves.filter(l => getNormalizedStatus(l.status) === activeFilter);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leave Applications</h2>
          <p className="text-slate-500 text-sm">Manage student mess leave and attendance exemptions</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab as any)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeFilter === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white transition-colors">
            <Filter size={16} />
            <span>Advanced Filters</span>
          </button>
          <button onClick={fetchLeaves} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Calendar size={16} />
            <span>Refresh List</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Date / Meal</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Exception?</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading leave requests...</td></tr>
              ) : filteredLeaves.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">No leave applications found for this filter.</td></tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {leave.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{leave.userName}</p>
                          <p className="text-xs text-slate-500">{leave.uid?.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">{leave.date}</p>
                      <p className="text-xs text-slate-400 capitalize">{leave.meal}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${leave.type === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {leave.type || 'Regular'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{leave.exceptionCase ? 'Yes' : 'No'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className={leave.status === 'Pending' ? 'text-orange-500' : 'text-slate-400'} />
                        <span className={`text-sm font-medium ${getNormalizedStatus(leave.status) === 'Pending' ? 'text-orange-600' : 'text-slate-600'
                          }`}>
                          {getNormalizedStatus(leave.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {getNormalizedStatus(leave.status) === 'Pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleAction(leave.id, 'APPROVED')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors border border-green-200"
                            title="Approve Request"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(leave.id, 'REJECTED')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors border border-red-200"
                            title="Reject Request"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <span className={`px-2 py-1 rounded text-xs font-bold border ${getNormalizedStatus(leave.status) === 'Approved'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                            {getNormalizedStatus(leave.status)}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
