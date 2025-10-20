import { useState } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  deadline: string;
  category: string;
  retirementDetails?: {
    yearsAfterRetirement: number;
    monthlyNeeds: number;
    retirementYear: number;
  };
}

interface GoalsSectionProps {
  goals?: Goal[];
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export function GoalsSection({ goals: propGoals, onEditGoal, onDeleteGoal }: GoalsSectionProps = {}) {
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  
  const defaultGoals: Goal[] = [
    {
      id: "1",
      title: "Emergency Fund",
      current: 45000,
      target: 60000,
      deadline: "Dec 2024",
      category: "Safety"
    },
    {
      id: "2", 
      title: "Retirement Fund",
      current: 850000,
      target: 1500000,
      deadline: "2040",
      category: "Retirement"
    },
    {
      id: "3",
      title: "Vacation Home",
      current: 180000,
      target: 400000,
      deadline: "2026",
      category: "Property"
    },
    {
      id: "4",
      title: "Children's Education",
      current: 95000,
      target: 200000,
      deadline: "2030",
      category: "Education"
    }
  ];

  const goals = propGoals || defaultGoals;

  const handleDeleteClick = (goal: Goal) => {
    setGoalToDelete(goal);
    setDeleteGoalId(goal.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteGoalId && onDeleteGoal) {
      onDeleteGoal(deleteGoalId);
    }
    setDeleteGoalId(null);
    setGoalToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteGoalId(null);
    setGoalToDelete(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Safety: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Retirement: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", 
      Property: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Education: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Home: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      Vacation: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      Emergency: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Business: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Custom: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return colors[category] || colors.Custom;
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Financial Goals</h3>
          <Badge variant="secondary" className="text-xs">{goals.length} Active</Badge>
        </div>
        
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = getProgressPercentage(goal.current, goal.target);
            
            return (
              <div key={goal.id} className="space-y-2 group">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{goal.title}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs shrink-0 ${getCategoryColor(goal.category)}`}
                      >
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)} • Due {goal.deadline}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-right mr-2">
                      <div className="text-sm font-medium">{percentage.toFixed(0)}%</div>
                    </div>
                    {onEditGoal && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onEditGoal(goal)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
          
          {goals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No goals yet. Start by adding your first financial goal!</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}