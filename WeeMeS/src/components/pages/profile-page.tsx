import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Switch } from "../ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  FileText, 
  LogOut,
  ChevronRight,
  Award
} from "lucide-react";

interface ProfilePageProps {
  onLogout?: () => void;
  userData?: any;
}

export function ProfilePage({ onLogout, userData }: ProfilePageProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems = [
    { icon: User, label: 'Personal Information', hasChevron: true },
    { icon: Bell, label: 'Notifications', hasSwitch: true, enabled: true },
    { icon: Shield, label: 'Security & Privacy', hasChevron: true },
    { icon: CreditCard, label: 'Payment Methods', hasChevron: true },
    { icon: FileText, label: 'Statements & Reports', hasChevron: true },
    { icon: Settings, label: 'App Preferences', hasChevron: true },
  ];

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2>Sarah Johnson</h2>
            <p className="text-sm text-muted-foreground">sarah.johnson@email.com</p>
            <p className="text-xs text-muted-foreground">Premium Member since 2021</p>
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </Card>

      {/* Risk Profile Card */}
      {userData?.riskProfile && (
        <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30 border-primary-200 dark:border-primary-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary-600 shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm">Investment Risk Profile</h3>
                <Award className="w-4 h-4 text-primary-600" />
              </div>
              <div className="text-xl text-primary-700 dark:text-primary-300 mb-2">
                {userData.riskProfile}
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {userData.riskProfile === 'Conservative' && 'You prefer stability and capital preservation over high returns. Recommended: Government bonds, fixed deposits, and conservative mutual funds.'}
                {userData.riskProfile === 'Moderate' && 'You seek a balance between growth and stability. Recommended: Balanced mutual funds, mix of stocks and bonds, and index funds.'}
                {userData.riskProfile === 'Aggressive' && 'You aim for maximum returns with higher risk tolerance. Recommended: Growth stocks, equity funds, and emerging market investments.'}
              </p>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Retake Assessment
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Account Overview */}
      <Card className="p-4">
        <h3 className="mb-3">Account Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="font-semibold">$2.8M</div>
            <div className="text-xs text-muted-foreground">Portfolio Value</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="font-semibold">4</div>
            <div className="text-xs text-muted-foreground">Active Goals</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="font-semibold">3</div>
            <div className="text-xs text-muted-foreground">Properties</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="font-semibold">2.5 yrs</div>
            <div className="text-xs text-muted-foreground">Member Since</div>
          </div>
        </div>
      </Card>

      {/* Settings Menu */}
      <Card className="p-4">
        <h3 className="mb-3">Settings</h3>
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.hasSwitch && (
                    <Switch 
                      checked={item.enabled} 
                      className="scale-75" 
                    />
                  )}
                  {item.hasChevron && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Support */}
      <Card className="p-4">
        <h3 className="mb-3">Support</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3">
            <FileText className="w-4 h-4" />
            <div className="text-left">
              <div className="text-sm">Help Center</div>
              <div className="text-xs text-muted-foreground">Get help and support</div>
            </div>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3">
            <Settings className="w-4 h-4" />
            <div className="text-left">
              <div className="text-sm">Contact Support</div>
              <div className="text-xs text-muted-foreground">Reach out to our team</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Logout */}
      <Card className="p-4">
        <Button 
          variant="destructive" 
          className="w-full gap-2"
          onClick={handleLogoutClick}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </Card>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account and redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}