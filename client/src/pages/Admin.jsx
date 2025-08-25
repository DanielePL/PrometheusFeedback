import React from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  const { isLoggedIn, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-prometheus flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-prometheus-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Lade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-prometheus">
      <div className="max-w-md mx-auto px-4 py-8">
        {isLoggedIn ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </div>
  );
};

export default Admin;
