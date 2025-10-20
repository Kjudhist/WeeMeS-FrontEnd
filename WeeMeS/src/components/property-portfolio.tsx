import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, TrendingUp, TrendingDown } from "lucide-react";

interface Property {
  id: string;
  name: string;
  location: string;
  value: number;
  monthlyChange: number;
  yearlyChange: number;
  type: string;
  status: "owned" | "mortgage" | "investment";
}

export function PropertyPortfolio() {
  const properties: Property[] = [
    {
      id: "1",
      name: "Primary Residence",
      location: "Manhattan, NY",
      value: 950000,
      monthlyChange: 2.1,
      yearlyChange: 8.5,
      type: "Condo",
      status: "mortgage"
    },
    {
      id: "2",
      name: "Beach House",
      location: "Hamptons, NY", 
      value: 700000,
      monthlyChange: 1.8,
      yearlyChange: 12.3,
      type: "House",
      status: "owned"
    },
    {
      id: "3",
      name: "Rental Property",
      location: "Brooklyn, NY",
      value: 480000,
      monthlyChange: -0.5,
      yearlyChange: 3.2,
      type: "Apartment",
      status: "investment"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      owned: "bg-green-100 text-green-800",
      mortgage: "bg-blue-100 text-blue-800",
      investment: "bg-purple-100 text-purple-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const totalValue = properties.reduce((sum, property) => sum + property.value, 0);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3>Property Portfolio</h3>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="font-semibold">{formatCurrency(totalValue)}</div>
        </div>
      </div>

      <div className="space-y-3">
        {properties.map((property) => (
          <Card key={property.id} className="p-3 border-l-4 border-l-primary/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{property.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(property.status)}`}
                  >
                    {property.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  {property.location} • {property.type}
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-semibold">{formatCurrency(property.value)}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${property.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {property.monthlyChange >= 0 ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {property.monthlyChange >= 0 ? '+' : ''}{property.monthlyChange}% (1M)
                    </div>
                    <div className={`flex items-center gap-1 ${property.yearlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {property.yearlyChange >= 0 ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {property.yearlyChange >= 0 ? '+' : ''}{property.yearlyChange}% (1Y)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}