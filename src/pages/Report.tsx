
import { useContributions } from '@/hooks/useContributions';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Download, FileText, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, Users, Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

const Report = () => {
  const { 
    contributions, 
    getTotalAmount, 
    getTotalContributors, 
    downloadReport 
  } = useContributions();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  
  const successfulContributions = contributions.filter(c => c.status === 'success');
  
  const paymentMethodData = [
    { name: 'AirtelMoney', value: 0 },
    { name: 'M-Pesa', value: 0 },
    { name: 'TigoPesa', value: 0 }
  ];
  
  // Calculate payment method distribution
  successfulContributions.forEach(contribution => {
    const method = contribution.paymentMethod;
    const dataItem = paymentMethodData.find(item => item.name === method);
    if (dataItem) {
      dataItem.value += contribution.amount;
    }
  });
  
  // Filter only payment methods with values > 0
  const filteredPaymentData = paymentMethodData.filter(item => item.value > 0);
  
  // Create time-based data (simplified to last 5 contributions)
  const timeData = [...successfulContributions]
    .slice(0, 5)
    .map(c => ({
      name: c.name.split(' ')[0], // Just use first name for brevity
      amount: c.amount
    }))
    .reverse(); // Most recent first
  
  return (
    <div className="min-h-screen w-full py-12 flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-5xl px-4 sm:px-6 space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={downloadReport}
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Contribution Report</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contributed
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                TZS {getTotalAmount().toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From {successfulContributions.length} successful transactions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contributors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getTotalContributors()}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique contributors
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contributions.length ? 
                  Math.round((successfulContributions.length / contributions.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {successfulContributions.length} of {contributions.length} transactions
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex border-b border-border">
          <button
            className={cn(
              "px-4 py-2 font-medium text-sm",
              activeTab === 'overview' ? 
                "border-b-2 border-primary text-primary" : 
                "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab('overview')}
          >
            <div className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              Overview
            </div>
          </button>
          <button
            className={cn(
              "px-4 py-2 font-medium text-sm",
              activeTab === 'details' ? 
                "border-b-2 border-primary text-primary" : 
                "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab('details')}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Transaction Details
            </div>
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Payment Method Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredPaymentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {filteredPaymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`TZS ${value.toLocaleString()}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  Recent Contributions
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`TZS ${value.toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="amount" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'details' && (
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.length > 0 ? (
                      contributions.map((contribution) => (
                        <TableRow key={contribution.id}>
                          <TableCell>{contribution.name}</TableCell>
                          <TableCell>TZS {contribution.amount.toLocaleString()}</TableCell>
                          <TableCell>{contribution.paymentMethod}</TableCell>
                          <TableCell>{contribution.phoneNumber}</TableCell>
                          <TableCell>{contribution.date}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-flex px-2 py-1 text-xs rounded-full",
                              contribution.status === 'success' ? "bg-green-50 text-green-600" : 
                              contribution.status === 'pending' ? "bg-yellow-50 text-yellow-600" : 
                              "bg-red-50 text-red-600"
                            )}>
                              {contribution.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No contributions yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Report;
