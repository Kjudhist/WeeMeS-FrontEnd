import { useState } from "react";
import { GoalsSection } from "../goals-section";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Target } from "lucide-react";
import { AddGoalDialog } from "../add-goal-dialog";
import { toast } from "sonner";

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

export function GoalsPage() {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Emergency Fund",
      current: 45000000,
      target: 60000000,
      deadline: "Dec 2025",
      category: "Safety"
    },
    {
      id: "2", 
      title: "Retirement Fund",
      current: 850000000,
      target: 1500000000,
      deadline: "2040",
      category: "Retirement",
      retirementDetails: {
        yearsAfterRetirement: 25,
        monthlyNeeds: 5000000,
        retirementYear: 2040
      }
    },
    {
      id: "3",
      title: "Vacation Home",
      current: 180000000,
      target: 400000000,
      deadline: "2026",
      category: "Property"
    },
    {
      id: "4",
      title: "Children's Education",
      current: 95000000,
      target: 200000000,
      deadline: "2030",
      category: "Education"
    }
  ]);

  const handleAddGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
    toast.success('Goal created successfully!', {
      description: `${goal.title} has been added to your goals.`
    });
  };

  const handleEditGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    toast.success('Goal updated successfully!', {
      description: `${updatedGoal.title} has been updated.`
    });
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    setGoals(goals.filter(g => g.id !== goalId));
    toast.success('Goal deleted', {
      description: `${goal?.title} has been removed from your goals.`
    });
  };

  const handleStartEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowAddGoal(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setShowAddGoal(open);
    if (!open) {
      setEditingGoal(null);
    }
  };

  const calculateAverageProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => {
      return sum + Math.min((goal.current / goal.target) * 100, 100);
    }, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getOnTrackGoals = () => {
    // Simple heuristic: goals that are > 50% complete are "on track"
    return goals.filter(goal => (goal.current / goal.target) >= 0.5).length;
  };

  const getGoalsByCategory = () => {
    const categories: Record<string, number> = {};
    goals.forEach(goal => {
      categories[goal.category] = (categories[goal.category] || 0) + 1;
    });
    return categories;
  };

  const categoryData = getGoalsByCategory();

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Financial Goals</h2>
            <p className="text-sm text-muted-foreground">Track your progress towards financial milestones</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowAddGoal(true)}>
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </div>
      </Card>

      <AddGoalDialog 
        open={showAddGoal} 
        onOpenChange={handleCloseDialog}
        onAddGoal={handleAddGoal}
        editGoal={editingGoal}
        onEditGoal={handleEditGoal}
      />

      {/* Goals Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Total Goals</span>
          </div>
          <div className="font-semibold">{goals.length} Active</div>
          <div className="text-xs text-muted-foreground">{calculateAverageProgress()}% avg progress</div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-xs text-muted-foreground">On Track</span>
          </div>
          <div className="font-semibold">{getOnTrackGoals()} Goals</div>
          <div className="text-xs text-muted-foreground">Meeting timeline</div>
        </Card>
      </div>

      {/* All Goals */}
      <GoalsSection 
        goals={goals}
        onEditGoal={handleStartEdit}
      />
      
      {/* Goal Categories */}
      {goals.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3">Goal Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(categoryData).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm">{category}</span>
                <span className="text-xs text-muted-foreground">{count} goal{count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}