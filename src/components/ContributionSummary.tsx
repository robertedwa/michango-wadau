
import { useContributions } from '@/hooks/useContributions';
import { Download, ChevronsUpDown, Users, Coins } from 'lucide-react';
import { useState } from 'react';
import { Contribution } from '@/types';
import { cn } from '@/lib/utils';

const ContributionSummary = () => {
  const { contributions, getTotalAmount, getTotalContributors, downloadReport } = useContributions();
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  
  const successfulContributions = contributions.filter(c => c.status === 'success');
  
  if (contributions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8 space-y-4 animate-slide-in">
      <h2 className="text-xl font-semibold">Contribution Summary</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Contributors</p>
            <p className="text-2xl font-semibold">{getTotalContributors()}</p>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-semibold">TZS {getTotalAmount().toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <button
        onClick={downloadReport}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      >
        <Download className="h-4 w-4" />
        Download Contribution Report
      </button>
      
      <div className="glass-card rounded-xl overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
        >
          <h3 className="font-medium">Recent Contributions</h3>
          <ChevronsUpDown className={cn(
            "h-4 w-4 transition-transform", 
            isTableExpanded ? "transform rotate-180" : ""
          )} />
        </div>
        
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isTableExpanded ? "max-h-96" : "max-h-0"
        )}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium">Name</th>
                  <th className="text-left p-3 text-sm font-medium">Amount</th>
                  <th className="text-left p-3 text-sm font-medium">Payment</th>
                  <th className="text-left p-3 text-sm font-medium">Phone</th>
                  <th className="text-left p-3 text-sm font-medium">Date</th>
                  <th className="text-left p-3 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((contribution) => (
                  <ContributionRow key={contribution.id} contribution={contribution} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContributionRow = ({ contribution }: { contribution: Contribution }) => {
  return (
    <tr className="border-t border-muted hover:bg-muted/20 transition-colors">
      <td className="p-3 text-sm">{contribution.name}</td>
      <td className="p-3 text-sm">TZS {contribution.amount.toLocaleString()}</td>
      <td className="p-3 text-sm">{contribution.paymentMethod}</td>
      <td className="p-3 text-sm">{contribution.phoneNumber}</td>
      <td className="p-3 text-sm">{contribution.date}</td>
      <td className="p-3 text-sm">
        <span className={cn(
          "inline-flex px-2 py-1 text-xs rounded-full",
          contribution.status === 'success' ? "bg-green-50 text-green-600" : 
          contribution.status === 'pending' ? "bg-yellow-50 text-yellow-600" : 
          "bg-red-50 text-red-600"
        )}>
          {contribution.status}
        </span>
      </td>
    </tr>
  );
};

export default ContributionSummary;
