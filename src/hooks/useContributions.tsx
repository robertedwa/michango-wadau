
import { useState, useEffect } from 'react';
import { Contribution } from '@/types';
import { toast } from 'sonner';

export const useContributions = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load contributions from localStorage on mount
  useEffect(() => {
    const savedContributions = localStorage.getItem('contributions');
    if (savedContributions) {
      try {
        setContributions(JSON.parse(savedContributions));
      } catch (error) {
        console.error('Failed to parse saved contributions:', error);
      }
    }
  }, []);
  
  // Save contributions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('contributions', JSON.stringify(contributions));
  }, [contributions]);
  
  const simulateTransaction = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% success rate
        resolve(Math.random() < 0.9);
      }, 2000);
    });
  };
  
  const addContribution = async (contribution: Omit<Contribution, 'id' | 'date' | 'status'>) => {
    setIsLoading(true);
    
    try {
      const success = await simulateTransaction();
      
      const newContribution: Contribution = {
        id: Date.now().toString(),
        ...contribution,
        date: new Date().toLocaleString(),
        status: success ? 'success' : 'failed'
      };
      
      setContributions(prev => [newContribution, ...prev]);
      
      if (success) {
        toast.success('Transaction successful!');
        return true;
      } else {
        toast.error('Transaction failed. Please try again.');
        return false;
      }
    } catch (error) {
      toast.error('An error occurred during the transaction.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTotalAmount = () => {
    return contributions
      .filter(c => c.status === 'success')
      .reduce((sum, c) => sum + c.amount, 0);
  };
  
  const getTotalContributors = () => {
    return new Set(
      contributions
        .filter(c => c.status === 'success')
        .map(c => c.name)
    ).size;
  };
  
  const downloadReport = () => {
    const content = `
      FARAJA APP Contribution Report
      ==============================
      
      Total Contributors: ${getTotalContributors()}
      Total Amount: TZS ${getTotalAmount().toLocaleString()}
      
      Contribution Details:
      --------------------
      ${contributions.map((contribution, index) => `
      Contribution #${index + 1}
      -------------------------
      Name: ${contribution.name}
      Amount: TZS ${contribution.amount.toLocaleString()}
      Payment Method: ${contribution.paymentMethod}
      Phone Number: ${contribution.phoneNumber}
      Date: ${contribution.date}
      Status: ${contribution.status}
      `).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faraja-contributions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Report downloaded successfully!');
  };
  
  return {
    contributions,
    isLoading,
    addContribution,
    getTotalAmount,
    getTotalContributors,
    downloadReport
  };
};
