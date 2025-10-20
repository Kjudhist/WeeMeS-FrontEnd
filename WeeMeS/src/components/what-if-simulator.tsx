import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  Calendar,
  ArrowRight,
  RotateCcw,
  Target
} from "lucide-react";
import { motion } from "motion/react";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetYear: number;
  targetMonth: number;
}

interface WhatIfSimulatorProps {
  goal: Goal;
  onApplyChanges?: (newContribution: number) => void;
}

export function WhatIfSimulator({ goal, onApplyChanges }: WhatIfSimulatorProps) {
  const [totalAmount, setTotalAmount] = useState(goal.currentAmount);
  const [additionalSavings, setAdditionalSavings] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const calculateProjection = (currentTotal: number) => {
    const today = new Date();
    const targetDate = new Date(goal.targetYear, goal.targetMonth - 1);
    const monthsRemaining = Math.max(
      (targetDate.getFullYear() - today.getFullYear()) * 12 + 
      (targetDate.getMonth() - today.getMonth()),
      0
    );
    
    const finalAmount = currentTotal;
    const willMeetTarget = finalAmount >= goal.targetAmount;
    const requiredMonthly = monthsRemaining > 0 ? (goal.targetAmount - currentTotal) / monthsRemaining : 0;
    
    return {
      finalAmount,
      monthsRemaining,
      willMeetTarget,
      surplus: finalAmount - goal.targetAmount,
      requiredMonthly
    };
  };

  const currentProjection = calculateProjection(goal.currentAmount);
  const adjustedTotal = totalAmount + additionalSavings;
  const adjustedProjection = calculateProjection(adjustedTotal);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const resetSimulation = () => {
    setTotalAmount(goal.currentAmount);
    setAdditionalSavings(0);
  };

  const impactPercentage = adjustedTotal > goal.currentAmount 
    ? (((adjustedTotal - goal.currentAmount) / goal.currentAmount) * 100).toFixed(1)
    : '0';

  return (
    <Card className="overflow-hidden border-2 border-primary-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 shadow-md">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-primary-700">What If? Simulator for {goal.name}</h3>
            <p className="text-xs text-secondary-600">See how different amounts affect your goal</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Current Status */}
        <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-secondary-600">Current Situation</span>
            <Badge variant="outline">{formatCurrency(goal.currentAmount)}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-secondary-500 mb-1">Current Amount</div>
              <div className="text-foreground">{formatCurrency(goal.currentAmount)}</div>
            </div>
            <div>
              <div className="text-xs text-secondary-500 mb-1">Target Amount</div>
              <div className="text-foreground">{formatCurrency(goal.targetAmount)}</div>
            </div>
            <div>
              <div className="text-xs text-secondary-500 mb-1">Months Remaining</div>
              <div className="text-foreground">{currentProjection.monthsRemaining} months</div>
            </div>
            <div>
              <div className="text-xs text-secondary-500 mb-1">Required/Month</div>
              <div className="text-foreground">{formatCurrency(currentProjection.requiredMonthly)}</div>
            </div>
          </div>
        </div>

        {/* Simulators */}
        <div className="space-y-4">
          {/* What if you had more saved */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">What if you had this much saved now?</Label>
              <span className="text-sm text-primary-700">{formatCurrency(totalAmount)}</span>
            </div>
            <Slider
              value={[totalAmount]}
              onValueChange={([value]: number[]) => setTotalAmount(value)}
              min={goal.currentAmount}
              max={goal.targetAmount}
              step={1000000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(goal.currentAmount)}</span>
              <span>{formatCurrency(goal.targetAmount)}</span>
            </div>
          </div>

          {/* Additional One-time Savings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                Plus one-time additional savings
              </Label>
              <span className="text-sm text-success">+{formatCurrency(additionalSavings)}</span>
            </div>
            <Slider
              value={[additionalSavings]}
              onValueChange={([value]) => setAdditionalSavings(value)}
              min={0}
              max={goal.targetAmount - goal.currentAmount}
              step={1000000}
              className="w-full"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-lg border border-primary-200">
            <span className="text-sm text-secondary-700">Total Amount with Changes</span>
            <span className="text-primary-700">{formatCurrency(adjustedTotal)}</span>
          </div>

          {/* Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className={`p-3 ${adjustedProjection.willMeetTarget ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className={`w-4 h-4 ${adjustedProjection.willMeetTarget ? 'text-success' : 'text-warning'}`} />
                <span className="text-xs text-secondary-600">By Target Date</span>
              </div>
              <div className={`text-sm ${adjustedProjection.willMeetTarget ? 'text-success' : 'text-warning'}`}>
                {formatCurrency(adjustedTotal)}
              </div>
              <div className="text-xs text-secondary-500 mt-1 flex items-center gap-1">
                {parseFloat(impactPercentage) > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    +{impactPercentage}% increase
                  </>
                ) : (
                  <span>No change</span>
                )}
              </div>
            </Card>

            <Card className="p-3 bg-accent-50 border-accent-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-accent-700" />
                <span className="text-xs text-secondary-600">New Required/Mo</span>
              </div>
              <div className="text-sm text-accent-700">
                {formatCurrency(adjustedProjection.requiredMonthly)}
              </div>
              <div className="text-xs text-secondary-500 mt-1">
                For {adjustedProjection.monthsRemaining} months
              </div>
            </Card>

            <Card className="p-3 bg-gradient-to-br from-primary-50 to-primary-100/30 border-primary-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary-700" />
                <span className="text-xs text-secondary-600">Status</span>
              </div>
              <div className="text-sm text-primary-700">
                {adjustedProjection.willMeetTarget ? 'Will Meet Goal' : 'Still Short'}
              </div>
              {adjustedProjection.willMeetTarget && adjustedProjection.surplus > 0 && (
                <div className="text-xs text-success mt-1">
                  +{formatCurrency(adjustedProjection.surplus)} extra
                </div>
              )}
              {!adjustedProjection.willMeetTarget && (
                <div className="text-xs text-warning mt-1">
                  Need {formatCurrency(goal.targetAmount - adjustedTotal)} more
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSimulation}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          {onApplyChanges && adjustedTotal > goal.currentAmount && (
            <Button
              size="sm"
              onClick={() => {
                const newMonthly = adjustedProjection.requiredMonthly;
                onApplyChanges(newMonthly);
              }}
              className="flex-1 bg-primary-700 hover:bg-primary-800"
            >
              Use This Scenario
            </Button>
          )}
        </div>

        {/* Insight */}
        {adjustedProjection.willMeetTarget && (
          <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
            <p className="text-sm text-success">
              ✨ <strong>Great news!</strong> With {formatCurrency(adjustedTotal)}, you'd need to save only <strong>{formatCurrency(adjustedProjection.requiredMonthly)}/month</strong> to reach your goal by {goal.targetMonth}/{goal.targetYear}!
            </p>
          </div>
        )}
        {!adjustedProjection.willMeetTarget && adjustedTotal > goal.currentAmount && (
          <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning">
              With {formatCurrency(adjustedTotal)}, you'd still need <strong>{formatCurrency(adjustedProjection.requiredMonthly)}/month</strong> to reach your {formatCurrency(goal.targetAmount)} goal by {goal.targetMonth}/{goal.targetYear}.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
