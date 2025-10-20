import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  X,
  Archive
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "./ui/scroll-area";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  category: 'goal' | 'portfolio' | 'market' | 'transaction';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export function NotificationsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      category: 'goal',
      title: 'Education Goal Off Track',
      message: 'Your Education Goal is off track. Consider increasing monthly contribution by Rp 500,000.',
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: '2',
      type: 'success',
      category: 'portfolio',
      title: 'NAV Increase',
      message: 'Sucorinvest Sharia Equity Fund NAV increased by 1.2% today. Current value: Rp 1,265.',
      timestamp: '4 hours ago',
      isRead: false
    },
    {
      id: '3',
      type: 'info',
      category: 'market',
      title: 'Market Update',
      message: 'Indonesian equity market closed +0.8% higher. Your equity funds may see positive returns.',
      timestamp: '6 hours ago',
      isRead: false
    },
    {
      id: '4',
      type: 'success',
      category: 'goal',
      title: 'Retirement Goal On Track',
      message: 'Great progress! Your Retirement Goal is 65% complete and on track to meet the target.',
      timestamp: '1 day ago',
      isRead: true
    },
    {
      id: '5',
      type: 'alert',
      category: 'portfolio',
      title: 'Fund Performance Alert',
      message: 'Mandiri Investa Atraktif has underperformed its benchmark by 2.5% this quarter.',
      timestamp: '1 day ago',
      isRead: true
    },
    {
      id: '6',
      type: 'success',
      category: 'transaction',
      title: 'Transaction Settled',
      message: 'Your buy order for BNI-AM Dana Likuid has been successfully settled.',
      timestamp: '2 days ago',
      isRead: true
    }
  ]);

  const getIcon = (type: string, category: string) => {
    if (category === 'goal') return Target;
    if (category === 'transaction') return CheckCircle;
    if (type === 'success') return TrendingUp;
    if (type === 'warning') return AlertTriangle;
    if (type === 'alert') return TrendingDown;
    return Bell;
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'alert':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-primary-700 bg-primary-50 border-primary-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-card shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary-50 to-accent-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary-700" />
                  <h3 className="text-primary-700">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge className="bg-primary-700 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                    <p className="text-sm text-secondary-500">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif, index) => {
                    const Icon = getIcon(notif.type, notif.category);
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            !notif.isRead
                              ? 'border-l-4 border-l-primary-600 bg-primary-50/30'
                              : 'border-l-4 border-l-transparent'
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-lg ${getColorClass(notif.type)} h-fit`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-sm text-foreground truncate">
                                  {notif.title}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notif.id);
                                  }}
                                  className="text-secondary-400 hover:text-secondary-600 transition-colors flex-shrink-0"
                                >
                                  <Archive className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs text-secondary-600 mb-2">
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {notif.category}
                                </Badge>
                                <span className="text-xs text-secondary-400">
                                  {notif.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-secondary-50">
              <p className="text-xs text-center text-secondary-500">
                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
