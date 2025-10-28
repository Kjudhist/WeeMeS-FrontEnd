import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { } from "lucide-react";
import { fetchProductsByRisk, buyProduct, fetchGoalsList, type ProductItem, type RiskProfile, type GoalsListItem } from "../../service/handler";
import { toast } from "sonner";

export function PortfolioPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBuy, setShowBuy] = useState(false);
  const [selected, setSelected] = useState<ProductItem | null>(null);
  const [amount, setAmount] = useState<number>(100000);
  const [goalId, setGoalId] = useState<string>("");
  const [goals, setGoals] = useState<GoalsListItem[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);

  const riskFromLocal = (() => {
    try {
      const ud = JSON.parse(localStorage.getItem("userData") || "null");
      return (ud?.riskProfile ?? null) as RiskProfile;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const risk = riskFromLocal;
    if (!risk) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken") || undefined;
        const resp = await fetchProductsByRisk(risk, token);
        if (resp.success) setProducts(resp.data || []);
        else setError(resp.messages?.join(", ") || "Failed to load products");
      } catch (e: any) {
        setError(e?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trading hours verification removed: buy is always available

  const openBuy = async (p: ProductItem) => {
    setSelected(p);
    setAmount(100000);
    // try prefill goalId from localStorage if exists
    try {
      const ud = JSON.parse(localStorage.getItem("userData") || "null");
      if (ud?.lastGoalId) setGoalId(ud.lastGoalId as string);
    } catch {}
    // fetch available goals for dropdown
    try {
      const ud = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId: string | undefined = ud?.customerId;
      if (userId) {
        setGoalsLoading(true);
        const token = localStorage.getItem("authToken") || undefined;
        const resp = await fetchGoalsList(userId, token);
        if (resp.success && Array.isArray(resp.data)) {
          setGoals(resp.data);
          // if no prefilled goalId, default to first
          if (!ud?.lastGoalId && resp.data.length > 0) {
            setGoalId(resp.data[0].goalId);
          }
        } else {
          toast.error(resp.messages?.join(", ") || "Failed to load goals");
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load goals");
    } finally {
      setGoalsLoading(false);
    }
    setShowBuy(true);
  };

  const handleBuy = async () => {
    if (!selected) return;
    // Trading hours check removed: allow buy any time
    try {
      const token = localStorage.getItem("authToken") || undefined;
      const ud = JSON.parse(localStorage.getItem("userData") || "{}");
      const customerId = ud?.customerId || "00000000-0000-0000-0000-000000000000";
      const resp = await buyProduct({
        customerId,
        productId: selected.productId,
        goalId: goalId,
        amount: Number(amount) || 0,
      }, token);
      if (resp.success) {
        toast.success("Order placed", { description: "Your buy order has been submitted." });
        setShowBuy(false);
      } else {
        toast.error(resp.messages?.join(", ") || "Buy failed");
      }
    } catch (e: any) {
      toast.error(e?.message || "Buy failed");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-5 md:p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-700">Products</h2>
            <p className="text-sm text-secondary-600">Discover and buy products</p>
          </div>
        </div>
      </Card>

      {/* Recommended Products (by Risk Profile) */}
      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary-700">Products for You</h3>
          {riskFromLocal && (
            <span className="text-xs text-secondary-600">Risk: {riskFromLocal}</span>
          )}
        </div>

        {loading && <p className="text-sm text-secondary-600">Loading products...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map((p) => (
              <Card key={p.productId} className="p-4 border-2 hover:border-primary-300 transition-colors">
                <div className="mb-2 text-foreground font-medium">{p.productName}</div>
                <div className="text-xs text-secondary-600 mb-1">{p.productType}</div>
                <div className="text-sm text-primary-700 mb-3">NAV: {formatCurrency(p.navPrice)}</div>
                <Button size="sm" className="bg-primary-700 hover:bg-primary-800" onClick={() => openBuy(p)}>
                  Buy
                </Button>
              </Card>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-secondary-600">No products available for your risk profile.</p>
            )}
          </div>
        )}
      </Card>

      

      {/* Buy Dialog (using ui/dialog) */}
      <Dialog open={showBuy && Boolean(selected)} onOpenChange={(open) => !open && setShowBuy(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buy Product</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-foreground font-medium">{selected.productName}</div>
                <div className="text-xs text-secondary-600">{selected.productType}</div>
                <div className="text-xs text-secondary-600 mt-1">NAV: {formatCurrency(selected.navPrice)}</div>
                <div className="text-xs text-secondary-600 mt-1">Cutoff: {selected.cutOffTime}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalId">Goal</Label>
                <Select value={goalId} onValueChange={(v) => setGoalId(v)}>
                  <SelectTrigger id="goalId">
                    <SelectValue placeholder={goalsLoading ? 'Loading goals...' : 'Select a goal'} />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((g) => (
                      <SelectItem key={g.goalId} value={g.goalId}>{g.goalName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                {/* Trading hours notice removed */}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuy(false)}>Cancel</Button>
            <Button onClick={handleBuy} disabled={!amount || amount <= 0 || !goalId} className="bg-primary-700 hover:bg-primary-800">Buy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
