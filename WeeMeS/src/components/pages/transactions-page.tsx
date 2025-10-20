import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Calendar, 
  TrendingUp,
  Search,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { motion } from "motion/react";

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  product: string;
  platform: string;
  amount: number;
  units: number;
  nav: number;
  settlementDate: string;
  status: 'pending' | 'settled' | 'rejected';
  date: string;
}

export function TransactionsPage() {
  const [activeTab, setActiveTab] = useState('buy');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states for Buy
  const [buyProduct, setBuyProduct] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [buyEstimatedNav, setBuyEstimatedNav] = useState('1250.00');
  const [buySettlementDate, setBuySettlementDate] = useState('');
  
  // Form states for Sell
  const [sellProduct, setSellProduct] = useState('');
  const [sellUnits, setSellUnits] = useState('');
  const [sellEstimatedNav, setSellEstimatedNav] = useState('1250.00');
  const [sellSettlementDate, setSellSettlementDate] = useState('');

  const mockTransactions: Transaction[] = [
    {
      id: 'TRX001',
      type: 'buy',
      product: 'Sucorinvest Sharia Equity Fund',
      platform: 'Bareksa',
      amount: 5000000,
      units: 4000,
      nav: 1250,
      settlementDate: '2025-10-15',
      status: 'settled',
      date: '2025-10-13'
    },
    {
      id: 'TRX002',
      type: 'sell',
      product: 'Mandiri Investa Atraktif',
      platform: 'Bibit',
      amount: 3500000,
      units: 2800,
      nav: 1250,
      settlementDate: '2025-10-16',
      status: 'pending',
      date: '2025-10-14'
    },
    {
      id: 'TRX003',
      type: 'buy',
      product: 'Schroder Dana Prestasi Plus',
      platform: 'Ajaib',
      amount: 2000000,
      units: 1600,
      nav: 1250,
      settlementDate: '2025-10-17',
      status: 'settled',
      date: '2025-10-13'
    },
    {
      id: 'TRX004',
      type: 'buy',
      product: 'BNI-AM Dana Likuid',
      platform: 'Tokopedia',
      amount: 1500000,
      units: 1200,
      nav: 1250,
      settlementDate: '2025-10-14',
      status: 'rejected',
      date: '2025-10-12'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
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
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buy transaction submitted', { buyProduct, buyAmount, buyEstimatedNav, buySettlementDate });
    // Reset form
    setBuyProduct('');
    setBuyAmount('');
    setBuySettlementDate('');
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sell transaction submitted', { sellProduct, sellUnits, sellEstimatedNav, sellSettlementDate });
    // Reset form
    setSellProduct('');
    setSellUnits('');
    setSellSettlementDate('');
  };

  const filteredTransactions = mockTransactions.filter(tx =>
    tx.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="p-5 md:p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-primary-700">Transactions</h2>
            <p className="text-sm text-secondary-600">Buy and sell mutual funds</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-primary-700">Total: {mockTransactions.length}</span>
          </div>
        </div>
      </Card>

      {/* Transaction Form */}
      <Card className="p-5 md:p-6">
        <h3 className="mb-4 text-primary-700">New Transaction</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="buy" className="flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              Subscription (Buy)
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4" />
              Redemption (Sell)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy">
            <form onSubmit={handleBuySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-product">Product</Label>
                  <Select value={buyProduct} onValueChange={setBuyProduct}>
                    <SelectTrigger id="buy-product">
                      <SelectValue placeholder="Select mutual fund" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sucorinvest">Sucorinvest Sharia Equity Fund</SelectItem>
                      <SelectItem value="mandiri">Mandiri Investa Atraktif</SelectItem>
                      <SelectItem value="schroder">Schroder Dana Prestasi Plus</SelectItem>
                      <SelectItem value="bni">BNI-AM Dana Likuid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buy-amount">Amount (IDR)</Label>
                  <Input
                    id="buy-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buy-nav">Estimated NAV</Label>
                  <Input
                    id="buy-nav"
                    type="text"
                    value={buyEstimatedNav}
                    readOnly
                    className="bg-secondary-50"
                  />
                  <p className="text-xs text-muted-foreground">Based on last EOD (End of Day) price</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buy-settlement">Settlement Date</Label>
                  <Input
                    id="buy-settlement"
                    type="date"
                    value={buySettlementDate}
                    onChange={(e) => setBuySettlementDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {buyAmount && (
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <p className="text-sm text-secondary-600 mb-1">Estimated Units</p>
                  <p className="text-primary-700">
                    {Math.floor(parseFloat(buyAmount || '0') / parseFloat(buyEstimatedNav)).toLocaleString()} units
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full bg-primary-700 hover:bg-primary-800">
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Submit Buy Order
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="sell">
            <form onSubmit={handleSellSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sell-product">Product</Label>
                  <Select value={sellProduct} onValueChange={setSellProduct}>
                    <SelectTrigger id="sell-product">
                      <SelectValue placeholder="Select mutual fund" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sucorinvest">Sucorinvest Sharia Equity Fund</SelectItem>
                      <SelectItem value="mandiri">Mandiri Investa Atraktif</SelectItem>
                      <SelectItem value="schroder">Schroder Dana Prestasi Plus</SelectItem>
                      <SelectItem value="bni">BNI-AM Dana Likuid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sell-units">Units to Sell</Label>
                  <Input
                    id="sell-units"
                    type="number"
                    placeholder="Enter units"
                    value={sellUnits}
                    onChange={(e) => setSellUnits(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sell-nav">Estimated NAV</Label>
                  <Input
                    id="sell-nav"
                    type="text"
                    value={sellEstimatedNav}
                    readOnly
                    className="bg-secondary-50"
                  />
                  <p className="text-xs text-muted-foreground">Based on last EOD (End of Day) price</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sell-settlement">Settlement Date</Label>
                  <Input
                    id="sell-settlement"
                    type="date"
                    value={sellSettlementDate}
                    onChange={(e) => setSellSettlementDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {sellUnits && (
                <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
                  <p className="text-sm text-secondary-600 mb-1">Estimated Proceeds</p>
                  <p className="text-accent-700">
                    {formatCurrency(parseFloat(sellUnits || '0') * parseFloat(sellEstimatedNav))}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full bg-accent-600 hover:bg-accent-700">
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                Submit Sell Order
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Transaction History */}
      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary-700">Transaction History</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm text-secondary-600">ID</th>
                <th className="text-left py-3 px-2 text-sm text-secondary-600">Date</th>
                <th className="text-left py-3 px-2 text-sm text-secondary-600">Type</th>
                <th className="text-left py-3 px-2 text-sm text-secondary-600">Product</th>
                <th className="text-left py-3 px-2 text-sm text-secondary-600">Platform</th>
                <th className="text-right py-3 px-2 text-sm text-secondary-600">Amount</th>
                <th className="text-right py-3 px-2 text-sm text-secondary-600">Units</th>
                <th className="text-center py-3 px-2 text-sm text-secondary-600">Settlement</th>
                <th className="text-center py-3 px-2 text-sm text-secondary-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-secondary-50/50 transition-colors"
                >
                  <td className="py-3 px-2 text-sm text-primary-600">{tx.id}</td>
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
                  <td className="py-3 px-2 text-sm text-foreground max-w-xs truncate">{tx.product}</td>
                  <td className="py-3 px-2 text-sm text-secondary-600">{tx.platform}</td>
                  <td className="py-3 px-2 text-sm text-right text-foreground">{formatCurrency(tx.amount)}</td>
                  <td className="py-3 px-2 text-sm text-right text-secondary-600">{tx.units.toLocaleString()}</td>
                  <td className="py-3 px-2 text-sm text-center text-secondary-600">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {tx.settlementDate}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-warning/5 border-warning/20">
        <div className="flex gap-3">
          <div className="text-warning">⚠️</div>
          <div className="flex-1">
            <p className="text-sm text-secondary-700">
              <strong>Important:</strong> Transaction settlements are subject to market conditions and fund availability. 
              Estimated NAV and settlement dates may vary. This is for simulation purposes only.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
