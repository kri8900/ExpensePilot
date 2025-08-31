import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { BarChart3 } from "lucide-react";

Chart.register(...registerables);

export default function ExpenseChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  useEffect(() => {
    if (!chartRef.current || !transactions) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Process data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const dailyExpenses = last7Days.map(date => {
      const dayExpenses = transactions
        .filter(t => 
          t.type === 'expense' && 
          new Date(t.date).toDateString() === date.toDateString()
        )
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return dayExpenses;
    });

    const dailyIncome = last7Days.map(date => {
      const dayIncome = transactions
        .filter(t => 
          t.type === 'income' && 
          new Date(t.date).toDateString() === date.toDateString()
        )
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return dayIncome;
    });

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(date => 
          date.toLocaleDateString('en-US', { weekday: 'short' })
        ),
        datasets: [
          {
            label: 'Expenses',
            data: dailyExpenses,
            borderColor: 'hsl(0, 84%, 60%)',
            backgroundColor: 'hsla(0, 84%, 60%, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Income',
            data: dailyIncome,
            borderColor: 'hsl(142, 76%, 36%)',
            backgroundColor: 'hsla(142, 76%, 36%, 0.1)',
            tension: 0.4,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Spending Trends</CardTitle>
          <div className="flex space-x-2">
            <Button variant="default" size="sm" data-testid="button-week-view">
              Week
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-month-view">
              Month
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-year-view">
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          {transactions ? (
            <canvas ref={chartRef} data-testid="chart-spending-trends" />
          ) : (
            <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
