import { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MetricCard from "@/components/dashboard/metric-card";
import ExpenseChart from "@/components/dashboard/expense-chart";
import BudgetOverview from "@/components/dashboard/budget-overview";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import CategoryBreakdown from "@/components/dashboard/category-breakdown";
import QuickActions from "@/components/dashboard/quick-actions";
import MonthlyInsights from "@/components/dashboard/monthly-insights";
import AddTransactionModal from "@/components/modals/add-transaction-modal";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  
  const currentMonth = format(new Date(), "yyyy-MM");

  const { data: summary = {}, isLoading: summaryLoading } = useQuery({
    queryKey: [`/api/dashboard/summary?month=${currentMonth}`],
    staleTime: 0, // Always refetch
    gcTime: 0, // Don't cache
  });

  // Debug logging
  console.log("Dashboard summary data:", summary);
  console.log("Summary loading:", summaryLoading);
  console.log("Query key:", [`/api/dashboard/summary?month=${currentMonth}`]);

  const handleExport = () => {
    window.open(`/api/export/csv`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAddTransaction={() => setIsModalOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar />
        
        <main className="flex-1 bg-background">
          {/* Dashboard Header */}
          <div className="bg-card border-b border-border px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Financial Dashboard</h2>
                <p className="text-muted-foreground mt-1">{format(new Date(), "MMMM yyyy")}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40" data-testid="select-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="secondary" 
                  onClick={handleExport}
                  data-testid="button-export"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Total Income"
                value={(summary as any)?.income || 0}
                change={12.5}
                icon="arrow-up"
                type="income"
                isLoading={summaryLoading}
              />
              <MetricCard
                title="Total Expenses"
                value={(summary as any)?.expenses || 0}
                change={8.2}
                icon="arrow-down"
                type="expense"
                isLoading={summaryLoading}
              />
              <MetricCard
                title="Net Savings"
                value={(summary as any)?.netSavings || 0}
                change={25.8}
                icon="piggy-bank"
                type="savings"
                isLoading={summaryLoading}
              />
            </div>

            {/* Charts and Budget Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ExpenseChart />
              </div>
              <BudgetOverview />
            </div>

            {/* Recent Transactions and Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <RecentTransactions />
              <CategoryBreakdown />
            </div>

            {/* Quick Actions and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <QuickActions onAddTransaction={() => setIsModalOpen(true)} />
              <div className="lg:col-span-2">
                <MonthlyInsights />
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
