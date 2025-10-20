import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Wallet, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";

export function PortfolioFull() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const mutualFunds = [
    {
      name: "Schroders Dana Mantap Plus II",
      type: "Fixed Income",
      platform: "Bareksa",
      value: 285000,
      units: 142500,
      nav: 2.00,
      performance: 6.8,
      risk: "Low",
      isPositive: true,
      color: "primary"
    },
    {
      name: "Sucorinvest Equity Fund",
      type: "Equity",
      platform: "Bibit",
      value: 342000,
      units: 28500,
      nav: 12.00,
      performance: 12.4,
      risk: "High",
      isPositive: true,
      color: "accent"
    },
    {
      name: "Mandiri Investa Atraktif",
      type: "Balanced",
      platform: "Ajaib",
      value: 428000,
      units: 35667,
      nav: 12.00,
      performance: 8.9,
      risk: "Medium",
      isPositive: true,
      color: "success"
    },
    {
      name: "BNI-AM Dana Likuid",
      type: "Money Market",
      platform: "Bareksa",
      value: 195000,
      units: 195000,
      nav: 1.00,
      performance: 3.2,
      risk: "Very Low",
      isPositive: true,
      color: "secondary"
    },
    {
      name: "Manulife Saham Andalan",
      type: "Equity",
      platform: "Bibit",
      value: 267000,
      units: 11150,
      nav: 23.95,
      performance: -2.1,
      risk: "High",
      isPositive: false,
      color: "destructive"
    },
    {
      name: "Mandiri Obligasi Unggulan",
      type: "Fixed Income",
      platform: "Tokopedia",
      value: 178000,
      units: 89000,
      nav: 2.00,
      performance: 5.4,
      risk: "Low",
      isPositive: true,
      color: "primary"
    },
    {
      name: "Sucorinvest Sharia Equity Fund",
      type: "Equity",
      platform: "Bibit",
      value: 89000,
      units: 7417,
      nav: 12.00,
      performance: 15.6,
      risk: "High",
      isPositive: true,
      color: "accent"
    },
    {
      name: "Schroder Dana Terpadu II",
      type: "Balanced",
      platform: "Bareksa",
      value: 63200,
      units: 6320,
      nav: 10.00,
      performance: 7.3,
      risk: "Medium",
      isPositive: true,
      color: "success"
    }
  ];

  const totalValue = mutualFunds.reduce((sum, fund) => sum + fund.value, 0);
  const avgPerformance = mutualFunds.reduce((sum, fund) => sum + fund.performance, 0) / mutualFunds.length;

  const platformSummary = mutualFunds.reduce((acc, fund) => {
    if (!acc[fund.platform]) {
      acc[fund.platform] = { count: 0, value: 0 };
    }
    acc[fund.platform].count++;
    acc[fund.platform].value += fund.value;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-primary-200/50">
              <Wallet className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <p className="text-xs text-secondary-600">Total Portfolio Value</p>
              <h3 className="text-foreground">{formatCurrency(totalValue)}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <ArrowUpRight className="w-4 h-4" />
            <span>+9.6% overall</span>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-accent-200/50">
              <PieChart className="w-6 h-6 text-accent-700" />
            </div>
            <div>
              <p className="text-xs text-secondary-600">Total Funds</p>
              <h3 className="text-foreground">{mutualFunds.length}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-secondary-600">
            <span>Across {Object.keys(platformSummary).length} platforms</span>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-success/20">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-xs text-secondary-600">Avg. Performance</p>
              <h3 className="text-foreground">+{avgPerformance.toFixed(1)}%</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <span>This year</span>
          </div>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card className="p-5 md:p-6">
        <h3 className="mb-4 text-primary-700">By Platform</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(platformSummary).map(([platform, data]) => (
            <div key={platform} className="p-3 rounded-lg bg-secondary-50 border border-secondary-200">
              <p className="text-xs text-secondary-600 mb-1">{platform}</p>
              <p className="text-foreground">{formatCurrency(data.value)}</p>
              <p className="text-xs text-secondary-500 mt-1">{data.count} {data.count === 1 ? 'fund' : 'funds'}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Mutual Funds List */}
      <Card className="p-5 md:p-6">
        <h3 className="mb-4 text-primary-700">All Mutual Funds</h3>
        <div className="space-y-3">
          {mutualFunds.map((fund, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-lg border border-border bg-card hover:border-primary-300 hover:shadow-md transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Fund Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-foreground mb-1">{fund.name}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                          {fund.type}
                        </Badge>
                        <span className="text-xs text-secondary-500">via {fund.platform}</span>
                        <Badge 
                          variant="outline" 
                          className={
                            fund.risk === "Very Low" || fund.risk === "Low" 
                              ? "bg-success/10 text-success border-success/20"
                              : fund.risk === "Medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {fund.risk} Risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Units and NAV */}
                  <div className="flex items-center gap-4 text-xs text-secondary-600 mt-2">
                    <span>{fund.units.toLocaleString()} units</span>
                    <span>•</span>
                    <span>NAV: ${fund.nav.toFixed(2)}</span>
                  </div>
                </div>

                {/* Value and Performance */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-secondary-600 mb-1">Current Value</p>
                    <p className="text-foreground">{formatCurrency(fund.value)}</p>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
                    fund.isPositive 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {fund.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {fund.isPositive ? "+" : ""}{fund.performance}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
