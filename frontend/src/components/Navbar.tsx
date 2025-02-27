import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <BarChart3 className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Banking Fraud Detection</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {currentUser && (
              <div className="flex items-center">
                <div className="mr-4 flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  <span className="font-medium">
                    {currentUser.username} 
                    <span className="text-xs ml-1 bg-blue-700 px-2 py-1 rounded-full">
                      {currentUser.userType === 'normal' ? 'User' : 
                       currentUser.userType === 'bank_admin' ? 'Bank Admin' : 'Project Admin'}
                    </span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md text-sm flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;