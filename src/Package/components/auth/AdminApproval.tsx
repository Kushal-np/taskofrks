import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, FileText, Mail, Calendar } from 'lucide-react';
import { usersDatabase } from './LoginModal';
import type { UserData } from '../../types';

const AdminApprovalPanel: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);

  useEffect(() => {
    // Refresh pending users list
    const interval = setInterval(() => {
      setPendingUsers(usersDatabase.filter(user => !user.approved));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleApprove = (userId: string) => {
    const user = usersDatabase.find(u => u.id === userId);
    if (user) {
      user.approved = true;
      user.kycStatus = 'approved';
      setPendingUsers(usersDatabase.filter(u => !u.approved));
      alert(`User ${user.email} has been approved!`);
    }
  };

  const handleReject = (userId: string) => {
    const user = usersDatabase.find(u => u.id === userId);
    if (user) {
      user.kycStatus = 'rejected';
      const index = usersDatabase.indexOf(user);
      usersDatabase.splice(index, 1);
      setPendingUsers(usersDatabase.filter(u => !u.approved));
      alert(`User ${user.email} has been rejected!`);
    }
  };

  if (pendingUsers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-6 rounded-2xl border border-[#b68938]/20 shadow-2xl max-w-md"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <h3 className="text-white font-bold">Admin Panel</h3>
            <p className="text-sm text-gray-400">No pending approvals</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] p-6 rounded-2xl border border-[#b68938]/20 shadow-2xl max-w-md z-[999]"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent">
          Admin Approval Panel
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {pendingUsers.length} pending {pendingUsers.length === 1 ? 'request' : 'requests'}
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {pendingUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-[#b68938]" />
                  <span className="text-white font-medium text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-xs">
                <Clock className="w-3 h-3" />
                Pending
              </div>
            </div>

            {user.kycDocuments && user.kycDocuments[0] && (
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 bg-black/30 rounded-lg p-2">
                <FileText className="w-4 h-4 text-[#e1ba73]" />
                <span className="truncate">{user.kycDocuments[0].name}</span>
              </div>
            )}

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleApprove(user.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReject(user.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminApprovalPanel;