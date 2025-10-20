import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, Target, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface WealthStatsCondensedProps {
  onViewMore: () => void;
}

export function WealthStatsCondensed({ onViewMore }: WealthStatsCondensedProps) {
  return (
    <Card className="p-5 md:p-6 bg-gradient-to-br from-card via-card to-primary-50/20 border border-border/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary-700">Wealth Overview</h3>
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
        <motion.div 
          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-success/10 to-success/5 border border-success/20"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-secondary-600">Total Wealth</span>
          </div>
          <div className="text-right">
            <div className="text-foreground">$2,847,500</div>
            <motion.div 
              className="text-xs text-success flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="w-3 h-3" />
              +12.3%
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary-100/50 to-primary-50/30 border border-primary-200/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-200/50">
              <Target className="w-5 h-5 text-primary-700" />
            </div>
            <span className="text-sm text-secondary-600">Goals Progress</span>
          </div>
          <div className="text-right">
            <div className="text-foreground">68%</div>
            <div className="text-xs text-primary-700">4 active goals</div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}
