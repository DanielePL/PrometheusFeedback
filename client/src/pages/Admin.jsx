import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminLogin, AdminDashboard } from '../components/admin';

const Admin = () => {
  const { isLoggedIn, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isLoggedIn ? <AdminDashboard /> : <AdminLogin />}
    </div>
  );
};

export default Admin;
