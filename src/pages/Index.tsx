
import ContributionForm from '@/components/ContributionForm';
import ContributionSummary from '@/components/ContributionSummary';
import { useContributions } from '@/hooks/useContributions';

const Index = () => {
  const { contributions } = useContributions();
  
  return (
    <div className="min-h-screen w-full py-12 flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-2xl px-4 sm:px-6 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">FARAJA APP</h1>
          <p className="text-muted-foreground">Make your contribution today</p>
        </div>
        
        <div className="glass-card rounded-xl p-6 sm:p-8 shadow-xl shadow-primary/5 border border-primary/10">
          <ContributionForm />
        </div>
        
        {contributions.length > 0 && (
          <div className="glass-card rounded-xl p-6 sm:p-8 shadow-xl shadow-primary/5 border border-primary/10">
            <ContributionSummary />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
