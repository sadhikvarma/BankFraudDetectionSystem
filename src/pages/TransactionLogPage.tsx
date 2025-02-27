import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionsInDateRange, getBankName } from '../data/MockData';
import { Transaction } from '../types';
import { format, parseISO, subDays } from 'date-fns';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const TransactionLogPage: React.FC = () => {
  const { accountId, timestamp } = useParams<{ accountId: string; timestamp: string }>();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (accountId && timestamp) {
      const flagDate = new Date(timestamp);
      const startDate = subDays(flagDate, 3); // 3 days before the flag
      
      // Get transactions for this account within the date range
      const accountTransactions = getTransactionsInDateRange(
        accountId,
        startDate,
        flagDate
      );
      
      setTransactions(accountTransactions);
    }
  }, [accountId, timestamp]);

  const goBack = () => {
    navigate(-1);
  };

  if (!accountId || !timestamp) {
    return <div>Invalid parameters</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={goBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Transaction Log</h1>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">Account Information</h2>
            <p className="text-gray-700">
              <span className="font-medium">Account ID:</span> {accountId}
            </p>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-gray-600 mr-2" />
              <p className="text-sm text-gray-600">
                Showing transactions from {format(subDays(new Date(timestamp), 3), 'MMM dd, yyyy')} to {format(new Date(timestamp), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
        
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Other Party
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const isSender = transaction.senderId === accountId;
                  const otherPartyId = isSender ? transaction.receiverId : transaction.senderId;
                  const otherPartyBankCode = isSender ? transaction.receiverBankCode : transaction.senderBankCode;
                  
                  return (
                    <tr key={transaction.id} className={transaction.isFraud ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(parseISO(transaction.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isSender ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Sent
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Received
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{otherPartyId}</div>
                        <div className="text-xs text-gray-400">{getBankName(otherPartyBankCode)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ₹{transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.isFraud ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Fraud
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
            <p className="mt-2 text-sm text-gray-500">
              There are no transactions for this account in the specified time period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLogPage;