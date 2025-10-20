import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Target, Home } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, isPositive, icon }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm">{title}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </Card>
  );
}

export function WealthStats() {
  const stats = [
    {
      title: "Total Wealth",
      value: "$2,847,500",
      change: "+12.3%",
      isPositive: true,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: "Monthly Change",
      value: "$+47,200",
      change: "+8.2%",
      isPositive: true,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: "Goals Progress",
      value: "68%",
      change: "+5.1%",
      isPositive: true,
      icon: <Target className="w-4 h-4" />
    },
    {
      title: "Property Value",
      value: "$1,650,000",
      change: "+3.8%",
      isPositive: true,
      icon: <Home className="w-4 h-4" />
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}