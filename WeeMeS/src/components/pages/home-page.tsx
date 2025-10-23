import { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Shield, LineChart, PieChart, TrendingUp, Calculator, ArrowRight, Goal, Receipt } from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string) => void;
  userData?: any;
}

type PortfolioSummary = {
  totalValue: number; // in IDR
  monthlyGrowthPct: number; // 0.048 = 4.8%
  trend: number[]; // sparkline data
  allocation: { stocks: number; bonds: number; property: number };
};

type RiskSummary = {
  type: "Conservative" | "Balanced" | "Aggressive" | string;
  expectedReturn: string; // e.g., "7–9%"
  description: string;
};

export function HomePage({ onNavigate, userData }: HomePageProps) {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [risk, setRisk] = useState<RiskSummary | null>(null);
  const [income, setIncome] = useState<number>(8000000);
  const [expense, setExpense] = useState<number>(5000000);
  const [simResult, setSimResult] = useState<string>("");
  const [loadingSim, setLoadingSim] = useState(false);

  // Load portfolio summary (mocked fetch with graceful fallback)
  useEffect(() => {
    const fallback: PortfolioSummary = {
      totalValue: 128450000,
      monthlyGrowthPct: 0.048,
      trend: [102, 104, 101, 108, 112, 115, 120, 118, 124, 128],
      allocation: { stocks: 55, bonds: 25, property: 20 },
    };
    fetch("/api/portfolio/summary").then(r => r.ok ? r.json() : Promise.reject()).then(d => setPortfolio(d)).catch(() => setPortfolio(fallback));
  }, []);

  // Load risk profile locally from props/localStorage
  useEffect(() => {
    const fromProps = userData?.riskProfile as string | undefined;
    let fromStorage: string | undefined;
    try {
      const ud = JSON.parse(localStorage.getItem("userData") || "null");
      fromStorage = ud?.riskProfile || undefined;
    } catch {}
    const profileType = fromProps || fromStorage || "Balanced";
    const computed: RiskSummary = {
      type: profileType === "Moderate" ? "Balanced" : profileType,
      expectedReturn:
        profileType === "Aggressive" ? "10–14%" : profileType === "Conservative" ? "4–6%" : "7–9%",
      description:
        profileType === "Aggressive"
          ? "Higher risk tolerance targeting maximum growth."
          : profileType === "Conservative"
          ? "Focus on capital preservation with lower volatility."
          : "Balanced approach with diversified portfolio.",
    };
    setRisk(computed);
  }, [userData?.riskProfile]);

  const sparkPath = useMemo(() => {
    if (!portfolio?.trend?.length) return "";
    const data = portfolio.trend;
    const w = 160, h = 48, pad = 2;
    const min = Math.min(...data), max = Math.max(...data);
    const scaleX = (i: number) => pad + (i * (w - 2 * pad)) / (data.length - 1);
    const scaleY = (v: number) => {
      if (max === min) return h / 2;
      return h - pad - ((v - min) * (h - 2 * pad)) / (max - min);
    };
    return data.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(v)}`).join(" ");
  }, [portfolio?.trend]);

  const allocationAngles = useMemo(() => {
    const total = (portfolio?.allocation.stocks || 0) + (portfolio?.allocation.bonds || 0) + (portfolio?.allocation.property || 0);
    const pct = (v: number) => (total ? (v / total) * 100 : 0);
    return [pct(portfolio?.allocation.stocks || 0), pct(portfolio?.allocation.bonds || 0), pct(portfolio?.allocation.property || 0)];
  }, [portfolio]);

  const runSimulation = async () => {
    setLoadingSim(true);
    setSimResult("");
    try {
      const res = await fetch("/api/simulation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ income, expense }) });
      if (res.ok) {
        const d = await res.json();
        setSimResult(d?.message || "If you save Rp 500.000 more per month, your ‘Car Goal’ completes 4 months faster.");
      } else {
        // Fallback
        await new Promise(r => setTimeout(r, 500));
        setSimResult("If you save Rp 500.000 more per month, your ‘Car Goal’ completes 4 months faster.");
      }
    } catch {
      await new Promise(r => setTimeout(r, 500));
      setSimResult("If you save Rp 500.000 more per month, your ‘Car Goal’ completes 4 months faster.");
    } finally {
      setLoadingSim(false);
    }
  };

  const fmtIDR = (n?: number) =>
    (n === undefined ? "-" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n));

  return (
    <div className="space-y-6">
      {/* Top Controls / Quick Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-primary-700">Dashboard</h2>
        <div className="flex gap-2">
          <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => onNavigate("goals")}>
            <Goal className="w-4 h-4 mr-2" /> View Goals
          </Button>
          <Button variant="secondary" onClick={() => onNavigate("transactions")}>
            <Receipt className="w-4 h-4 mr-2" /> Transactions
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Portfolio Performance Summary */}
        <motion.div className="lg:col-span-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-5 rounded-2xl shadow-md bg-gradient-to-br from-card to-primary-50/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                <div className="text-2xl text-primary-700 mt-1">{fmtIDR(portfolio?.totalValue)}</div>
                <div className="mt-2 inline-flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{Math.round((portfolio?.monthlyGrowthPct || 0) * 1000) / 10}% this month
                </div>
              </div>
              <LineChart className="w-5 h-5 text-primary-600" />
            </div>
            <div className="mt-4">
              <svg width="100%" height="56" viewBox="0 0 160 48" preserveAspectRatio="none" className="text-primary-500">
                <path d={sparkPath} fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            {/* Allocation mini pie */}
            <div className="mt-4 flex items-center gap-6">
              <div className="relative w-20 h-20">
                {/* simple conic pie via SVG arcs */}
                <svg viewBox="0 0 32 32" className="w-20 h-20">
                  {(() => {
                    const [s, b, p] = allocationAngles; // percentages
                    const seg = (start: number, pct: number, color: string) => {
                      const a = (start / 100) * 2 * Math.PI;
                      const bA = ((start + pct) / 100) * 2 * Math.PI;
                      const r = 16;
                      const x1 = 16 + r * Math.cos(a), y1 = 16 + r * Math.sin(a);
                      const x2 = 16 + r * Math.cos(bA), y2 = 16 + r * Math.sin(bA);
                      const large = pct > 50 ? 1 : 0;
                      return <path key={`${start}-${pct}`} d={`M16,16 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={color} />;
                    };
                    return [
                      seg(0, s, "#2563eb"),
                      seg(s, b, "#10b981"),
                      seg(s + b, p, "#f59e0b"),
                    ];
                  })()}
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div><div className="text-muted-foreground">Stocks</div><div className="text-foreground font-medium">{portfolio?.allocation.stocks}%</div></div>
                <div><div className="text-muted-foreground">Bonds</div><div className="text-foreground font-medium">{portfolio?.allocation.bonds}%</div></div>
                <div><div className="text-muted-foreground">Property</div><div className="text-foreground font-medium">{portfolio?.allocation.property}%</div></div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Risk Profile Summary */}
        <motion.div className="lg:col-span-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <Card className="p-5 rounded-2xl shadow-md bg-gradient-to-br from-card to-accent-50/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-muted-foreground">Risk Profile</span>
              </div>
              <PieChart className="w-5 h-5 text-primary-600" />
            </div>
            <div className="mt-3 text-xl">
              {risk?.type || userData?.riskProfile || "Balanced"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Expected Return: {risk?.expectedReturn}</div>
            <p className="text-sm mt-3 text-foreground/80">{risk?.description}</p>
          </Card>
        </motion.div>
      </div>

      {/* What-If Simulator */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-5 rounded-2xl shadow-md">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary-600" />
            <h3 className="text-primary-700">What-If Simulator</h3>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Monthly Income</label>
              <input type="number" className="mt-1 w-full h-10 rounded-md border p-2 bg-background" value={income}
                     onChange={(e) => setIncome(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Monthly Expense</label>
              <input type="number" className="mt-1 w-full h-10 rounded-md border p-2 bg-background" value={expense}
                     onChange={(e) => setExpense(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-primary-600 hover:bg-primary-700" onClick={runSimulation} disabled={loadingSim}>
                {loadingSim ? "Simulating..." : (<><ArrowRight className="w-4 h-4 mr-2" /> Simulate</>)}
              </Button>
            </div>
          </div>
          {simResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="mt-4 text-sm text-foreground/90">
              {simResult}
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}