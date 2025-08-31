import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RecentTransactions() {
  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.icon || 'fas fa-circle';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.color || '#666666';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <a 
            href="#" 
            className="text-sm text-primary hover:underline"
            data-testid="link-view-all-transactions"
          >
            View All
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors"
                data-testid={`transaction-${transaction.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                  >
                    <i className={cn(getCategoryIcon(transaction.categoryId), "text-white text-sm")} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getCategoryName(transaction.categoryId)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-medium",
                    transaction.type === 'income' ? 'text-green-600' : 'text-destructive'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(parseFloat(transaction.amount))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), "MMM dd")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
