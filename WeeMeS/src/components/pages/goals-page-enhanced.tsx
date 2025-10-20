import { useState } from "react";
import { AddGoalDialog } from "../add-goal-dialog";
import { WhatIfSimulator } from "../what-if-simulator";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Target, TrendingUp, Lightbulb, Calculator } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetYear: number;
  targetMonth: number;
  category: string;
}

export function GoalsPageEnhanced() {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoalForInsights, setSelectedGoalForInsights] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      currentAmount: 45000000,
      targetAmount: 60000000,
      monthlyContribution: 2000000,
      targetYear: 2025,
      targetMonth: 12,
      category: "Safety"
    },
    {
      id: "2", 
      name: "Retirement Fund",
      currentAmount: 850000000,
      targetAmount: 1500000000,
      monthlyContribution: 5000000,
      targetYear: 2040,
      targetMonth: 12,
      category: "Retirement"
    },
    {
      id: "3",
      name: "Vacation Home",
      currentAmount: 180000000,
      targetAmount: 400000000,
      monthlyContribution: 3000000,
      targetYear: 2026,
      targetMonth: 12,
      category: "Property"
    },
    {
      id: "4",
      name: "Children's Education",
      currentAmount: 95000000,
      targetAmount: 200000000,
      monthlyContribution: 2500000,
      targetYear: 2030,
      targetMonth: 6,
      category: "Education"
    }
  ]);

  const selectedGoal = selectedGoalForInsights 
    ? goals.find(g => g.id === selectedGoalForInsights) 
    : goals[0]; // Default to first goal

  const handleApplyWhatIfChanges = (goalId: string, newContribution: number) => {
    setGoals(prevGoals => 
      prevGoals.map(g => 
        g.id === goalId 
          ? { ...g, monthlyContribution: newContribution }
          : g
      )
    );
    toast.success('Contribution updated!', {
      description: `Monthly contribution adjusted based on simulation.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-4 md:p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-700">Financial Goals</h2>
            <p className="text-sm text-secondary-600">Track progress and simulate scenarios</p>
          </div>
          <Button 
            onClick={() => setShowAddGoal(true)}
            size="sm" 
            className="gap-2 bg-primary-700 hover:bg-primary-800 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/30 border-primary-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary-700" />
            <span className="text-xs text-secondary-600">Total Goals</span>
          </div>
          <div className="text-foreground">{goals.length}</div>
          <div className="text-xs text-secondary-500">Active</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-secondary-600">On Track</span>
          </div>
          <div className="text-success">
            {goals.filter(g => {
              const remaining = g.targetAmount - g.currentAmount;
              const monthsRemaining = (g.targetYear - new Date().getFullYear()) * 12 + 
                (g.targetMonth - (new Date().getMonth() + 1));
              const required = monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
              return g.monthlyContribution >= required;
            }).length}
          </div>
          <div className="text-xs text-secondary-500">Goals</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent-50 to-accent-100/30 border-accent-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-accent-700" />
            <span className="text-xs text-secondary-600">Avg Progress</span>
          </div>
          <div className="text-accent-700">
            {Math.round(goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount * 100), 0) / goals.length)}%
          </div>
          <div className="text-xs text-secondary-500">Complete</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-warning" />
            <span className="text-xs text-secondary-600">Needs Action</span>
          </div>
          <div className="text-warning">
            {goals.filter(g => {
              const remaining = g.targetAmount - g.currentAmount;
              const monthsRemaining = (g.targetYear - new Date().getFullYear()) * 12 + 
                (g.targetMonth - (new Date().getMonth() + 1));
              const required = monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
              return g.monthlyContribution < required;
            }).length}
          </div>
          <div className="text-xs text-secondary-500">Goals</div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Goals List with Inline Insights */}
        {goals.length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-600">No goals yet. Add a goal to see insights and simulations.</p>
            <Button 
              onClick={() => setShowAddGoal(true)}
              className="mt-4"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {goals.map((goal, index) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const monthsRemaining = (goal.targetYear - new Date().getFullYear()) * 12 + 
                (goal.targetMonth - (new Date().getMonth() + 1));
              const requiredMonthly = monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
              const isOnTrack = goal.monthlyContribution >= requiredMonthly;
              const monthsToComplete = goal.monthlyContribution > 0 
                ? Math.ceil(remaining / goal.monthlyContribution) 
                : Infinity;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-5 border-l-4 transition-shadow hover:shadow-lg ${
                    isOnTrack ? 'border-l-success bg-success/5' : 'border-l-warning bg-warning/5'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-foreground">{goal.name}</h3>
                          <Badge variant="outline" className={`${
                            isOnTrack ? 'text-success border-success/20' : 'text-warning border-warning/20'
                          }`}>
                            {isOnTrack ? 'On Track' : 'Off Track'}
                          </Badge>
                        </div>
                        <p className="text-xs text-secondary-500">{goal.category} • Target: {goal.targetMonth}/{goal.targetYear}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-primary-700">{progress.toFixed(1)}%</div>
                        <div className="text-xs text-secondary-500">Complete</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            isOnTrack 
                              ? 'bg-gradient-to-r from-success to-success/80'
                              : 'bg-gradient-to-r from-warning to-warning/80'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-secondary-500">
                        <span>Rp {(goal.currentAmount / 1000000).toFixed(0)}M</span>
                        <span>Rp {(goal.targetAmount / 1000000).toFixed(0)}M</span>
                      </div>
                    </div>

                    {/* Inline Insights Box */}
                    <div className={`p-3 rounded-lg ${
                      isOnTrack ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Lightbulb className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          isOnTrack ? 'text-success' : 'text-warning'
                        }`} />
                        <div className="flex-1">
                          {isOnTrack ? (
                            <p className="text-sm text-secondary-700">
                              <strong>Great progress!</strong> You'll reach your goal in <strong>{monthsToComplete} months</strong> at your current contribution of <strong>Rp {(goal.monthlyContribution / 1000000).toFixed(1)}M/month</strong>.
                            </p>
                          ) : (
                            <p className="text-sm text-secondary-700">
                              <strong>You're saving too little.</strong> Increase monthly contribution by <strong>Rp {((requiredMonthly - goal.monthlyContribution) / 1000000).toFixed(1)}M</strong> to stay on track for your {goal.targetMonth}/{goal.targetYear} target.
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-current/10">
                        <div>
                          <div className="text-xs text-secondary-500">Monthly</div>
                          <div className="text-sm">Rp {(goal.monthlyContribution / 1000000).toFixed(1)}M</div>
                        </div>
                        <div>
                          <div className="text-xs text-secondary-500">Remaining</div>
                          <div className="text-sm">Rp {(remaining / 1000000).toFixed(0)}M</div>
                        </div>
                        <div>
                          <div className="text-xs text-secondary-500">Months Left</div>
                          <div className="text-sm">{monthsRemaining}</div>
                        </div>
                      </div>

                      {/* What-If Simulator */}
                      <div className="mt-3 pt-3 border-t border-current/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedGoalForInsights(goal.id)}
                          className="w-full text-xs h-8"
                        >
                          <Calculator className="w-3 h-3 mr-2" />
                          Run What-If Simulator
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* What-If Simulator Modal/Expanded View */}
        {selectedGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WhatIfSimulator 
              goal={selectedGoal}
              onApplyChanges={(newContribution) => {
                handleApplyWhatIfChanges(selectedGoal.id, newContribution);
                setSelectedGoalForInsights(null);
                
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Add Goal Dialog */}
      <AddGoalDialog 
        open={showAddGoal} 
        onOpenChange={(open) => setShowAddGoal(open)}
        onAddGoal={(goal: any) => {
          setGoals([...goals, {
            id: `${goals.length + 1}`,
            name: goal.title, // Changed from title to name
            targetAmount: goal.target,
            currentAmount: goal.current || 0,
            monthlyContribution: 1000000, // Default value
            targetYear: parseInt(goal.deadline),
            targetMonth: 12,
            category: goal.category
          }]);
          toast.success('Goal created successfully!', {
            description: `${goal.title} has been added to your goals.`
          });
        }}
      />
    </div>
  );
}
