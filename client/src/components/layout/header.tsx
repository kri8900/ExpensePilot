import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, User } from "lucide-react";

interface HeaderProps {
  onAddTransaction: () => void;
}

export default function Header({ onAddTransaction }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="text-primary-foreground h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-foreground">MoneyTracker Pro</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-primary font-medium">Dashboard</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Transactions</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Budgets</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Reports</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onAddTransaction}
              data-testid="button-add-transaction"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
