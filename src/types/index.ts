export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  role: 'user' | 'admin' | 'subadmin';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  description: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  active: boolean;
  serviceCharge: number;
  discount: number;
}

export interface AdminRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: 'card';
  cardBrand: string;
  cardLast4: string;
  cardExpMonth: number;
  cardExpYear: number;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  paymentMethodId: string;
  stripePaymentIntentId: string;
  description: string;
  errorMessage?: string;
  createdAt: string;
}

export interface StripeConfig {
  publishableKey: string;
  testMode: boolean;
}
