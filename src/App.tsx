import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import PaymentPage from './pages/PaymentPage';
import TransactionsPage from './pages/TransactionPage.tsx';
import FraudFlagsPage from './pages/FraudFlagsPage';
import TransactionLogPage from './pages/TransactionLogPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="pt-4">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute allowedUserTypes={['normal']}>
                    <PaymentPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute allowedUserTypes={['project_admin']}>
                    <TransactionsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/fraud-flags" 
                element={
                  <ProtectedRoute allowedUserTypes={['bank_admin']}>
                    <FraudFlagsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/transaction-log/:accountId/:timestamp" 
                element={
                  <ProtectedRoute allowedUserTypes={['bank_admin']}>
                    <TransactionLogPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;