
import React, { useEffect, useState } from 'react';
import { Search, UserPlus, MoreHorizontal, Shield } from 'lucide-react';
import { UserService } from '../services/userService';
import { User } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student & Staff Directory</h2>
          <p className="text-slate-500 text-sm">Manage user access, roles, and view student history</p>
        </div>
        <button className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-100 rounded-lg text-sm"
            />
          </div>
          <select className="px-4 py-2 bg-slate-50 border-slate-100 rounded-lg text-sm font-medium">
            <option>All Batches</option>
            <option>2020</option>
            <option>2021</option>
            <option>2022</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Batch/ID</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">No users found.</td></tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.uid || i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{user.batch || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{user.gender}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-slate-500">
                        {user.designation !== 'Student' ? <Shield size={14} className="text-indigo-500" /> : null}
                        <span className="text-sm font-medium">{user.designation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </button>
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

export default UserManagement;
