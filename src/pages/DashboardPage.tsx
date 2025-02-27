import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      switch (currentUser.userType) {
        case 'normal':
          navigate('/payment');
          break;
        case 'bank_admin':
          navigate('/fraud-flags');
          break;
        case 'project_admin':
          navigate('/transactions');
          break;
        default:
          break;
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default DashboardPage;