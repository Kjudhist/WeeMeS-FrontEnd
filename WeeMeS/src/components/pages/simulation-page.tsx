import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Calculator, TrendingUp, DollarSign, Calendar, AlertCircle, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SimulationPage() {
  const [monthlyContribution, setMonthlyContribution] = useState(1000000);
  const [duration, setDuration] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(8);

  const calculateProjection = () => {
    const months = duration * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    
    let projectionData = [];
    let currentValue = 0;
    let totalContributions = 0;

    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        currentValue = (currentValue + monthlyContribution) * (1 + monthlyRate);
        totalContributions += monthlyContribution;
      }
      
      // Add data point every 6 months for cleaner chart
      if (month % 6 === 0) {
        projectionData.push({
          year: (month / 12).toFixed(1),
          value: Math.round(currentValue),
          contributions: totalContributions,
        });
      }
    }

    return { projectionData, finalValue: currentValue, totalContributions };
  };

  const { projectionData, finalValue, totalContributions } = calculateProjection();
  const totalReturns = finalValue - totalContributions;
  const returnPercentage = ((totalReturns / totalContributions) * 100).toFixed(2);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const resetDefaults = () => {
    setMonthlyContribution(1000000);
    setDuration(10);
    setExpectedReturn(8);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-5 md:p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-700">Investment Simulator</h2>
            <p className="text-sm text-secondary-600">Adjust parameters to see projected returns</p>
          </div>
          <Calculator className="w-8 h-8 text-primary-600" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1">
          <Card className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-primary-700">Parameters</h3>
              <Button variant="ghost" size="sm" onClick={resetDefaults}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              {/* Monthly Contribution Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Monthly Contribution</Label>
                  <span className="text-sm text-primary-700">{formatCurrency(monthlyContribution)}</span>
                </div>
                <Slider
                  value={[monthlyContribution]}
                  onValueChange={([value]) => setMonthlyContribution(value)}
                  min={100000}
                  max={10000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>100K</span>
                  <span>10M</span>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Investment Duration</Label>
                  <span className="text-sm text-primary-700">{duration} years</span>
                </div>
                <Slider
                  value={[duration]}
                  onValueChange={([value]) => setDuration(value)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>

              {/* Expected Return Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Expected Annual Return</Label>
                  <span className="text-sm text-primary-700">{expectedReturn}%</span>
                </div>
                <Slider
                  value={[expectedReturn]}
                  onValueChange={([value]) => setExpectedReturn(value)}
                  min={1}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-secondary-600 mb-3">Quick Presets</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMonthlyContribution(500000);
                    setDuration(5);
                    setExpectedReturn(6);
                  }}
                  className="text-xs"
                >
                  Conservative
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMonthlyContribution(1000000);
                    setDuration(10);
                    setExpectedReturn(8);
                  }}
                  className="text-xs"
                >
                  Moderate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMonthlyContribution(2000000);
                    setDuration(15);
                    setExpectedReturn(12);
                  }}
                  className="text-xs"
                >
                  Aggressive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMonthlyContribution(3000000);
                    setDuration(20);
                    setExpectedReturn(10);
                  }}
                  className="text-xs"
                >
                  Long-term
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100/30 border-primary-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary-700" />
                  <span className="text-sm text-secondary-600">Final Value</span>
                </div>
                <div className="text-primary-700 mb-1">{formatCurrency(finalValue)}</div>
                <div className="text-xs text-secondary-500">After {duration} years</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-secondary-600">Total Returns</span>
                </div>
                <div className="text-success mb-1">{formatCurrency(totalReturns)}</div>
                <div className="text-xs text-secondary-500">+{returnPercentage}% gain</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4 bg-gradient-to-br from-accent-50 to-accent-100/30 border-accent-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-accent-700" />
                  <span className="text-sm text-secondary-600">Total Invested</span>
                </div>
                <div className="text-accent-700 mb-1">{formatCurrency(totalContributions)}</div>
                <div className="text-xs text-secondary-500">{duration * 12} months</div>
              </Card>
            </motion.div>
          </div>

          {/* Projection Chart */}
          <Card className="p-5 md:p-6">
            <h3 className="mb-4 text-primary-700">Projected Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                    stroke="#64748b"
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    stroke="#64748b"
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0f766e" 
                    strokeWidth={3}
                    dot={{ fill: '#0f766e', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Portfolio Value"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="contributions" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Total Contributions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-primary-700"></div>
                <span className="text-secondary-600">Portfolio Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-accent-600 border-t-2 border-dashed border-accent-600"></div>
                <span className="text-secondary-600">Total Contributions</span>
              </div>
            </div>
          </Card>

          {/* Breakdown */}
          <Card className="p-5 md:p-6">
            <h3 className="mb-4 text-primary-700">Investment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm text-secondary-600">Monthly Contribution</span>
                <span className="text-foreground">{formatCurrency(monthlyContribution)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm text-secondary-600">Total Months</span>
                <span className="text-foreground">{duration * 12} months</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm text-secondary-600">Annual Return Rate</span>
                <span className="text-foreground">{expectedReturn}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200">
                <span className="text-sm text-primary-700">Effective Monthly Return</span>
                <span className="text-primary-700">{(expectedReturn / 12).toFixed(2)}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="p-4 bg-warning/5 border-warning/20">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-secondary-700">
              <strong>Disclaimer:</strong> This is an estimate and not a guarantee of future returns. 
              Actual investment performance may vary based on market conditions, fund selection, fees, 
              and other factors. Past performance does not guarantee future results. Please consult 
              with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
