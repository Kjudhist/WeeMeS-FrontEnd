import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { } from "lucide-react";
import { fetchProductsByRisk, buyProduct, type ProductItem, type RiskProfile } from "../../service/handler";
import { toast } from "sonner";

export function PortfolioPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBuy, setShowBuy] = useState(false);
  const [selected, setSelected] = useState<ProductItem | null>(null);
  const [amount, setAmount] = useState<number>(100000);
  const [goalId, setGoalId] = useState<string>("");

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

  const withinTradingHours = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const afterOpen = h > 9 || (h === 9 && m >= 0);
    const beforeClose = h < 16; // before 16:00
    return afterOpen && beforeClose;
  };

  const openBuy = (p: ProductItem) => {
    setSelected(p);
    setAmount(100000);
    // try prefill goalId from localStorage if exists
    try {
      const ud = JSON.parse(localStorage.getItem("userData") || "null");
      if (ud?.lastGoalId) setGoalId(ud.lastGoalId as string);
    } catch {}
    setShowBuy(true);
  };

  const handleBuy = async () => {
    if (!selected) return;
    if (!withinTradingHours()) {
      toast.error("Pembelian hanya bisa dilakukan antara 09:00 - 16:00");
      return;
    }
    try {
      const token = localStorage.getItem("authToken") || undefined;
      const ud = JSON.parse(localStorage.getItem("userData") || "{}");
      const customerId = ud?.customerId || "00000000-0000-0000-0000-000000000000";
      if (!goalId) {
        toast.error("Mohon isi Goal ID terlebih dahulu");
        return;
      }
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
            <h2 className="text-primary-700">Investment Portfolio</h2>
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
                <Label htmlFor="goalId">Goal Name</Label>
                <Input id="goalId" type="text" placeholder="e.g., 02c2b13c-..." value={goalId} onChange={(e) => setGoalId(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                {!withinTradingHours() && (
                  <p className="text-xs text-destructive">Pembelian hanya 09:00 - 16:00</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuy(false)}>Cancel</Button>
            <Button onClick={handleBuy} disabled={!withinTradingHours() || !amount || amount <= 0 || !goalId} className="bg-primary-700 hover:bg-primary-800">Buy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
