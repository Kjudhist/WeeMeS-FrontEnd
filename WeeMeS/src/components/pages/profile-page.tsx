import { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
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
  Shield, 
  LogOut,
  ChevronRight,
  Award,
  Lock
} from "lucide-react";
import { fetchDashboardSummary, fetchGoalsTracking, changePassword, type DashboardSummary, type GoalTrackingItem } from "../../service/handler";
import { toast } from "sonner";

interface ProfilePageProps {
  onLogout?: () => void;
  userData?: any;
}

export function ProfilePage({ onLogout, userData }: ProfilePageProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const profile = useMemo(() => {
    if (userData) return userData;
    try { return JSON.parse(localStorage.getItem('userData') || 'null') || {}; } catch { return {}; }
  }, [userData]);

  const [portfolioValue, setPortfolioValue] = useState<number | null>(null);
  const [activeGoals, setActiveGoals] = useState<number | null>(null);

  useEffect(() => {
    const customerId: string | undefined = profile?.customerId;
    if (!customerId) return;
    (async () => {
      try {
        const [sum, tracking] = await Promise.all([
          fetchDashboardSummary(customerId),
          fetchGoalsTracking(customerId),
        ]);
        if (sum?.success && sum.data) setPortfolioValue(Number((sum.data as DashboardSummary).totalValue ?? 0));
        if (tracking?.success && Array.isArray(tracking.data)) setActiveGoals((tracking.data as GoalTrackingItem[]).length);
      } catch {
        // leave as nulls on failure
      }
    })();
  }, [profile?.customerId]);

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
    { icon: Lock, label: 'Change Password', hasChevron: true },
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
            <h2>{profile?.name || '-'}</h2>
            <p className="text-sm text-muted-foreground">{profile?.email || '-'}</p>
            {profile?.memberSince && (
              <p className="text-xs text-muted-foreground">Member since {profile.memberSince}</p>
            )}
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
            <div className="font-semibold">{portfolioValue == null ? '-' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(portfolioValue)}</div>
            <div className="text-xs text-muted-foreground">Portfolio Value</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <div className="font-semibold">{activeGoals == null ? '-' : activeGoals}</div>
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
                onClick={() => {
                  if (item.label === 'Change Password') setShowChangePwd(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.hasChevron && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Change Password Placeholder Dialog */}
      <AlertDialog open={showChangePwd} onOpenChange={(open) => { setShowChangePwd(open); if (!open) { setCurPwd(""); setNewPwd(""); setConfirmPwd(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              This will trigger a password change for your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">Current Password</label>
              <Input type="password" value={curPwd} onChange={(e) => setCurPwd(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">New Password</label>
              <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Confirm New Password</label>
              <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="mt-1" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (changingPwd) return;
                const customerId: string | undefined = profile?.customerId;
                if (!customerId) { toast.error('Missing customer id'); return; }
                if (!curPwd || !newPwd || !confirmPwd) { toast.error('Please fill all fields'); return; }
                if (newPwd !== confirmPwd) { toast.error('New password confirmation does not match'); return; }
                setChangingPwd(true);
                try {
                  const token = localStorage.getItem('authToken') || undefined;
                  const resp = await changePassword(customerId, { currentPassword: curPwd, newPassword: newPwd, confirmNewPassword: confirmPwd }, token);
                  if (resp?.success) {
                    toast.success(resp.messages?.join(', ') || 'Change password triggered');
                    setShowChangePwd(false);
                  } else {
                    toast.error(resp?.messages?.join(', ') || 'Failed to change password');
                  }
                } catch (e: any) {
                  toast.error(e?.message || 'Failed to change password');
                } finally {
                  setChangingPwd(false);
                }
              }}
            >{changingPwd ? 'Processing...' : 'Continue'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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