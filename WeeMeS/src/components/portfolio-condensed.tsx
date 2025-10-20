import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, ArrowRight, Wallet } from "lucide-react";
import { motion } from "motion/react";

interface PortfolioCondensedProps {
  onViewMore: () => void;
}

export function PortfolioCondensed({ onViewMore }: PortfolioCondensedProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const topFunds = [
    {
      name: "Schroders Dana Mantap Plus II",
      type: "Fixed Income",
      platform: "Bareksa",
      value: 285000,
      performance: 6.8,
      isPositive: true
    },
    {
      name: "Sucorinvest Equity Fund",
      type: "Equity",
      platform: "Bibit",
      value: 342000,
      performance: 12.4,
      isPositive: true
    }
  ];

  return (
    <Card className="p-5 md:p-6 bg-gradient-to-br from-card via-card to-accent-50/20 border border-border/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary-700">Investment Portfolio</h3>
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
          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary-100/50 to-primary-50/30 border border-primary-200/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-200/50">
              <Wallet className="w-5 h-5 text-primary-700" />
            </div>
            <span className="text-sm text-secondary-600">Total Portfolio Value</span>
          </div>
          <div className="text-right">
            <div className="text-foreground">$1,847,200</div>
            <motion.div 
              className="text-xs text-success flex items-center gap-1 justify-end"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="w-3 h-3" />
              +9.6%
            </motion.div>
          </div>
        </motion.div>
        
        {topFunds.map((fund, index) => (
          <motion.div 
            key={index}
            className="bg-secondary-50/50 rounded-lg p-3 border border-secondary-200/50 hover:border-primary-300 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground mb-1">{fund.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                    {fund.type}
                  </span>
                  <span className="text-secondary-500">• {fund.platform}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {fund.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={fund.isPositive ? "text-success" : "text-destructive"}>
                  {fund.isPositive ? "+" : ""}{fund.performance}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary-500">Current Value</span>
              <span className="text-sm text-foreground">{formatCurrency(fund.value)}</span>
            </div>
          </motion.div>
        ))}
        
        <div className="text-xs text-secondary-500 text-center pt-1">
          +8 more funds
        </div>
      </div>
    </Card>
  );
}
