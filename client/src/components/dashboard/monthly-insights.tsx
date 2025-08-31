import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, AlertTriangle, Lightbulb } from "lucide-react";

export default function MonthlyInsights() {
  const insights = [
    {
      type: "success",
      icon: ThumbsUp,
      title: "Great job on savings!",
      description: "You're saving 25% more than last month. Keep up the excellent work!",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "bg-green-500",
      titleColor: "text-green-800 dark:text-green-200",
      descColor: "text-green-600 dark:text-green-300",
    },
    {
      type: "warning", 
      icon: AlertTriangle,
      title: "Watch your food spending",
      description: "You've spent 84% of your food budget. Consider meal planning to save more.",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconColor: "bg-yellow-500",
      titleColor: "text-yellow-800 dark:text-yellow-200",
      descColor: "text-yellow-600 dark:text-yellow-300",
    },
    {
      type: "info",
      icon: Lightbulb,
      title: "Optimize your subscriptions",
      description: "You have 5 active subscriptions totaling $89/month. Review for potential savings.",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "bg-blue-500",
      titleColor: "text-blue-800 dark:text-blue-200",
      descColor: "text-blue-600 dark:text-blue-300",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`flex items-start space-x-3 p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
              data-testid={`insight-${insight.type}`}
            >
              <div className={`w-8 h-8 ${insight.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <insight.icon className="text-white h-4 w-4" />
              </div>
              <div>
                <p className={`text-sm font-medium ${insight.titleColor}`}>
                  {insight.title}
                </p>
                <p className={`text-sm ${insight.descColor} mt-1`}>
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
