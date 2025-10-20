import { WealthStats } from "../wealth-stats";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, TrendingUp, PieChart, BarChart3, Lightbulb, CheckCircle, AlertTriangle } from "lucide-react";

export function AnalyticsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-4 md:p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-700">Wealth Analytics</h2>
            <p className="text-sm text-secondary-600">Detailed insights into your financial performance</p>
          </div>
          <Button size="sm" variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Range
          </Button>
        </div>
      </Card>

      {/* Insights Section */}
      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary-600" />
          <h3 className="text-primary-700">Key Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground mb-1">Your Retirement Goal is on track.</p>
              <p className="text-xs text-secondary-600">You're contributing consistently and meeting your targets. Keep up the great work!</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground mb-1">Education Goal needs attention.</p>
              <p className="text-xs text-secondary-600">Consider increasing monthly contribution by Rp 500,000 to stay on track.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground mb-1">Portfolio performance is above average.</p>
              <p className="text-xs text-secondary-600">Your annual return of 12.5% exceeds the market benchmark by 3.2%.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* All Wealth Stats */}
      <WealthStats />

      {/* Main analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Asset Allocation</h3>
            <PieChart className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Equity Funds', amount: 698000, percentage: 35.0, color: 'bg-primary-600' },
              { name: 'Fixed Income', amount: 558000, percentage: 28.0, color: 'bg-accent-500' },
              { name: 'Balanced Funds', amount: 518000, percentage: 26.0, color: 'bg-success' },
              { name: 'Money Market', amount: 219200, percentage: 11.0, color: 'bg-secondary-500' }
            ].map((asset) => (
              <div key={asset.name} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${asset.color}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{asset.name}</span>
                    <span className="text-sm font-semibold">{formatCurrency(asset.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-muted rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${asset.color}`}
                        style={{ width: `${asset.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{asset.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Metrics */}
        <Card className="p-4 md:p-6">
          <h3 className="mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Net Worth Growth</div>
              <div className="font-semibold text-green-600">+$342,500</div>
              <div className="text-xs text-muted-foreground">Last 12 months</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Monthly Income</div>
              <div className="font-semibold">$28,500</div>
              <div className="text-xs text-muted-foreground">Portfolio generated</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Debt-to-Assets</div>
              <div className="font-semibold">32%</div>
              <div className="text-xs text-muted-foreground">Healthy ratio</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <div className="font-semibold text-yellow-600">Moderate</div>
              <div className="text-xs text-muted-foreground">Well diversified</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Chart - Full Width */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Performance Trend</h3>
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="h-48 md:h-64 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm">Chart visualization would appear here</div>
            <div className="text-xs">Showing 12-month performance trend</div>
          </div>
        </div>
      </Card>
    </div>
  );
}