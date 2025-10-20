import { useState, useEffect } from "react";
import { DashboardHeader } from "./components/dashboard-header";
import { Navigation } from "./components/navigation";
import { HomePage } from "./components/pages/home-page";
import { GoalsPageEnhanced } from "./components/pages/goals-page-enhanced";
import { PortfolioPage } from "./components/pages/portfolio-page";
import { TransactionsPage } from "./components/pages/transactions-page";
import { SimulationPage } from "./components/pages/simulation-page";
import { AnalyticsPage } from "./components/pages/analytics-page";
import { ProfilePage } from "./components/pages/profile-page";
import { LoginPage } from "./components/pages/login-page";
import { RegisterPage } from "./components/pages/register-page";
import { KYCPage } from "./components/pages/kyc-page";
import { RiskProfileResultPage } from "./components/pages/risk-profile-result-page";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [showRiskProfileResult, setShowRiskProfileResult] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    // Check if user is already authenticated and retrieve user data from local storage
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('userData');
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedUser));
    } else {
      // If not authenticated, show login page
      setIsAuthenticated(false);
      setShowLogin(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (email: string) => {
    // In a real app, you would validate credentials here
    // For demo purposes, we'll just accept any input
    console.log('Login attempt:', email);
    setIsAuthenticated(true);
    setUserData({ email }); // Store user data
    localStorage.setItem('isAuthenticated', 'true'); // Store authentication status
    localStorage.setItem('userData', JSON.stringify({ email })); // Store user data
    toast.success('Welcome back!', {
      description: 'You have successfully logged in.'
    });
  };

  const handleRegister = (newUserData: any) => {
    // Store user data and redirect to login page
    setUserData(newUserData);
    setShowRegister(false);
    setShowLogin(true); // Redirect to login page
    toast.success('Account created!', {
      description: 'Please log in to continue.'
    });
  };

  const handleKYCComplete = (kycData: any) => {
    // Merge KYC data with user data
    const completeUserData = { ...userData, ...kycData, riskProfile: kycData.riskProfile || kycData.data?.riskProfileName };
    console.log('Registration complete:', completeUserData);

    setUserData(completeUserData);
    setShowKYC(false);
    setShowRiskProfileResult(true);
  };

  const handleRiskProfileContinue = () => {
    setShowRiskProfileResult(false);
    setIsAuthenticated(true);
    
    toast.success('Welcome to WeeMeS!', {
      description: `Your ${userData.riskProfile} risk profile has been saved.`
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem('isAuthenticated'); // Clear authentication status
    localStorage.removeItem('userData'); // Clear user data
    setShowLogin(false);
    setShowRegister(false);
    setShowKYC(false);
    setCurrentPage('home');
    toast.info('Logged out', {
      description: 'You have been successfully logged out.'
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} userData={userData} />;
      case 'goals':
        return <GoalsPageEnhanced />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} userData={userData} />;
      default:
        return <HomePage onNavigate={setCurrentPage} userData={userData} />;
    }
  };

  // Show Risk Profile Results page
  if (showRiskProfileResult && userData?.riskProfile) {
    return (
      <RiskProfileResultPage 
        riskProfile={userData.riskProfile}
        onContinue={handleRiskProfileContinue}
      />
    );
  }

  // Show KYC page if in registration flow
  if (showKYC) {
    return <KYCPage onComplete={handleKYCComplete} />;
  }

  // Show register page
  if (!isAuthenticated && showRegister) {
    return (
      <RegisterPage 
        onRegister={handleRegister}
        onLoginClick={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onBack={() => setShowLogin(false)}
        onSignUp={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
    );
  }

  // Show dashboard if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30">
      {/* Desktop layout with sidebar */}
      <div className="hidden md:flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-card/95 backdrop-blur-sm border-r border-border shadow-lg">
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <DashboardHeader isDark={isDark} onToggleTheme={toggleTheme} />
          <main className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden min-h-screen pb-20">
        <div className="max-w-md mx-auto bg-card/95 backdrop-blur-sm shadow-xl min-h-screen">
          <DashboardHeader isDark={isDark} onToggleTheme={toggleTheme} />
          
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Bottom Navigation for mobile */}
        <div className="md:hidden">
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </div>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}