import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ArrowRight, Target } from "lucide-react";
import { motion } from "motion/react";

interface GoalsSectionCondensedProps {
  onViewMore: () => void;
}

export function GoalsSectionCondensed({ onViewMore }: GoalsSectionCondensedProps) {
  const goals = [
    { 
      name: "Retirement Fund", 
      current: 850000000, 
      target: 1500000000,
      monthlyContribution: 5000000,
      targetMonths: 180,
      category: "Retirement",
      status: "on-track"
    },
    { 
      name: "Children's Education", 
      current: 95000000, 
      target: 200000000,
      monthlyContribution: 2500000,
      targetMonths: 60,
      category: "Education",
      status: "needs-attention"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getInsightText = (goal: typeof goals[0]) => {
    const remaining = goal.target - goal.current;
    const monthsToComplete = Math.ceil(remaining / goal.monthlyContribution);
    const requiredMonthly = remaining / goal.targetMonths;
    
    if (goal.status === "on-track") {
      return `On track! Achievable in ${monthsToComplete} months`;
    } else if (goal.monthlyContribution < requiredMonthly) {
      const shortfall = requiredMonthly - goal.monthlyContribution;
      return `Increase by ${formatCurrency(shortfall)}/mo to stay on track`;
    }
    return "Review needed";
  };

  return (
    <Card className="p-5 md:p-6 bg-gradient-to-br from-card via-card to-accent-50/20 border border-border/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-primary-700">Financial Goals</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewMore} 
          className="text-xs group hover:bg-primary-50 transition-all duration-300"
        >
          View All
          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          const insight = getInsightText(goal);
          
          return (
            <motion.div 
              key={goal.name} 
              className={`p-3 rounded-lg border transition-all duration-300 ${
                goal.status === "on-track"
                  ? "bg-gradient-to-r from-success/5 to-transparent border-success/20"
                  : "bg-gradient-to-r from-warning/5 to-transparent border-warning/20"
              } hover:shadow-md`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm text-foreground mb-0.5">{goal.name}</div>
                  <div className="text-xs text-secondary-500">
                    {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                  </div>
                </div>
                <div className={`text-sm px-2 py-0.5 rounded ${
                  goal.status === "on-track"
                    ? "text-success bg-success/10"
                    : "text-warning bg-warning/10"
                }`}>
                  {percentage.toFixed(0)}%
                </div>
              </div>
              <div className="relative mb-2">
                <Progress value={percentage} className="h-2" />
              </div>
              <div className={`text-xs flex items-start gap-1 ${
                goal.status === "on-track" ? "text-success" : "text-warning"
              }`}>
                <span className="mt-0.5">💡</span>
                <span>{insight}</span>
              </div>
            </motion.div>
          );
        })}
        <div className="text-xs text-secondary-500 text-center pt-1 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
          +2 more goals
        </div>
      </div>
    </Card>
  );
}
