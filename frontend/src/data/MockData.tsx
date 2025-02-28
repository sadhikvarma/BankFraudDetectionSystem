import { User, Bank, Transaction, FraudFlag } from '../types';
import { format } from 'date-fns';

// Banks
export const banks: Bank[] = [
  { id: 1, code: '001', name: 'HDFC Bank' },
  { id: 2, code: '002', name: 'ICICI Bank' },
  { id: 3, code: '003', name: 'State Bank of India' },
  { id: 4, code: '004', name: 'Axis Bank' },
  { id: 5, code: '005', name: 'Canara Bank' },
];

// Users
export const users: User[] = [
  // Normal users (10)
  { id: 1, username: 'user1', password: 'password1', accountId: '1001', bankCode: '001', userType: 'normal' },
  { id: 2, username: 'user2', password: 'password2', accountId: '1002', bankCode: '001', userType: 'normal' },
  { id: 3, username: 'user3', password: 'password3', accountId: '2001', bankCode: '002', userType: 'normal' },
  { id: 4, username: 'user4', password: 'password4', accountId: '2002', bankCode: '002', userType: 'normal' },
  { id: 5, username: 'user5', password: 'password5', accountId: '3001', bankCode: '003', userType: 'normal' },
  { id: 6, username: 'user6', password: 'password6', accountId: '3002', bankCode: '003', userType: 'normal' },
  { id: 7, username: 'user7', password: 'password7', accountId: '4001', bankCode: '004', userType: 'normal' },
  { id: 8, username: 'user8', password: 'password8', accountId: '4002', bankCode: '004', userType: 'normal' },
  { id: 9, username: 'user9', password: 'password9', accountId: '5001', bankCode: '005', userType: 'normal' },
  { id: 10, username: 'user10', password: 'password10', accountId: '5002', bankCode: '005', userType: 'normal' },
  
  // Bank admins (5)
  { id: 11, username: 'hdfc_admin', password: 'hdfc123', accountId: null, bankCode: '001', userType: 'bank_admin' },
  { id: 12, username: 'icici_admin', password: 'icici123', accountId: null, bankCode: '002', userType: 'bank_admin' },
  { id: 13, username: 'sbi_admin', password: 'sbi123', accountId: null, bankCode: '003', userType: 'bank_admin' },
  { id: 14, username: 'axis_admin', password: 'axis123', accountId: null, bankCode: '004', userType: 'bank_admin' },
  { id: 15, username: 'canara_admin', password: 'canara123', accountId: null, bankCode: '005', userType: 'bank_admin' },
  
  // Project admin (1)
  { id: 16, username: 'admin', password: 'admin123', accountId: null, bankCode: null, userType: 'project_admin' },
];

// Generate some mock transactions
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const normalUsers = users.filter(user => user.userType === 'normal');
  
  // Generate 50 random transactions
  for (let i = 1; i <= 50; i++) {
    const sender = normalUsers[Math.floor(Math.random() * normalUsers.length)];
    let receiver = normalUsers[Math.floor(Math.random() * normalUsers.length)];
    
    // Make sure sender and receiver are different
    while (sender.id === receiver.id) {
      receiver = normalUsers[Math.floor(Math.random() * normalUsers.length)];
    }
    
    // Random date within the last 7 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    // Random amount between 100 and 10000
    const amount = Math.floor(Math.random() * 9900) + 100;
    
    // 10% chance of being flagged as fraud
    // const isFraud = Math.random() < 0.1;

    const isFraud = fetch("http://localhost:8000/fraud")
  .then((res) => res.json())
  .then((data) => data.isFraud)
  .catch(() => false);

    
    transactions.push({
      id: `TXN${String(i).padStart(6, '0')}`,
      senderBankCode: sender.bankCode!,
      senderId: sender.accountId!,
      receiverBankCode: receiver.bankCode!,
      receiverId: receiver.accountId!,
      timestamp: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
      amount,
      description: `Payment from ${sender.username} to ${receiver.username}`,
      isFraud,
      fraudReason: isFraud ? 
        ['Unusual amount', 'Suspicious pattern', 'Multiple transactions in short time', 'Unknown recipient'][Math.floor(Math.random() * 4)] 
        : null
    });
  }
  
  return transactions;
};

export const transactions: Transaction[] = generateTransactions();

// Generate fraud flags based on transactions
export const fraudFlags: FraudFlag[] = transactions
  .filter(t => t.isFraud)
  .map((t, index) => ({
    id: index + 1,
    accountId: Math.random() > 0.5 ? t.senderId : t.receiverId,
    bankCode: Math.random() > 0.5 ? t.senderBankCode : t.receiverBankCode,
    timestamp: t.timestamp,
    reason: t.fraudReason || 'Suspicious activity',
    transactionId: t.id
  }));

// Function to get bank name from code
export const getBankName = (code: string): string => {
  const bank = banks.find(b => b.code === code);
  return bank ? bank.name : 'Unknown Bank';
};

// Function to get user by account ID and bank code
export const getUserByAccount = (accountId: string, bankCode: string): User | undefined => {
  return users.find(u => u.accountId === accountId && u.bankCode === bankCode);
};

// Function to get transactions for a specific account
export const getTransactionsForAccount = (accountId: string): Transaction[] => {
  return transactions.filter(t => 
    (t.senderId === accountId || t.receiverId === accountId)
  );
};

// Function to get transactions within date range for an account
export const getTransactionsInDateRange = (accountId: string, startDate: Date, endDate: Date): Transaction[] => {
  return transactions.filter(t => {
    const txDate = new Date(t.timestamp);
    return (t.senderId === accountId || t.receiverId === accountId) && 
           txDate >= startDate && 
           txDate <= endDate;
  });
};

// Local storage functions
export const saveTransaction = (transaction: Transaction): void => {
  const storedTransactions = localStorage.getItem('transactions');
  let updatedTransactions: Transaction[] = [];
  
  if (storedTransactions) {
    updatedTransactions = JSON.parse(storedTransactions);
  } else {
    updatedTransactions = [...transactions];
  }
  
  updatedTransactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
};

export const getAllTransactions = (): Transaction[] => {
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    return JSON.parse(storedTransactions);
  }
  
  // Initialize with mock data if not found
  localStorage.setItem('transactions', JSON.stringify(transactions));
  return transactions;
};