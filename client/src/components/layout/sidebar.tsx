import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Download, 
  ArrowLeftRight, 
  PieChart, 
  PiggyBank, 
  Settings, 
  Target, 
  TrendingUp 
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", icon: TrendingUp, active: true },
      { name: "Transactions", icon: ArrowLeftRight, active: false },
    ]
  },
  {
    title: "Planning",
    items: [
      { name: "Budgets", icon: Target, active: false },
      { name: "Goals", icon: PiggyBank, active: false },
    ]
  },
  {
    title: "Analysis", 
    items: [
      { name: "Reports", icon: BarChart3, active: false },
      { name: "Analytics", icon: PieChart, active: false },
    ]
  },
  {
    title: "Tools",
    items: [
      { name: "Export Data", icon: Download, active: false },
      { name: "Settings", icon: Settings, active: false },
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border">
      <div className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item, itemIndex) => (
              <a
                key={itemIndex}
                href="#"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </a>
            ))}
            {sectionIndex < menuItems.length - 1 && <div className="pt-4" />}
          </div>
        ))}
      </div>
    </aside>
  );
}
