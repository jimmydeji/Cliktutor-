import React, { useState, useEffect } from 'react';
import { PaymentRequest, StudentProfile } from '../types';
import { getAllPaymentRequests, updatePaymentRequestStatus, generateAndSaveActivationCode, getAllUsers, deleteUser, updateUserStatus } from '../services/storage';
import { Check, X, Loader, Trash2, UserX, UserCheck } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

export const AdminPanel: React.FC = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [users, setUsers] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'payments' | 'users'>('payments');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadRequests(), loadUsers()]);
    setLoading(false);
  };

  const loadRequests = async () => {
    const data = await getAllPaymentRequests();
    setRequests(data);
  };

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  const handleConfirm = async (request: PaymentRequest) => {
    if (!request.id) return;
    setProcessingId(request.id);
    try {
      const code = await generateAndSaveActivationCode();
      await updatePaymentRequestStatus(request.id, 'confirmed');
      await setDoc(doc(db, 'studentProfile', request.userId), { isPremium: true }, { merge: true });
      alert(`Payment confirmed! ${request.studentName} now has full access.`);
      loadData();
    } catch (e) {
      console.error('Failed to confirm payment', e);
      alert('Failed to confirm payment.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (e) {
      alert('Failed to delete user.');
    }
  };

  const handleToggleActivation = async (user: StudentProfile) => {
    try {
      await updateUserStatus(user.id, { isPremium: !user.isPremium });
      loadUsers();
    } catch (e) {
      alert('Failed to update user status.');
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex space-x-4 mb-4">
        <button className={`font-bold ${activeTab === 'payments' ? 'text-emerald-600' : 'text-slate-500'}`} onClick={() => setActiveTab('payments')}>Payment Requests</button>
        <button className={`font-bold ${activeTab === 'users' ? 'text-emerald-600' : 'text-slate-500'}`} onClick={() => setActiveTab('users')}>User Management</button>
      </div>

      {activeTab === 'payments' && (
        <>
          <h2 className="text-xl font-bold mb-4">Payment Requests</h2>
          {requests.length === 0 ? <p>No requests.</p> : (
            <div className="space-y-3">
              {requests.map((req, index) => {
                const isConfirmed = req.status === 'confirmed';
                return (
                  <div key={`${req.id}-${index}`} className="p-4 border rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold">{req.studentName} - ₦{req.amount}</p>
                      <p className="text-xs text-slate-500">{req.tier} | {req.phoneNumber} | Status: {req.status}</p>
                    </div>
                    <button
                      onClick={() => handleConfirm(req)}
                      disabled={!!processingId}
                      className={`px-4 py-2 rounded-lg font-bold text-sm cursor-pointer ${isConfirmed ? 'bg-emerald-800 text-white' : 'bg-emerald-600 text-white'}`}
                    >
                      {processingId === req.id ? <Loader className="animate-spin w-4 h-4" /> : (isConfirmed ? 'Confirmed & Active' : 'Confirm')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'users' && (
        <>
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="p-4 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email} | {user.isPremium ? 'Premium' : 'Free'}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleToggleActivation(user)} className="p-2 bg-slate-100 rounded-lg">
                    {user.isPremium ? <UserX className="w-4 h-4 text-rose-500" /> : <UserCheck className="w-4 h-4 text-emerald-500" />}
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="p-2 bg-rose-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
