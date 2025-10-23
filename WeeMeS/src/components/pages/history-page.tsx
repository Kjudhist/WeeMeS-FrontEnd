import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Calendar, Filter, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { motion } from "motion/react";
import { fetchTransactionHistory, type TransactionHistoryItem } from "../../service/handler";

function formatIDR(amount: number | undefined) {
  if (amount == null) return "-";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatUnits(units: number | undefined) {
  if (units == null) return "-";
  return units.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 6 });
}

function statusBadgeCls(status?: string) {
  switch (status) {
    case 'settled':
      return 'bg-success/10 text-success border-success/20';
    case 'pending':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'rejected':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-secondary-100 text-secondary-600';
  }
}

export function HistoryPage() {
  const [items, setItems] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const ud = JSON.parse(localStorage.getItem('userData') || 'null');
    const customerId: string | undefined = ud?.customerId;
    if (!customerId) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken') || undefined;
        const resp = await fetchTransactionHistory(customerId, token);
        if (resp.success && Array.isArray(resp.data)) {
          // Normalize fields from backend (e.g., BUY/SELL, SETTLED/PENDING, navDate/createdAt)
          const normalized = resp.data.map((x: any) => ({
            transactionId: x.transactionId ?? x.id ?? x.txId,
            date: x.navDate || x.createdAt || x.date,
            type: (x.type || '').toString().toLowerCase(),
            productName: x.productName || x.idProduct || x.productId,
            amount: x.amount,
            units: x.settledUnits ?? x.units,
            navPrice: x.navPrice ?? x.nav,
            platform: x.platform,
            status: (x.status || '').toString().toLowerCase(),
          }));
          // Only show pending and settled
          const filtered = normalized.filter(x => x.status === 'pending' || x.status === 'settled');
          setItems(filtered);
        } else {
          setItems([]);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = items.filter(tx => {
    const s = search.toLowerCase();
    return (
      (tx.transactionId || '').toLowerCase().includes(s) ||
      (tx.productName || '').toLowerCase().includes(s) ||
      (tx.status || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-5 md:p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-700">History</h2>
            <p className="text-sm text-secondary-600">Successful and pending transactions</p>
          </div>
          <div className="text-sm text-primary-700">{items.length} records</div>
        </div>
      </Card>

      {/* History Table */}
      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary-700">Transaction History</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-secondary-600">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm text-secondary-600">ID</th>
                  <th className="text-left py-3 px-2 text-sm text-secondary-600">Date</th>
                  <th className="text-left py-3 px-2 text-sm text-secondary-600">Type</th>
                  <th className="text-left py-3 px-2 text-sm text-secondary-600">Product</th>
                  <th className="text-right py-3 px-2 text-sm text-secondary-600">Amount</th>
                  <th className="text-right py-3 px-2 text-sm text-secondary-600">Units</th>
                  <th className="text-right py-3 px-2 text-sm text-secondary-600">NAV</th>
                  <th className="text-center py-3 px-2 text-sm text-secondary-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, index) => (
                  <motion.tr
                    key={tx.transactionId || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border/50 hover:bg-secondary-50/50 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-primary-600">{tx.transactionId}</td>
                    <td className="py-3 px-2 text-sm text-secondary-600">{tx.date}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={tx.type === 'buy' ? 'text-primary-700' : 'text-accent-700'}>
                        {tx.type === 'buy' ? (
                          <><ArrowDownToLine className="w-3 h-3 mr-1" /> Buy</>
                        ) : (
                          <><ArrowUpFromLine className="w-3 h-3 mr-1" /> Sell</>
                        )}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-foreground max-w-xs truncate">{tx.productName}</td>
                    <td className="py-3 px-2 text-sm text-right text-foreground">{formatIDR(tx.amount)}</td>
                    <td className="py-3 px-2 text-sm text-right text-secondary-600">{formatUnits(tx.units)}</td>
                    <td className="py-3 px-2 text-sm text-right text-secondary-600">{tx.navPrice?.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge className={statusBadgeCls(tx.status)}>
                        {(tx.status || '').charAt(0).toUpperCase() + (tx.status || '').slice(1)}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-sm text-secondary-600">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
