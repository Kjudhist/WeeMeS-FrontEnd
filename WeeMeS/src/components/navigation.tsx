import { Home, Target, Building, TrendingUp, User, ArrowLeftRight, Calculator } from "lucide-react";
import logo from 'figma:asset/5be61660b702baf053a25ca30a76685e3f38b680.png';
import { motion } from "motion/react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'portfolio', label: 'Portfolio', icon: Building },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'simulation', label: 'Simulator', icon: Calculator },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex flex-col h-full">
        {/* Logo/Brand Area */}
        <div className="p-6 border-b border-sidebar-border bg-gradient-to-br from-primary-50 to-primary-100/50">
          <motion.div 
            className="flex items-center gap-3 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-10 h-10 flex items-center justify-center"
              // whileHover={{ rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img src={logo} alt="WeeMeS Logo" className="w-9 h-9 object-contain" />
            </motion.div>
            <div>
              <h2 className="text-lg text-primary-700">WeeMeS</h2>
              <p className="text-xs text-secondary-500">Wealth Management</p>
            </div>
          </motion.div>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-1.5">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                    isActive 
                      ? 'text-primary-700 bg-gradient-to-r from-primary-100 to-primary-50 shadow-md border border-primary-200/50' 
                      : 'text-secondary-600 hover:text-primary-700 hover:bg-secondary-50 hover:shadow-sm'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>
        
        {/* Bottom section */}
        <div className="p-4 border-t border-border">
          <div className="px-4 py-3 rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-primary-700">Goals Progress</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">On Track</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-primary-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary-600 to-accent-500"
                  initial={{ width: 0 }}
                  animate={{ width: "58%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-xs text-primary-700">58%</span>
            </div>
            <p className="text-xs text-secondary-500 mt-2">5 active goals</p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-2xl overflow-x-auto">
        <div className="flex items-center justify-start min-w-max py-2 px-2 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className="relative flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 flex-shrink-0"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-primary-100 to-primary-50' 
                      : 'hover:bg-secondary-50'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${
                    isActive ? 'text-primary-700' : 'text-secondary-500'
                  }`} />
                </motion.div>
                <span className={`text-[10px] transition-colors duration-300 whitespace-nowrap ${
                  isActive ? 'text-primary-700' : 'text-secondary-500'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full"
                    layoutId="mobileActiveIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}
