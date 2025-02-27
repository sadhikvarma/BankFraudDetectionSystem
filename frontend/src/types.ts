export interface User {
    id: number;
    username: string;
    password: string;
    accountId: string | null;
    bankCode: string | null;
    userType: 'normal' | 'bank_admin' | 'project_admin';
  }
  
  export interface Bank {
    id: number;
    code: string;
    name: string;
  }
  
  export interface Transaction {
    id: string;
    senderBankCode: string;
    senderId: string;
    receiverBankCode: string;
    receiverId: string;
    timestamp: string;
    amount: number;
    description: string;
    isFraud: boolean;
    fraudReason: string | null;
  }
  
  export interface FraudFlag {
    id: number;
    accountId: string;
    bankCode: string;
    timestamp: string;
    reason: string;
    transactionId: string;
  }