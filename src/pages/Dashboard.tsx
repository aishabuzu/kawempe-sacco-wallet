import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MigrationDialog from "@/components/MigrationDialog";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Users,
  Activity,
  Clock
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { user, savingsAccounts, loans, transactions, loading, error } = useSupabaseData();

  // Mock data - replace with real data when Supabase is connected
  const savingsData = [
    { month: 'Jan', amount: 500000 },
    { month: 'Feb', amount: 750000 },
    { month: 'Mar', amount: 1000000 },
    { month: 'Apr', amount: 1250000 },
    { month: 'May', amount: 1500000 },
    { month: 'Jun', amount: 1800000 },
  ];

  const transactionData = [
    { month: 'Jan', deposits: 8, withdrawals: 2 },
    { month: 'Feb', deposits: 12, withdrawals: 3 },
    { month: 'Mar', deposits: 10, withdrawals: 1 },
    { month: 'Apr', deposits: 15, withdrawals: 4 },
    { month: 'May', deposits: 11, withdrawals: 2 },
    { month: 'Jun', deposits: 18, withdrawals: 3 },
  ];

  const recentTransactions = [
    { id: 1, type: 'deposit', amount: 50000, description: 'Monthly Savings Contribution', date: '2024-01-28', status: 'completed' },
    { id: 2, type: 'loan', amount: -200000, description: 'Emergency Loan Disbursement', date: '2024-01-25', status: 'completed' },
    { id: 3, type: 'deposit', amount: 25000, description: 'Additional Savings', date: '2024-01-22', status: 'completed' },
    { id: 4, type: 'payment', amount: -15000, description: 'Loan Interest Payment', date: '2024-01-20', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, John!</h1>
              <p className="text-muted-foreground">Here's your financial overview</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Transaction
              </Button>
              <MigrationDialog />
              <Button variant="hero">
                <CreditCard className="w-4 h-4 mr-2" />
                Apply for Loan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Show loading or error states */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading your data...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">Error loading data: {error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                UGX {savingsAccounts.reduce((total, account) => total + account.balance, 0).toLocaleString() || '1,800,000'}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                UGX {loans.reduce((total, loan) => total + loan.outstanding, 0).toLocaleString() || '500,000'}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">-8.2%</span> remaining balance
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">UGX 125,000</div>
              <p className="text-xs text-muted-foreground">
                7% annual return rate
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">850</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">Excellent</span> rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Savings Growth</CardTitle>
              <CardDescription>Your savings accumulation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Amount']} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Activity</CardTitle>
              <CardDescription>Monthly deposits vs withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deposits" fill="hsl(var(--success))" name="Deposits" />
                  <Bar dataKey="withdrawals" fill="hsl(var(--warning))" name="Withdrawals" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                {(transactions.length > 0 ? transactions.slice(0, 4) : recentTransactions).map((transaction) => (
                <CardDescription>Your latest financial activities</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
                        (transaction.type === 'deposit' || transaction.amount > 0) ? 'bg-success/10' :
                        (transaction.type === 'withdrawal' || transaction.type === 'payment') ? 'bg-warning/10' : 'bg-primary/10'
          <CardContent>
                        {(transaction.type === 'deposit' || transaction.amount > 0) ? (
              {recentTransactions.map((transaction) => (
                        ) : (transaction.type === 'withdrawal' || transaction.type === 'payment') ? (
                          <ArrowUpRight className={`w-5 h-5 text-warning`} />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          <CreditCard className={`w-5 h-5 text-primary`} />
                      transaction.type === 'loan' ? 'bg-primary/10' : 'bg-warning/10'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownRight className={`w-5 h-5 text-success`} />
                      ) : transaction.type === 'loan' ? (
                        <CreditCard className={`w-5 h-5 text-primary`} />
                          {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : transaction.date}
                        <ArrowUpRight className={`w-5 h-5 text-warning`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                        (transaction.amount || 0) > 0 ? 'text-success' : 'text-warning'
                        <Clock className="w-3 h-3" />
                        {(transaction.amount || 0) > 0 ? '+' : ''}UGX {Math.abs(transaction.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-success' : 'text-warning'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}UGX {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;