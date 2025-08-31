import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Target, FileText } from "lucide-react";

interface QuickActionsProps {
  onAddTransaction: () => void;
}

export default function QuickActions({ onAddTransaction }: QuickActionsProps) {
  const handleExportReport = () => {
    window.open('/api/export/csv', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            className="w-full" 
            onClick={onAddTransaction}
            data-testid="button-add-income"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Income
          </Button>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onAddTransaction}
            data-testid="button-add-expense"
          >
            <Minus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Button 
            variant="secondary" 
            className="w-full"
            data-testid="button-set-budget"
          >
            <Target className="mr-2 h-4 w-4" />
            Set Budget
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleExportReport}
            data-testid="button-export-report"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
