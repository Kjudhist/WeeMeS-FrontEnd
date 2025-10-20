import { PortfolioFull } from "../portfolio-full";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, TrendingUp, PieChart, Wallet } from "lucide-react";

export function PortfolioPage() {
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
      <Card className="p-5 md:p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-700">Investment Portfolio</h2>
            <p className="text-sm text-secondary-600">Manage your mutual fund investments</p>
          </div>
          <Button size="sm" className="gap-2 bg-primary-700 hover:bg-primary-800 shadow-md">
            <Plus className="w-4 h-4" />
            Add Fund
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/30 border-primary-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary-200/50">
              <Wallet className="w-4 h-4 text-primary-700" />
            </div>
            <span className="text-xs text-secondary-600">Total Funds</span>
          </div>
          <div className="text-foreground">10</div>
          <div className="text-xs text-secondary-500">Active investments</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-success/20">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <span className="text-xs text-secondary-600">Avg Return</span>
          </div>
          <div className="text-success">+7.8%</div>
          <div className="text-xs text-secondary-500">This year</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent-50 to-accent-100/30 border-accent-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-accent-200/50">
              <PieChart className="w-4 h-4 text-accent-700" />
            </div>
            <span className="text-xs text-secondary-600">Best Performer</span>
          </div>
          <div className="text-accent-700">+15.6%</div>
          <div className="text-xs text-secondary-500">Sucorinvest Sharia</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100/30 border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-secondary-200/50">
              <Wallet className="w-4 h-4 text-secondary-700" />
            </div>
            <span className="text-xs text-secondary-600">Platforms</span>
          </div>
          <div className="text-foreground">4</div>
          <div className="text-xs text-secondary-500">Investment apps</div>
        </Card>
      </div>

      {/* Fund Type Distribution */}
      <Card className="p-5 md:p-6">
        <h3 className="mb-4 text-primary-700">Asset Allocation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100/30 rounded-lg border border-primary-200">
            <div className="text-primary-700 mb-1">35%</div>
            <div className="text-xs text-secondary-600">Equity Funds</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-accent-50 to-accent-100/30 rounded-lg border border-accent-200">
            <div className="text-accent-700 mb-1">28%</div>
            <div className="text-xs text-secondary-600">Fixed Income</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
            <div className="text-success mb-1">26%</div>
            <div className="text-xs text-secondary-600">Balanced</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-secondary-50 to-secondary-100/30 rounded-lg border border-secondary-200">
            <div className="text-secondary-700 mb-1">11%</div>
            <div className="text-xs text-secondary-600">Money Market</div>
          </div>
        </div>
      </Card>

      {/* All Funds */}
      <PortfolioFull />
      
      {/* Performance Metrics */}
      <Card className="p-5 md:p-6">
        <h3 className="mb-4 text-primary-700">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="text-foreground mb-1">+15.6%</div>
            <div className="text-xs text-secondary-600">Best Performer</div>
            <div className="text-xs text-secondary-500 mt-1">Sucorinvest Sharia</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="text-foreground mb-1">{formatCurrency(230900)}</div>
            <div className="text-xs text-secondary-600">Avg Fund Value</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="text-foreground mb-1">7.8%</div>
            <div className="text-xs text-secondary-600">Avg Annual Return</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="text-foreground mb-1">90%</div>
            <div className="text-xs text-secondary-600">Funds Profitable</div>
            <div className="text-xs text-secondary-500 mt-1">9 out of 10</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
