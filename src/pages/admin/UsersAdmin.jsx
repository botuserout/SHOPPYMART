import React, { useEffect, useState } from 'react';
import { fetchAllUsersFromDb, updateUserRoleInDb } from '../../services/firebaseService';
import { showToast } from '../../redux/slices/uiSlice';
import { formatDate } from '../../utils/formatters';
import { Users, Shield, UserCheck } from 'lucide-react';

const UsersAdmin = () => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const data = await fetchAllUsersFromDb();
      setUsersList(data);
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    await updateUserRoleInDb(userId, newRole);
    setUsersList(prev => prev.map(u => (u.uid === userId || u.id === userId ? { ...u, role: newRole } : u)));
    showToast({ message: `Role updated to ${newRole}`, type: 'success' });
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Accounts & Roles</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          View registered customer accounts & assign administrator privileges
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Toggle Privilege</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {usersList.map((usr) => (
                <tr key={usr.uid || usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={usr.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="font-bold text-slate-900 dark:text-white">{usr.displayName || 'Customer User'}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">{usr.email}</td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(usr.createdAt)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      usr.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-500/30' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {usr.role || 'customer'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRoleToggle(usr.uid || usr.id, usr.role || 'customer')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white transition-colors"
                    >
                      Set as {usr.role === 'admin' ? 'Customer' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UsersAdmin;
