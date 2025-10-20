import { WealthStatsCondensed } from "../wealth-stats-condensed";
import { GoalsSectionCondensed } from "../goals-section-condensed";
import { PortfolioCondensed } from "../portfolio-condensed";
import { PortfolioPerformanceChart } from "../portfolio-performance-chart";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Calculator, ArrowLeftRight, Shield } from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string) => void;
  userData?: any;
}

export function HomePage({ onNavigate, userData }: HomePageProps) {

  return (
    <div className="space-y-6">
      {/* Risk Profile Banner */}
      {userData?.riskProfile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-600 shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Your Risk Profile:</span>
                  <span className="text-sm text-primary-700 dark:text-primary-300">{userData.riskProfile}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {userData.riskProfile === 'Conservative' && 'Focus on capital preservation with lower-risk investments'}
                  {userData.riskProfile === 'Moderate' && 'Balanced approach with diversified portfolio'}
                  {userData.riskProfile === 'Aggressive' && 'Maximum growth potential with higher risk tolerance'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <Card className="p-5 md:p-6 bg-gradient-to-br from-card to-primary-50/30 border-primary-200">
        <h3 className="mb-4 text-primary-700">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => onNavigate('goals')}
            className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add Goal</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('simulation')}
            className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 shadow-md hover:shadow-lg transition-all"
          >
            <Calculator className="w-5 h-5" />
            <span className="text-sm">Simulate Investment</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('transactions')}
            className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-success to-success hover:opacity-90 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-sm">View Transactions</span>
          </Button>
        </div>
      </Card>

      {/* Top Section: Portfolio & Goals */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Portfolio Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="transform transition-all duration-300 hover:shadow-xl"
        >
          <PortfolioPerformanceChart compact={true} />
        </motion.div>

        {/* Goals Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="transform transition-all duration-300 hover:shadow-xl"
        >
          <GoalsSectionCondensed onViewMore={() => onNavigate('goals')} />
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="transform transition-all duration-300 hover:shadow-xl"
        >
          <WealthStatsCondensed onViewMore={() => onNavigate('analytics')} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="transform transition-all duration-300 hover:shadow-xl"
        >
          <PortfolioCondensed onViewMore={() => onNavigate('portfolio')} />
        </motion.div>
      </div>
    </div>
  );
}