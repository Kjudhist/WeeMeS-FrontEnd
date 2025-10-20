import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, Home, Building, ArrowRight, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface PropertyPortfolioCondensedProps {
  onViewMore: () => void;
}

export function PropertyPortfolioCondensed({ onViewMore }: PropertyPortfolioCondensedProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const properties = [
    {
      name: "Primary Residence",
      location: "Manhattan, NY",
      value: 950000,
      change: 2.1,
      icon: Home
    },
    {
      name: "Investment Property",
      location: "Brooklyn, NY",
      value: 680000,
      change: 4.5,
      icon: Building
    }
  ];

  return (
    <Card className="p-5 md:p-6 bg-gradient-to-br from-card via-card to-secondary-50/20 border border-border/50 shadow-lg h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-secondary-600 to-secondary-700">
            <Building className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-primary-700">Property Portfolio</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewMore} 
          className="text-xs group hover:bg-primary-50 transition-all duration-300"
        >
          View All
          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Total Value Summary */}
        <motion.div 
          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-secondary-100/50 to-secondary-50/30 border border-secondary-200/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary-200/50">
              <Home className="w-5 h-5 text-secondary-700" />
            </div>
            <span className="text-sm text-secondary-600">Total Value</span>
          </div>
          <div className="text-right">
            <div className="text-foreground">{formatCurrency(2130000)}</div>
            <motion.div 
              className="text-xs text-success flex items-center gap-1 justify-end"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="w-3 h-3" />
              +3.8%
            </motion.div>
          </div>
        </motion.div>
        
        {/* Individual Properties */}
        <div className="space-y-3">
          {properties.map((property, index) => {
            const Icon = property.icon;
            return (
              <motion.div 
                key={property.name}
                className="p-3 rounded-lg bg-gradient-to-r from-secondary-50/50 to-transparent border border-secondary-200/30 hover:border-secondary-300/50 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary-100 group-hover:bg-secondary-200 transition-colors">
                      <Icon className="w-4 h-4 text-secondary-700" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground mb-0.5">{property.name}</div>
                      <div className="flex items-center gap-1 text-xs text-secondary-500">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3" />
                    +{property.change}%
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className="text-sm text-foreground">{formatCurrency(property.value)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="text-xs text-secondary-500 text-center pt-1 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-500"></span>
          +1 more property
        </div>
      </div>
    </Card>
  );
}
