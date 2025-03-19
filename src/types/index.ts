
export interface Contribution {
  id: string;
  name: string;
  amount: number;
  paymentMethod: 'AirtelMoney' | 'M-Pesa' | 'TigoPesa';
  phoneNumber: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

export type StatusType = 'success' | 'error' | 'info' | 'warning' | null;
