import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { users, saveTransaction, getBankName } from '../data/MockData';
import { format } from 'date-fns';
import { CreditCard, Send, AlertCircle } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [receiverBankCode, setReceiverBankCode] = useState('');

  useEffect(() => {
    // Generate a unique transaction ID
    const generateTransactionId = () => {
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `TXN${timestamp}${random}`;
    };

    setTransactionId(generateTransactionId());
  }, [success]);

  const handleReceiverIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReceiverId(value);
    
    // Find the bank code for this account ID
    const receiver = users.find(u => u.accountId === value);
    if (receiver) {
      setReceiverBankCode(receiver.bankCode || '');
    } else {
      setReceiverBankCode('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!receiverId || !amount || !description) {
      setError('Please fill in all fields');
      return;
    }

    if (!receiverBankCode) {
      setError('Invalid receiver account ID');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    if (currentUser?.accountId === receiverId) {
      setError('Cannot transfer to your own account');
      return;
    }

    // Create transaction
    const transaction = {
      id: transactionId,
      senderBankCode: currentUser?.bankCode || '',
      senderId: currentUser?.accountId || '',
      receiverBankCode,
      receiverId,
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      amount: parseFloat(amount),
      description,
      isFraud: Math.random() < 0.1, // 10% chance of being flagged as fraud for demo
      fraudReason: Math.random() < 0.1 ? 
        ['Unusual amount', 'Suspicious pattern', 'Multiple transactions in short time', 'Unknown recipient'][Math.floor(Math.random() * 4)] 
        : null
    };

    // Save transaction
    saveTransaction(transaction);
    
    // Reset form
    setReceiverId('');
    setAmount('');
    setDescription('');
    setReceiverBankCode('');
    setSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Make a Payment</h1>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">Your Account Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Account ID</p>
              <p className="font-medium">{currentUser?.accountId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bank</p>
              <p className="font-medium">{getBankName(currentUser?.bankCode || '')}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h2 className="font-semibold text-gray-800">Transaction Details</h2>
            <div className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span className="font-medium">Transaction ID:</span> {transactionId}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Enter the recipient's details and payment amount below.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Transaction completed successfully! A new transaction ID has been generated for your next payment.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="receiverId">
                Recipient Account ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="receiverId"
                type="text"
                placeholder="Enter recipient account ID"
                value={receiverId}
                onChange={handleReceiverIdChange}
              />
              {receiverBankCode && (
                <p className="mt-1 text-sm text-green-600">
                  Bank: {getBankName(receiverBankCode)}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">₹</span>
                <input
                  className="shadow appearance-none border rounded w-full py-2 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Enter payment description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex items-center justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline flex items-center"
                type="submit"
              >
                <Send className="h-4 w-4 mr-2" />
                Pay Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;