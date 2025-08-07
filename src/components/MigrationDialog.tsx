import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { DataMigration } from "@/lib/migration";
import { toast } from "@/components/ui/sonner";

interface MigrationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const MigrationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  
  const [steps, setSteps] = useState<MigrationStep[]>([
    {
      id: 'user',
      name: 'User Profile',
      description: 'Migrate user account and profile information',
      status: 'pending'
    },
    {
      id: 'savings',
      name: 'Savings Accounts',
      description: 'Migrate savings accounts and balances',
      status: 'pending'
    },
    {
      id: 'loans',
      name: 'Loan Records',
      description: 'Migrate loan applications and repayment data',
      status: 'pending'
    },
    {
      id: 'transactions',
      name: 'Transaction History',
      description: 'Migrate all transaction records',
      status: 'pending'
    },
    {
      id: 'goals',
      name: 'Savings Goals',
      description: 'Migrate savings goals and targets',
      status: 'pending'
    }
  ]);

  const updateStepStatus = (stepIndex: number, status: MigrationStep['status']) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const runMigration = async () => {
    if (!isSupabaseConfigured()) {
      setErrors(['Supabase is not configured. Please set up your Supabase credentials first.'])
      toast.error("Supabase not configured")
      return
    }
    
    setIsRunning(true);
    setProgress(0);
    setCurrentStep(0);
    setErrors([]);

    // Reset all steps to pending
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));

    try {
      const migration = new DataMigration();
      const mockData = DataMigration.getMockData();

      // Step 1: Migrate User
      setCurrentStep(0);
      updateStepStatus(0, 'running');
      setProgress(10);

      const userSuccess = await migration.migrateUser(mockData.user);
      if (!userSuccess) {
        updateStepStatus(0, 'failed');
        setErrors(prev => [...prev, 'Failed to migrate user data']);
        return;
      }
      updateStepStatus(0, 'completed');
      setProgress(25);

      // Step 2: Migrate Savings Accounts
      setCurrentStep(1);
      updateStepStatus(1, 'running');
      
      const savingsSuccess = await migration.migrateSavingsAccounts(mockData.savingsAccounts);
      if (!savingsSuccess) {
        updateStepStatus(1, 'failed');
        setErrors(prev => [...prev, 'Failed to migrate savings accounts']);
      } else {
        updateStepStatus(1, 'completed');
      }
      setProgress(40);

      // Step 3: Migrate Loans
      setCurrentStep(2);
      updateStepStatus(2, 'running');
      
      const loansSuccess = await migration.migrateLoans(mockData.loans);
      if (!loansSuccess) {
        updateStepStatus(2, 'failed');
        setErrors(prev => [...prev, 'Failed to migrate loans']);
      } else {
        updateStepStatus(2, 'completed');
      }
      setProgress(60);

      // Step 4: Migrate Transactions
      setCurrentStep(3);
      updateStepStatus(3, 'running');
      
      const transactionsSuccess = await migration.migrateTransactions(mockData.transactions);
      if (!transactionsSuccess) {
        updateStepStatus(3, 'failed');
        setErrors(prev => [...prev, 'Failed to migrate transactions']);
      } else {
        updateStepStatus(3, 'completed');
      }
      setProgress(80);

      // Step 5: Migrate Savings Goals
      setCurrentStep(4);
      updateStepStatus(4, 'running');
      
      const goalsSuccess = await migration.migrateSavingsGoals(mockData.savingsGoals);
      if (!goalsSuccess) {
        updateStepStatus(4, 'failed');
        setErrors(prev => [...prev, 'Failed to migrate savings goals']);
      } else {
        updateStepStatus(4, 'completed');
      }
      setProgress(100);

      if (errors.length === 0) {
        toast.success("Migration completed successfully!");
      } else {
        toast.error(`Migration completed with ${errors.length} errors`);
      }

    } catch (error) {
      console.error('Migration error:', error);
      setErrors(prev => [...prev, 'Unexpected error during migration']);
      toast.error("Migration failed");
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: MigrationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: MigrationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'running':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!isSupabaseConfigured()}>
          <Database className="w-4 h-4 mr-2" />
          {isSupabaseConfigured() ? 'Migrate to Supabase' : 'Supabase Not Configured'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Migration to Supabase
          </DialogTitle>
          <DialogDescription>
            Migrate your local data to Supabase database for persistent storage and synchronization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Migration Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Migration Progress</CardTitle>
              <CardDescription>
                {isRunning ? `Step ${currentStep + 1} of ${steps.length}` : 'Ready to start migration'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Migration Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      <div>
                        <p className="font-medium text-sm">{step.name}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(step.status)} className="text-xs">
                      {step.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Migration Errors:</p>
                  <ul className="list-disc list-inside text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Migration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isSupabaseConfigured() ? 'What will be migrated?' : 'Setup Required'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isSupabaseConfigured() ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Supabase configuration required:</p>
                      <ol className="list-decimal list-inside text-sm space-y-1">
                        <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></li>
                        <li>Copy your project URL and anon key</li>
                        <li>Add them to your .env file</li>
                        <li>Run the database migrations</li>
                      </ol>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">User Data:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Profile information</li>
                    <li>Contact details</li>
                    <li>Member ID</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Financial Data:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Savings accounts</li>
                    <li>Loan records</li>
                    <li>Transaction history</li>
                    <li>Savings goals</li>
                  </ul>
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isRunning}>
              Cancel
            </Button>
            <Button onClick={runMigration} disabled={isRunning || !isSupabaseConfigured()} variant="hero">
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {isSupabaseConfigured() ? 'Start Migration' : 'Setup Required'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MigrationDialog;