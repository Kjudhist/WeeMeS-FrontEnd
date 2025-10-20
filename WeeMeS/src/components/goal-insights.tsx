import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Target,
  Lightbulb
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetYear: number;
  targetMonth: number;
}

interface GoalInsightsProps {
  goal: Goal;
}

export function GoalInsights({ goal }: GoalInsightsProps) {
  const calculateInsights = () => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const today = new Date();
    const targetDate = new Date(goal.targetYear, goal.targetMonth - 1);
    const monthsRemaining = Math.max(
      (targetDate.getFullYear() - today.getFullYear()) * 12 + 
      (targetDate.getMonth() - today.getMonth()),
      0
    );
    
    const requiredMonthlyContribution = monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
    const projectedAmount = goal.currentAmount + (goal.monthlyContribution * monthsRemaining);
    const projectedCompletion = goal.monthlyContribution > 0 
      ? Math.ceil(remaining / goal.monthlyContribution) 
      : Infinity;
    
    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
    const isOnTrack = goal.monthlyContribution >= requiredMonthlyContribution;
    const shortfall = Math.max(requiredMonthlyContribution - goal.monthlyContribution, 0);

    return {
      remaining,
      monthsRemaining,
      requiredMonthlyContribution,
      projectedAmount,
      projectedCompletion,
      progressPercentage,
      isOnTrack,
      shortfall,
      willMeetTarget: projectedAmount >= goal.targetAmount
    };
  };

  const insights = calculateInsights();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = () => {
    if (insights.progressPercentage >= 75) return "success";
    if (insights.progressPercentage >= 50) return "primary";
    if (insights.progressPercentage >= 25) return "warning";
    return "destructive";
  };

  const getStatusText = () => {
    if (insights.isOnTrack && insights.willMeetTarget) return "On Track";
    if (insights.isOnTrack && !insights.willMeetTarget) return "Needs Adjustment";
    return "Off Track";
  };

  const getStatusIcon = () => {
    if (insights.isOnTrack && insights.willMeetTarget) return CheckCircle;
    if (insights.isOnTrack) return TrendingUp;
    return AlertTriangle;
  };

  const StatusIcon = getStatusIcon();
  const statusColor = getStatusColor();

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className={`p-4 border-l-4 ${
        statusColor === 'success' ? 'bg-success/5 border-l-success' :
        statusColor === 'warning' ? 'bg-warning/5 border-l-warning' :
        statusColor === 'destructive' ? 'bg-destructive/5 border-l-destructive' :
        'bg-primary-50 border-l-primary-600'
      }`}>
        <div className="flex items-start gap-3">
          <StatusIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            statusColor === 'success' ? 'text-success' :
            statusColor === 'warning' ? 'text-warning' :
            statusColor === 'destructive' ? 'text-destructive' :
            'text-primary-600'
          }`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">Status: <strong>{getStatusText()}</strong></span>
              <Badge variant="outline" className={`${
                statusColor === 'success' ? 'text-success border-success/20' :
                statusColor === 'warning' ? 'text-warning border-warning/20' :
                statusColor === 'destructive' ? 'text-destructive border-destructive/20' :
                'text-primary-700 border-primary-200'
              }`}>
                {insights.progressPercentage.toFixed(1)}% Complete
              </Badge>
            </div>
            <Progress value={insights.progressPercentage} className="h-2 mb-2" />
            
            {/* Primary Insight */}
            {insights.isOnTrack && insights.willMeetTarget && (
              <p className="text-sm text-secondary-700">
                Great progress! You're on track to reach your goal in <strong>{insights.monthsRemaining} months</strong>.
                Keep up your current contribution of {formatCurrency(goal.monthlyContribution)}/month.
              </p>
            )}
            
            {!insights.isOnTrack && insights.shortfall > 0 && (
              <p className="text-sm text-secondary-700">
                You're saving too little. Increase your monthly contribution by <strong>{formatCurrency(insights.shortfall)}</strong> to stay on track.
              </p>
            )}
            
            {insights.isOnTrack && !insights.willMeetTarget && insights.monthsRemaining > 0 && (
              <p className="text-sm text-secondary-700">
                At your current rate, you'll reach <strong>{formatCurrency(insights.projectedAmount)}</strong> by the target date.
                Consider extending the timeline or increasing contributions.
              </p>
            )}
            
            {insights.projectedCompletion !== Infinity && insights.projectedCompletion <= 12 && (
              <p className="text-sm text-success mt-1">
                ✨ Goal achievable in <strong>{insights.projectedCompletion} months</strong> at this rate!
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3 bg-gradient-to-br from-primary-50 to-primary-100/30 border-primary-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary-700" />
            <span className="text-xs text-secondary-600">Remaining</span>
          </div>
          <div className="text-sm text-foreground">{formatCurrency(insights.remaining)}</div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-accent-50 to-accent-100/30 border-accent-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-accent-700" />
            <span className="text-xs text-secondary-600">Months Left</span>
          </div>
          <div className="text-sm text-foreground">{insights.monthsRemaining}</div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-warning" />
            <span className="text-xs text-secondary-600">Required/Mo</span>
          </div>
          <div className="text-sm text-foreground">{formatCurrency(insights.requiredMonthlyContribution)}</div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-secondary-600">Projected</span>
          </div>
          <div className="text-sm text-foreground">{formatCurrency(insights.projectedAmount)}</div>
        </Card>
      </div>

      {/* Recommendations */}
      {insights.shortfall > 0 && (
        <Card className="p-4 bg-gradient-to-r from-warning/5 to-warning/10 border-warning/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-2">
                <strong>Recommendation:</strong> To meet your goal on time
              </p>
              <ul className="text-sm text-secondary-700 space-y-1 list-disc list-inside">
                <li>Increase monthly contribution to {formatCurrency(insights.requiredMonthlyContribution)}</li>
                <li>Or extend target date by {Math.ceil(insights.shortfall / goal.monthlyContribution)} months</li>
                <li>Or adjust target amount to {formatCurrency(insights.projectedAmount)}</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
