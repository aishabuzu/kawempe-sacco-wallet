import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { 
  CreditCard, 
  Plus, 
  Calculator, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingDown
} from "lucide-react";

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const { user } = useAuth();

  // Mock data
  const activeLoans = [
    {
      id: 1,
      type: "Emergency Loan",
      amount: 500000,
      outstanding: 350000,
      interestRate: 12,
      monthlyPayment: 45000,
      nextPayment: "2024-02-05",
      status: "active",
      disbursed: "2023-08-15",
      maturity: "2024-08-15"
    },
    {
      id: 2,
      type: "Business Development",
      amount: 1000000,
      outstanding: 750000,
      interestRate: 15,
      monthlyPayment: 85000,
      nextPayment: "2024-02-08",
      status: "active",
      disbursed: "2023-10-01",
      maturity: "2024-10-01"
    }
  ];

  const loanHistory = [
    {
      id: 3,
      type: "Emergency Loan",
      amount: 200000,
      status: "completed",
      disbursed: "2023-01-15",
      completed: "2023-07-15"
    },
    {
      id: 4,
      type: "Education Loan",
      amount: 300000,
      status: "completed",
      disbursed: "2022-09-01",
      completed: "2023-03-01"
    }
  ];

  const loanProducts = [
    {
      name: "Emergency Loan",
      maxAmount: 500000,
      interestRate: 12,
      maxPeriod: 12,
      description: "Quick access to funds for unexpected expenses",
      requirements: ["Active membership for 6+ months", "Regular savings contributions", "No overdue payments"]
    },
    {
      name: "Business Development",
      maxAmount: 2000000,
      interestRate: 15,
      maxPeriod: 18,
      description: "Support for business expansion and development",
      requirements: ["Active membership for 12+ months", "Business plan required", "Collateral may be required"]
    },
    {
      name: "Education Loan",
      maxAmount: 1000000,
      interestRate: 10,
      maxPeriod: 24,
      description: "Funding for education and skills development",
      requirements: ["Admission letter", "Active membership for 3+ months", "Guarantor required"]
    },
    {
      name: "Housing Loan",
      maxAmount: 5000000,
      interestRate: 18,
      maxPeriod: 36,
      description: "Home purchase or improvement financing",
      requirements: ["Property documents", "Active membership for 18+ months", "Income verification"]
    }
  ];

  const handleLoanApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loanAmount || !loanPurpose || !repaymentPeriod) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(loanAmount) <= 0) {
      toast.error("Please enter a valid loan amount");
      return;
    }

    toast.success("Loan application submitted successfully! You will receive a response within 2-3 business days.");
    setLoanAmount("");
    setLoanPurpose("");
    setRepaymentPeriod("");
  };

  const calculateMonthlyPayment = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  const handleMakePayment = (loanId: number) => {
    toast.success("Payment processed successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Loan Management</h1>
              <p className="text-muted-foreground">Apply for loans and manage repayments</p>
            </div>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Apply for Loan
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Loan Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">UGX 1,100,000</div>
                  <p className="text-xs text-muted-foreground">
                    Across 2 active loans
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">UGX 130,000</div>
                  <p className="text-xs text-muted-foreground">
                    Next payment: Feb 5, 2024
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">850</div>
                  <p className="text-xs text-muted-foreground">
                    Excellent rating
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Active Loans */}
            <Card>
              <CardHeader>
                <CardTitle>Active Loans</CardTitle>
                <CardDescription>Your current loan commitments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeLoans.map((loan) => (
                    <div key={loan.id} className="border border-border rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{loan.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            Disbursed: {loan.disbursed} • Maturity: {loan.maturity}
                          </p>
                        </div>
                        <Badge variant={loan.status === 'active' ? 'default' : 'secondary'}>
                          {loan.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Principal Amount</p>
                          <p className="text-lg font-semibold">UGX {loan.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Outstanding</p>
                          <p className="text-lg font-semibold text-warning">UGX {loan.outstanding.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="text-lg font-semibold">{loan.interestRate}% p.a.</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Payment</p>
                          <p className="text-lg font-semibold">UGX {loan.monthlyPayment.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Repayment Progress</span>
                          <span>{Math.round(((loan.amount - loan.outstanding) / loan.amount) * 100)}%</span>
                        </div>
                        <Progress value={((loan.amount - loan.outstanding) / loan.amount) * 100} className="h-2" />
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMakePayment(loan.id)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Make Payment
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toast.info("Statement will be sent to your email")}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Statement
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Loan Products */}
            <Card>
              <CardHeader>
                <CardTitle>Available Loan Products</CardTitle>
                <CardDescription>Explore our loan options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loanProducts.map((product, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <Badge variant="outline">{product.interestRate}% p.a.</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Max Amount</p>
                          <p className="font-medium">UGX {product.maxAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Period</p>
                          <p className="font-medium">{product.maxPeriod} months</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Requirements:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {product.requirements.map((req, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-success" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => toast.info("Loan application form will open")}
                      >
                        Apply Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apply" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Application</CardTitle>
                  <CardDescription>Apply for a new loan</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLoanApplication} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loanType">Loan Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loanProducts.map((product, index) => (
                            <SelectItem key={index} value={product.name}>
                              {product.name} - {product.interestRate}% p.a.
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Loan Amount (UGX)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="100,000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="period">Repayment Period (Months)</Label>
                      <Select onValueChange={setRepaymentPeriod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          {[6, 12, 18, 24, 36].map((months) => (
                            <SelectItem key={months} value={months.toString()}>
                              {months} months
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose of Loan</Label>
                      <Textarea
                        id="purpose"
                        placeholder="Describe how you plan to use this loan..."
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guarantor">Guarantor Information</Label>
                      <Input
                        id="guarantor"
                        placeholder="Guarantor name and member ID"
                      />
                    </div>

                    <Button type="submit" className="w-full" variant="hero">
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                  <CardDescription>Track your loan applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Business Development Loan</span>
                      <Badge variant="default">
                        <Clock className="w-3 h-3 mr-1" />
                        Under Review
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Application submitted: Jan 25, 2024
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Application Progress</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Required Documents:</h3>
                    <div className="space-y-2">
                      {[
                        { name: "Application Form", status: "completed" },
                        { name: "Business Plan", status: "completed" },
                        { name: "Financial Statements", status: "pending" },
                        { name: "Guarantor Form", status: "pending" }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{doc.name}</span>
                          {doc.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-warning" />
                          )}
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => toast.info("Document upload feature coming soon!")}
                    >
                      Upload Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Calculator</CardTitle>
                <CardDescription>Calculate your monthly payments and total cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="calcAmount">Principal Amount (UGX)</Label>
                      <Input
                        id="calcAmount"
                        type="number"
                        placeholder="500,000"
                        defaultValue="500000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="calcRate">Interest Rate (% per annum)</Label>
                      <Input
                        id="calcRate"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        defaultValue="12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="calcPeriod">Loan Period (Months)</Label>
                      <Input
                        id="calcPeriod"
                        type="number"
                        placeholder="12"
                        defaultValue="12"
                      />
                    </div>

                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => toast.info("Loan calculator updated!")}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                      <h3 className="font-semibold mb-4">Calculation Results</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly Payment:</span>
                          <span className="font-semibold">UGX 44,565</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Interest:</span>
                          <span className="font-semibold">UGX 34,780</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Repayment:</span>
                          <span className="font-semibold text-primary">UGX 534,780</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold mb-3">Loan Summary</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Principal: UGX 500,000</p>
                        <p>• Interest Rate: 12% per annum</p>
                        <p>• Loan Term: 12 months</p>
                        <p>• Processing Fee: UGX 5,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan History</CardTitle>
                <CardDescription>Your past loan records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loanHistory.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">{loan.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {loan.disbursed} - {loan.completed}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">UGX {loan.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">
                          {loan.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Loans;