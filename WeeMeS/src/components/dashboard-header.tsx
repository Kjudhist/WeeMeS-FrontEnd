import { useState, useEffect } from "react";
import { User, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import logo from '../assets/Logo.png';
import { motion } from "motion/react";

export function DashboardHeader() {
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Read user's full name from localStorage
  const displayName = (() => {
    const name = localStorage.getItem("userName");
    if (name && name.trim().length > 0) return name;
    try {
      const ud = JSON.parse(localStorage.getItem("userData") || "null");
      if (ud?.name) return ud.name as string;
    } catch {}
    return "User";
  })();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

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
          <h1 className="text-lg md:text-xl text-primary-700">{getGreeting()}, {displayName}</h1>
          <p className="text-xs md:text-sm text-secondary-500">Welcome back to WeeMeS</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary-50 border border-primary-200 text-primary-700">
          <Clock className="w-4 h-4" />
          <span className="text-sm tabular-nums">{timeStr}</span>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-primary-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <AvatarFallback className="bg-gradient-to-br from-primary-600 to-primary-700 text-primary-foreground">
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </div>
    </header>
  </>
  );
}
