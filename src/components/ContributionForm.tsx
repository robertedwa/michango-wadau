
import { useState } from 'react';
import { useContributions } from '@/hooks/useContributions';
import StatusMessage from './UI/StatusMessage';
import { Contribution } from '@/types';
import { ArrowRight } from 'lucide-react';

const paymentMethods: Array<{
  id: Contribution['paymentMethod'];
  label: string;
}> = [
  { id: 'M-Pesa', label: 'M-Pesa' },
  { id: 'AirtelMoney', label: 'AirtelMoney' },
  { id: 'TigoPesa', label: 'TigoPesa' }
];

const ContributionForm = () => {
  const { addContribution, isLoading } = useContributions();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Contribution['paymentMethod']>('M-Pesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  
  const reset = () => {
    setName('');
    setAmount('');
    setPhoneNumber('');
    setPaymentMethod('M-Pesa');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    const amountNum = Number(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    const success = await addContribution({
      name: name.trim(),
      amount: amountNum,
      paymentMethod,
      phoneNumber
    });
    
    if (success) {
      reset();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount (TZS)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            placeholder="Enter amount"
            min="0"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="relative">
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="peer absolute opacity-0"
                  disabled={isLoading}
                />
                <label
                  htmlFor={method.id}
                  className="flex items-center justify-center p-2 text-sm border rounded-md cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-muted/50 transition-all"
                >
                  {method.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Recipient Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            placeholder="Enter 10-digit phone number"
            pattern="\d{10}"
            disabled={isLoading}
          />
        </div>
        
        {error && <StatusMessage message={error} type="error" onClose={() => setError('')} />}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Processing Transaction...
            </>
          ) : (
            <>
              Submit Contribution
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContributionForm;
