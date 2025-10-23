import { useState, useEffect } from "react";
import { AddGoalDialog } from "../add-goal-dialog";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Target, TrendingUp, Lightbulb, Calculator } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { fetchGoalsList, fetchGoalDetail, type GoalsListItem, fetchGoalsTracking, type GoalTrackingItem } from "../../service/handler";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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
  const [goals, setGoals] = useState<Goal[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<GoalsListItem | null>(null);
  const [trackingList, setTrackingList] = useState<GoalTrackingItem[]>([]);

  useEffect(() => {
    const ud = JSON.parse(localStorage.getItem('userData') || 'null');
    const userId: string | undefined = ud?.customerId;
    if (!userId) return;
    (async () => {
      try {
        // Prefer tracking endpoint to get progress
        const tracking = await fetchGoalsTracking(userId);
        if (tracking.success && Array.isArray(tracking.data)) {
          const mapped: Goal[] = (tracking.data as GoalTrackingItem[]).map((t) => {
            const year = parseInt(t.targetDate?.slice(0, 4) || '0');
            const month = parseInt(t.targetDate?.slice(5, 7) || '12');
            return {
              id: t.goalId,
              name: t.goalName,
              targetAmount: Number(t.targetAmount || 0),
              currentAmount: Number(t.actualValueToDate || 0),
              monthlyContribution: 0,
              targetYear: year,
              targetMonth: month,
              category: t.goalType,
            };
          });
          setGoals(mapped);
          setTrackingList(tracking.data as GoalTrackingItem[]);
        } else {
          // Fallback to listGoals if tracking not available
          const resp = await fetchGoalsList(userId);
          if (resp.success && Array.isArray(resp.data)) {
            const mapped: Goal[] = (resp.data as GoalsListItem[]).map((g) => {
              const year = parseInt(g.targetDate?.slice(0, 4) || '0');
              const month = parseInt(g.targetDate?.slice(5, 7) || '12');
              return {
                id: g.goalId,
                name: g.goalName,
                targetAmount: Number(g.targetAmount || 0),
                currentAmount: 0,
                monthlyContribution: 0,
                targetYear: year,
                targetMonth: month,
                category: g.goalType,
              };
            });
            setGoals(mapped);
            setTrackingList([]);
          } else {
            toast.error(resp.messages?.join(', ') || 'Failed to fetch goals');
          }
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to fetch goals');
      }
    })();
  }, []);

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
        <Card className="p-4 bg-background border-border">
          <div className="flex items-center gap-2 mb-1.5">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-secondary-600">Total Goals</span>
          </div>
          <div className="text-foreground text-lg">{goals.length}</div>
          <div className="text-xs text-secondary-500">Active</div>
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
                  <Card onClick={async () => {
                    try {
                      const ud = JSON.parse(localStorage.getItem('userData') || 'null');
                      const userId: string | undefined = ud?.customerId;
                      if (!userId) return;
                      setDetailLoading(true);
                      setDetailOpen(true);
                      const detail = await fetchGoalDetail(userId, goal.id);
                      if (detail.success) {
                        setDetailData(detail.data as any);
                      } else {
                        toast.error(detail.messages?.join(', ') || 'Failed to load goal');
                      }
                    } catch (e: any) {
                      toast.error(e?.message || 'Failed to load goal');
                    } finally {
                      setDetailLoading(false);
                    }
                  }} className={`p-3 border border-secondary-200 bg-secondary-50 cursor-pointer transition-all hover:shadow-md hover:border-primary/40`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-foreground text-sm">{goal.name}</h3>
                        </div>
                        <p className="text-[11px] text-secondary-500">{goal.category} • Target: {goal.targetMonth}/{goal.targetYear}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-primary-700">{progress.toFixed(1)}%</div>
                        <div className="text-[11px] text-secondary-500">Complete</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-2">
                      <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all bg-primary/40`}
                          style={{ width: `${Math.min(progress, 100)}%`, ...(progress > 0 ? { minWidth: '2px' } : {}) }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-secondary-500">
                        <span>{new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(goal.currentAmount)}</span>
                        <span>{new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(goal.targetAmount)}</span>
                      </div>
                    </div>

                    {/* Inline Insights Box */}
                    <div className={`hidden p-3 rounded-lg ${
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
                      <div className="hidden grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-current/10">
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
                      <div className="hidden mt-3 pt-3 border-t border-current/10">
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
      </div>

      {/* Detail Popup */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Goal Detail</DialogTitle>
          </DialogHeader>
          {detailLoading && (
            <div className="text-sm text-secondary-600">Loading...</div>
          )}
          {!detailLoading && detailData && (
            <div className="space-y-4">
              {/* Header summary */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-secondary-600">Goal Name</div>
                  <div className="text-base font-medium text-foreground">{detailData.goalName}</div>
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  {detailData.goalType}
                </Badge>
              </div>

              {/* Status from tracking */}
              {(() => {
                const info = trackingList.find(t => t.goalId === detailData.goalId);
                if (!info) return null;
                const isOn = String(info.status).toUpperCase() === 'ON_TRACK';
                return (
                  <div className={`p-3 rounded-md border ${isOn ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-secondary-600 mr-2">Status</span>
                        <span className={isOn ? 'text-green-700' : 'text-amber-700'}>{info.status}</span>
                      </div>
                      <Badge variant="outline" className={isOn ? 'text-green-700 border-green-200' : 'text-amber-700 border-amber-200'}>
                        {isOn ? 'On Track' : 'Needs Attention'}
                      </Badge>
                    </div>
                    {info.statusMessage && (
                      <div className="mt-2 text-xs text-secondary-700">{info.statusMessage}</div>
                    )}
                  </div>
                );
              })()}

              {/* Highlight cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="text-[11px] text-secondary-600">Target Amount</div>
                  <div className="text-base font-semibold text-primary">Rp {Number(detailData.targetAmount || 0).toLocaleString('id-ID')}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-[11px] text-secondary-600">Target Date</div>
                  <div className="text-base font-medium">{detailData.targetDate}</div>
                </Card>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-1 gap-2 border-t pt-3">
                {detailData.riskProfileId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">Risk Profile ID</span>
                    <span className="truncate max-w-[220px] text-right">{detailData.riskProfileId}</span>
                  </div>
                )}
                {detailData.createdAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">Created</span>
                    <span>{new Date(detailData.createdAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
