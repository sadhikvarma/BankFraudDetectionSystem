import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fraudFlags, getBankName } from '../data/MockData';
import { FraudFlag } from '../types';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, Eye } from 'lucide-react';

const FraudFlagsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bankFraudFlags, setBankFraudFlags] = useState<FraudFlag[]>([]);

  useEffect(() => {
    if (currentUser && currentUser.bankCode) {
      // Filter fraud flags for the current bank admin's bank
      const filteredFlags = fraudFlags.filter(flag => flag.bankCode === currentUser.bankCode);
      setBankFraudFlags(filteredFlags);
    }
  }, [currentUser]);

  const handleViewTransactionLog = (accountId: string, timestamp: string) => {
    // Navigate to transaction log page with account ID and timestamp
    navigate(`/transaction-log/${accountId}/${timestamp}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Fraud Flagged Accounts</h1>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">Bank Information</h2>
            <p className="text-gray-700">
              <span className="font-medium">Bank:</span> {getBankName(currentUser?.bankCode || '')}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Bank Code:</span> {currentUser?.bankCode}
            </p>
          </div>
        </div>
        
        {bankFraudFlags.length > 0 ? (
          <div className="space-y-4">
            {bankFraudFlags.map((flag) => (
              <div key={flag.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Fraud Alert: Account {flag.accountId}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Timestamp:</span> {format(parseISO(flag.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {flag.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewTransactionLog(flag.accountId, flag.timestamp)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center whitespace-nowrap"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Transaction Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No fraud flags found</h3>
            <p className="mt-2 text-sm text-gray-500">
              There are currently no accounts flagged for fraud in your bank.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudFlagsPage;