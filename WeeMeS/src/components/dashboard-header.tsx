import { useState } from "react";
import { Bell, Settings, User, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { NotificationsPanel } from "./notifications-panel";
import logo from 'figma:asset/5be61660b702baf053a25ca30a76685e3f38b680.png';
import { motion } from "motion/react";

interface DashboardHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function DashboardHeader({ isDark, onToggleTheme }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 md:p-6 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <motion.div 
          className="md:hidden w-8 h-8 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={logo} alt="WeeMeS Logo" className="w-7 h-7 object-contain" />
        </motion.div>
        <div>
          <h1 className="text-lg md:text-xl text-primary-700">{getGreeting()}, Sarah</h1>
          <p className="text-xs md:text-sm text-secondary-500">Welcome back to WeeMeS</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleTheme}
          className="relative hover:bg-primary-50 transition-all duration-300 group"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
            ) : (
              <Sun className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
            )}
          </motion.div>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowNotifications(true)}
          className="relative hover:bg-primary-50 transition-all duration-300 group"
        >
          <Bell className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
          <motion.span 
            className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-card"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-primary-50 transition-all duration-300 group"
        >
          <Settings className="w-4 h-4 text-primary-600 group-hover:text-primary-700 group-hover:rotate-45 transition-transform duration-300" />
        </Button>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-primary-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <AvatarFallback className="bg-gradient-to-br from-primary-600 to-primary-700 text-primary-foreground">
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </div>
    </header>

    <NotificationsPanel 
      isOpen={showNotifications}
      onClose={() => setShowNotifications(false)}
    />
  </>
  );
}
