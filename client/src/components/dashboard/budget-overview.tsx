import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function BudgetOverview() {
  const currentMonth = format(new Date(), "yyyy-MM");
  
  const { data: summary = {} } = useQuery({
    queryKey: ["/api/dashboard/summary", currentMonth],
  });

  const budgetProgress = (summary as any)?.budgetProgress || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetProgress.length > 0 ? (
            budgetProgress.map((budget) => (
              <div key={budget.id} data-testid={`budget-${budget.categoryName.toLowerCase().replace(' ', '-')}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {budget.categoryName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(budget.spent)} / {formatCurrency(parseFloat(budget.amount))}
                  </span>
                </div>
                <Progress 
                  value={Math.min(budget.percentage, 100)} 
                  className="h-2"
                  data-testid={`progress-${budget.categoryName.toLowerCase().replace(' ', '-')}`}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(budget.remaining)} remaining
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No budgets set for this month</p>
              <p className="text-sm text-muted-foreground mt-1">Create budgets to track your spending</p>
            </div>
          )}
        </div>
        
        <Button 
          variant="secondary" 
          className="w-full mt-4"
          data-testid="button-manage-budgets"
        >
          Manage Budgets
        </Button>
      </CardContent>
    </Card>
  );
}
