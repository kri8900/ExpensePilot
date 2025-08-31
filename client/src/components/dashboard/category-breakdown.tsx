import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { PieChart } from "lucide-react";

Chart.register(...registerables);

export default function CategoryBreakdown() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    if (!chartRef.current || !transactions || !categories) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Calculate category totals for expenses only
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = categories.map(category => {
      const total = expenseTransactions
        .filter(t => t.categoryId === category.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return {
        name: category.name,
        total,
        color: category.color,
      };
    }).filter(cat => cat.total > 0);

    const totalExpenses = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

    if (totalExpenses === 0) return;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryTotals.map(cat => cat.name),
        datasets: [{
          data: categoryTotals.map(cat => cat.total),
          backgroundColor: categoryTotals.map(cat => cat.color),
          borderWidth: 2,
          borderColor: '#ffffff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions, categories]);

  const calculateCategoryBreakdown = () => {
    if (!transactions || !categories) return [];

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (totalExpenses === 0) return [];

    return categories.map(category => {
      const total = expenseTransactions
        .filter(t => t.categoryId === category.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const percentage = (total / totalExpenses) * 100;
      
      return {
        name: category.name,
        color: category.color,
        percentage: Math.round(percentage),
      };
    }).filter(cat => cat.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);
  };

  const categoryBreakdown = calculateCategoryBreakdown();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Expense Categories</CardTitle>
          <Select defaultValue="this-month">
            <SelectTrigger className="w-32" data-testid="select-category-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 mb-6 relative">
          {transactions && categories && categoryBreakdown.length > 0 ? (
            <canvas ref={chartRef} data-testid="chart-category-breakdown" />
          ) : (
            <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No expense data available</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {categoryBreakdown.map((category) => (
            <div 
              key={category.name}
              className="flex items-center justify-between"
              data-testid={`category-item-${category.name.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-foreground">{category.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {category.percentage}%
              </span>
            </div>
          ))}
          {categoryBreakdown.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">No expense categories to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
