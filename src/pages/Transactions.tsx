import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Search, 
  Download, 
  Filter,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from "@/components/ui/sonner";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("30days");
  const { user } = useAuth();

  // Mock transaction data
  const transactions = [
    {
      id: "TXN001",
      type: "deposit",
      category: "savings",
      amount: 75000,
      description: "Monthly Savings Contribution - Regular Account",
      date: "2024-01-28",
      time: "14:30",
      status: "completed",
      reference: "SAV-20240128-001",
      balance: 1875000
    },
    {
      id: "TXN002",
      type: "withdrawal",
      category: "loan",
      amount: -200000,
      description: "Emergency Loan Disbursement",
      date: "2024-01-25",
      time: "10:15",
      status: "completed",
      reference: "LOAN-20240125-002",
      balance: 1800000
    },
    {
      id: "TXN003",
      type: "deposit",
      category: "contribution",
      amount: 50000,
      description: "Share Capital Contribution",
      date: "2024-01-22",
      time: "16:45",
      status: "completed",
      reference: "SHARE-20240122-003",
      balance: 2000000
    },
    {
      id: "TXN004",
      type: "payment",
      category: "loan",
      amount: -25000,
      description: "Loan Interest Payment - Business Loan",
      date: "2024-01-20",
      time: "09:20",
      status: "completed",
      reference: "INT-20240120-004",
      balance: 1950000
    },
    {
      id: "TXN005",
      type: "deposit",
      category: "dividend",
      amount: 15000,
      description: "Annual Dividend Payment",
      date: "2024-01-18",
      time: "11:30",
      status: "completed",
      reference: "DIV-20240118-005",
      balance: 1975000
    },
    {
      id: "TXN006",
      type: "fee",
      category: "service",
      amount: -2500,
      description: "Account Maintenance Fee",
      date: "2024-01-15",
      time: "00:01",
      status: "completed",
      reference: "FEE-20240115-006",
      balance: 1960000
    },
    {
      id: "TXN007",
      type: "deposit",
      category: "savings",
      amount: 100000,
      description: "Additional Savings - Emergency Fund",
      date: "2024-01-12",
      time: "13:45",
      status: "pending",
      reference: "SAV-20240112-007",
      balance: 1962500
    },
    {
      id: "TXN008",
      type: "withdrawal",
      category: "emergency",
      amount: -30000,
      description: "Emergency Withdrawal",
      date: "2024-01-10",
      time: "17:20",
      status: "failed",
      reference: "EMG-20240110-008",
      balance: 1862500
    }
  ];

  // Transaction analytics data
  const monthlyData = [
    { month: 'Aug', income: 125000, expenses: 45000 },
    { month: 'Sep', income: 150000, expenses: 52000 },
    { month: 'Oct', income: 140000, expenses: 38000 },
    { month: 'Nov', income: 165000, expenses: 61000 },
    { month: 'Dec', income: 180000, expenses: 43000 },
    { month: 'Jan', income: 190000, expenses: 57500 },
  ];

  const categoryData = [
    { name: 'Savings', value: 45, amount: 450000, color: '#22c55e' },
    { name: 'Loans', value: 30, amount: 300000, color: '#3b82f6' },
    { name: 'Fees', value: 15, amount: 150000, color: '#f59e0b' },
    { name: 'Dividends', value: 10, amount: 100000, color: '#8b5cf6' },
  ];

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'failed') return <XCircle className="w-5 h-5 text-destructive" />;
    if (status === 'pending') return <AlertCircle className="w-5 h-5 text-warning" />;
    
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-success" />;
      case 'withdrawal':
      case 'payment':
      case 'fee':
        return <ArrowUpRight className="w-5 h-5 text-warning" />;
      default:
        return <DollarSign className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleExportStatement = () => {
    toast.success("Statement exported successfully! Check your downloads folder.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
              <p className="text-muted-foreground">View and analyze your financial transactions</p>
            </div>
            <Button variant="outline" onClick={handleExportStatement}>
              <Download className="w-4 h-4 mr-2" />
              Export Statement
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">24</div>
              <p className="text-xs text-muted-foreground">
                Total transactions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money In</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">UGX 190,000</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+8.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money Out</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">UGX 57,500</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-warning">+12.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">UGX 132,500</div>
              <p className="text-xs text-muted-foreground">
                Positive cash flow
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cash Flow</CardTitle>
              <CardDescription>Income vs expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, '']} />
                  <Bar dataKey="income" fill="hsl(var(--success))" name="Income" />
                  <Bar dataKey="expenses" fill="hsl(var(--warning))" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Categories</CardTitle>
              <CardDescription>Breakdown by transaction type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Detailed transaction history</CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-[200px]"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="fee">Fees</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 3 months</SelectItem>
                    <SelectItem value="1year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {getTransactionIcon(transaction.type, transaction.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {transaction.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {transaction.time}
                        </span>
                        <span className="text-xs font-mono">{transaction.reference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.amount > 0 ? 'text-success' : 'text-warning'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}UGX {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Balance: UGX {transaction.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No transactions found matching your criteria</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;