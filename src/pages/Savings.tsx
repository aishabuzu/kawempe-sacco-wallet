import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PiggyBank, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Target,
  ArrowUpRight,
  DollarSign,
  Clock
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { toast } from "@/components/ui/sonner";

const Savings = () => {
  const [contributionAmount, setContributionAmount] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const { user } = useAuth();

  // Mock data
  const savingsAccounts = [
    {
      id: 1,
      name: "Regular Savings",
      balance: 1200000,
      interestRate: 7,
      type: "regular",
      monthlyContribution: 50000,
      lastContribution: "2024-01-25"
    },
    {
      id: 2,
      name: "Emergency Fund",
      balance: 600000,
      interestRate: 5,
      type: "emergency",
      monthlyContribution: 25000,
      lastContribution: "2024-01-20"
    },
    {
      id: 3,
      name: "Business Development",
      balance: 800000,
      interestRate: 8,
      type: "business",
      monthlyContribution: 75000,
      lastContribution: "2024-01-28"
    }
  ];

  const savingsGoals = [
    { name: "Emergency Fund", current: 600000, target: 1000000, color: "#22c55e" },
    { name: "Business Capital", current: 800000, target: 1500000, color: "#3b82f6" },
    { name: "Home Purchase", current: 400000, target: 2000000, color: "#f59e0b" },
  ];

  const contributionHistory = [
    { month: 'Jul', amount: 120000 },
    { month: 'Aug', amount: 135000 },
    { month: 'Sep', amount: 150000 },
    { month: 'Oct', amount: 145000 },
    { month: 'Nov', amount: 160000 },
    { month: 'Dec', amount: 175000 },
    { month: 'Jan', amount: 180000 },
  ];

  const handleContribution = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }

    // Simulate contribution processing
    toast.success(`Contribution of UGX ${parseFloat(contributionAmount).toLocaleString()} processed successfully!`);
    setContributionAmount("");
  };

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!savingsGoal || parseFloat(savingsGoal) <= 0) {
      toast.error("Please enter a valid goal amount");
      return;
    }

    toast.success("Savings goal created successfully!");
    setSavingsGoal("");
  };

  const handleQuickContribution = (amount: number) => {
    setContributionAmount(amount.toString());
    toast.info(`Quick amount selected: UGX ${amount.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Savings Management</h1>
              <p className="text-muted-foreground">Track and grow your savings with SACCO</p>
            </div>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              New Contribution
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contribute">Contribute</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Savings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">UGX 2,600,000</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">+15.2%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Interest</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">UGX 15,600</div>
                  <p className="text-xs text-muted-foreground">
                    7.2% average rate
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">67%</span> average progress
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Savings Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Your Savings Accounts</CardTitle>
                <CardDescription>Manage your different savings accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savingsAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <PiggyBank className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {account.interestRate}% annual interest • Last contribution: {account.lastContribution}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary">
                          UGX {account.balance.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          UGX {account.monthlyContribution.toLocaleString()}/month
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Savings Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Contribution History</CardTitle>
                <CardDescription>Your monthly savings contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={contributionHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Contribution']} />
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
          </TabsContent>

          <TabsContent value="contribute" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Make a Contribution</CardTitle>
                  <CardDescription>Add money to your savings account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContribution} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="account">Select Account</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose savings account" />
                        </SelectTrigger>
                        <SelectContent>
                          {savingsAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.name} - UGX {account.balance.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (UGX)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="50,000"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile">Mobile Money</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash Deposit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" variant="hero">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Make Contribution
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common contribution amounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[10000, 25000, 50000, 100000].map((amount) => (
                    <Button 
                      key={amount}
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleQuickContribution(amount)}
                    >
                      <span>UGX {amount.toLocaleString()}</span>
                      <DollarSign className="w-4 h-4" />
                    </Button>
                  ))}
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-sm mb-2">Auto-Save Feature</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Set up automatic monthly contributions to reach your goals faster
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => toast.info("Auto-save feature coming soon!")}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Setup Auto-Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Goals</CardTitle>
                  <CardDescription>Track your progress towards financial targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={savingsGoals}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="current"
                      >
                        {savingsGoals.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-3 mt-4">
                    {savingsGoals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: goal.color }}
                          ></div>
                          <span className="text-sm font-medium">{goal.name}</span>
                        </div>
                        <Badge variant="secondary">
                          {Math.round((goal.current / goal.target) * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Set New Goal</CardTitle>
                  <CardDescription>Create a new savings target</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSetGoal} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goalName">Goal Name</Label>
                      <Input
                        id="goalName"
                        placeholder="e.g., House Down Payment"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetAmount">Target Amount (UGX)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        placeholder="1,000,000"
                        value={savingsGoal}
                        onChange={(e) => setSavingsGoal(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Target Date</Label>
                      <Input
                        id="deadline"
                        type="date"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency Fund</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="housing">Housing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" variant="hero">
                      <Target className="w-4 h-4 mr-2" />
                      Create Goal
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contribution History</CardTitle>
                <CardDescription>View all your past savings contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filter controls */}
                  <div className="flex gap-4">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {savingsAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.name}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 3 months</SelectItem>
                        <SelectItem value="1year">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transaction history */}
                  <div className="space-y-3">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">Monthly Contribution</p>
                            <p className="text-sm text-muted-foreground">Regular Savings Account</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">+UGX 50,000</p>
                          <p className="text-sm text-muted-foreground">Jan {25 - i}, 2024</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Savings;