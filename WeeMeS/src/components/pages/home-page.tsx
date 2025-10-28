import { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { TrendingUp, Goal } from "lucide-react";
import { motion } from "motion/react";
import { fetchDashboardSummary, fetchDashboardTrend, type DashboardTrend } from "../../service/handler";
import { toast } from "sonner";

interface HomePageProps {
  onNavigate: (page: string) => void;
  userData?: any;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [totalValue, setTotalValue] = useState<number | null>(0);
  const [trend, setTrend] = useState<number[]>([0, 0]);
  const [loading, setLoading] = useState(true);

  // Load dashboard summary + trend from gateway (8080)
  useEffect(() => {
    const ud = JSON.parse(localStorage.getItem("userData") || "null");
    // Penambahan variable get token dri local storage *edited by ivan sebagai penanda*
    const token = localStorage.getItem('authToken') || undefined;
    const customerId: string | undefined = ud?.customerId || (import.meta as any)?.env?.VITE_DEMO_CUSTOMER_ID || '21dc1b65-2dff-4c9c-8a44-2f62e6f0e0d1';
    (async () => {
      try {
        if (!customerId) {
          // Fallback demo if no user info yet
          setTotalValue(0);
          setTrend([0, 0]);
          return;
        }
        const [sum, tr] = await Promise.all([
          fetchDashboardSummary(customerId, token),           // Penambahan Token di Fetching *edited by ivan sebagai penanda*
          fetchDashboardTrend(customerId, 30, token),         // Penambahan Token di Fetching *edited by ivan sebagai penanda*
        ]);
        if (sum?.success && sum.data) setTotalValue(Number((sum.data as any)?.totalValue ?? 0));
        else {
          setTotalValue(0);
          if (sum?.messages?.length) toast.error(sum.messages.join(", "));
        }
        if (tr?.success && (tr.data as any)?.points?.length) {
          setTrend(((tr.data as DashboardTrend).points || []).map(p => Number(p.value || 0)));
        } else {
          setTrend([0, 0]);
          if (tr?.messages?.length) toast.error(tr.messages.join(", "));
        }
      } catch (e) {
        // Graceful fallback to ensure the UI renders
        setTotalValue(0);
        setTrend([0, 0]);
        const msg = e instanceof Error ? e.message : 'Failed to load dashboard';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sparkPath = useMemo(() => {
    if (!trend?.length) return "";
    const data = trend;
    const w = 160, h = 48, pad = 2;
    const min = Math.min(...data), max = Math.max(...data);
    const scaleX = (i: number) => pad + (i * (w - 2 * pad)) / (data.length - 1);
    const scaleY = (v: number) => {
      if (max === min) return h / 2;
      return h - pad - ((v - min) * (h - 2 * pad)) / (max - min);
    };
    return data.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(v)}`).join(" ");
  }, [trend]);

  const fmtIDR = (n?: number | null) =>
    (n == null ? "-" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n));

  return (
    <div className="space-y-6">
      {/* Top Controls / Quick Action */}
      <div className="flex items-center justify-between">
        <h2 className="text-primary-700">Dashboard</h2>
        <div className="flex gap-2">
          <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => onNavigate("goals")}>
            <Goal className="w-4 h-4 mr-2" /> View Goals
          </Button>
        </div>
      </div>

      {/* Wealth + Trend */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-5 rounded-2xl shadow-md bg-gradient-to-br from-card to-primary-50/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Wealth</div>
              <div className="text-2xl text-primary-700 mt-1">{fmtIDR(totalValue)}</div>
              {loading && (
                <div className="text-xs text-muted-foreground mt-1">Loading...</div>
              )}
              {!!trend.length && (
                <div className="mt-2 inline-flex items-center text-sm text-green-600">
                  {/* <TrendingUp className="w-4 h-4 mr-1" />
                  {(() => {
                    const first = trend[0], last = trend[trend.length - 1];
                    const pct = first ? ((last - first) / first) * 100 : 0;
                    return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}% in last 30d`;
                  })()} */}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <svg width="100%" height="80" viewBox="0 0 160 60" preserveAspectRatio="none" className="text-primary-500">
              <path d={sparkPath} fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}