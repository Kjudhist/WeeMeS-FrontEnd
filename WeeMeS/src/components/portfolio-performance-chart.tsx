import { Card } from "./ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PortfolioPerformanceChartProps {
  compact?: boolean;
}

export function PortfolioPerformanceChart({ compact = false }: PortfolioPerformanceChartProps) {
  // Sample portfolio performance data over 12 months
  const performanceData = [
    { month: 'Jan', value: 180000000, benchmark: 178000000 },
    { month: 'Feb', value: 185000000, benchmark: 181000000 },
    { month: 'Mar', value: 183000000, benchmark: 182000000 },
    { month: 'Apr', value: 195000000, benchmark: 188000000 },
    { month: 'May', value: 202000000, benchmark: 193000000 },
    { month: 'Jun', value: 208000000, benchmark: 198000000 },
    { month: 'Jul', value: 205000000, benchmark: 200000000 },
    { month: 'Aug', value: 218000000, benchmark: 207000000 },
    { month: 'Sep', value: 225000000, benchmark: 212000000 },
    { month: 'Oct', value: 230000000, benchmark: 218000000 },
    { month: 'Nov', value: 242000000, benchmark: 225000000 },
    { month: 'Dec', value: 250000000, benchmark: 230000000 }
  ];

  const currentValue = performanceData[performanceData.length - 1].value;
  const startValue = performanceData[0].value;
  const percentageGain = ((currentValue - startValue) / startValue * 100).toFixed(2);
  const absoluteGain = currentValue - startValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    return formatCurrency(value);
  };

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-card to-primary-50/20 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="text-primary-700">Portfolio Performance</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-secondary-600">YTD Growth:</span>
            <span className="text-success">+{percentageGain}%</span>
            <span className="text-xs text-secondary-500">({formatCurrency(absoluteGain)})</span>
          </div>
        </div>
        {!compact && (
          <div className="flex items-center gap-2 text-xs text-secondary-500">
            <Calendar className="w-3 h-3" />
            <span>Last 12 months</span>
          </div>
        )}
      </div>

      <div className={compact ? "h-40" : "h-64"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => formatShortCurrency(value)}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="benchmark" 
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#colorBenchmark)"
              name="Market Benchmark"
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0f766e"
              strokeWidth={3}
              fill="url(#colorValue)"
              name="Your Portfolio"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {!compact && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-primary-50 rounded-lg border border-primary-200">
            <div className="text-xs text-secondary-600 mb-1">Start Value</div>
            <div className="text-sm text-foreground">{formatShortCurrency(startValue)}</div>
          </div>
          <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="text-xs text-secondary-600 mb-1">Current Value</div>
            <div className="text-sm text-success">{formatShortCurrency(currentValue)}</div>
          </div>
          <div className="text-center p-3 bg-accent-50 rounded-lg border border-accent-200">
            <div className="text-xs text-secondary-600 mb-1">Total Gain</div>
            <div className="text-sm text-accent-700">+{percentageGain}%</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-600 rounded-sm"></div>
          <span className="text-secondary-600">Your Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-secondary-400 rounded-sm"></div>
          <span className="text-secondary-600">Benchmark</span>
        </div>
      </div>
    </Card>
  );
}
