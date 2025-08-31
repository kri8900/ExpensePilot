import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: "arrow-up" | "arrow-down" | "piggy-bank";
  type: "income" | "expense" | "savings";
  isLoading?: boolean;
}

export default function MetricCard({ title, value, change, icon, type, isLoading }: MetricCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const IconComponent = {
    "arrow-up": TrendingUp,
    "arrow-down": TrendingDown,
    "piggy-bank": PiggyBank,
  }[icon];

  const iconBgClass = {
    income: "income-gradient",
    expense: "expense-gradient", 
    savings: "bg-primary",
  }[type];

  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="w-12 h-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in" data-testid={`card-${type}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2" data-testid={`text-${type}-value`}>
              {formatCurrency(value)}
            </p>
            <p className={cn("text-sm mt-1", changeColor)}>
              <TrendingUp className="inline mr-1 h-3 w-3" />
              <span data-testid={`text-${type}-change`}>+{change}%</span> from last month
            </p>
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgClass)}>
            <IconComponent className="text-white h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
