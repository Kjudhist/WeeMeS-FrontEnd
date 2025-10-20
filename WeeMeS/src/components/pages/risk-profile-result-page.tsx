import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import {
  Shield,
  TrendingUp,
  AlertCircle,
  Target,
  Clock,
  Check,
  ArrowRight,
  Award
} from "lucide-react";
import logo from 'figma:asset/5be61660b702baf053a25ca30a76685e3f38b680.png';
import { useLocation } from "react-router-dom";

interface RiskProfileResultPageProps {
  riskProfile?: string;
  onContinue?: () => void;
  insight?: string;
}

export function RiskProfileResultPage({ riskProfile: propRiskProfile, onContinue: propOnContinue, insight: propInsight }: RiskProfileResultPageProps) {
  const location = useLocation();
  const { riskProfile: locationRiskProfile, insight: locationInsight } = location.state || {};

  // Use props if provided, otherwise fall back to location.state
  const riskProfile = propRiskProfile || locationRiskProfile;
  const insight = propInsight || locationInsight;

  const onContinue = propOnContinue || (() => {
    console.log("Navigating to Dashboard...");
    // Add navigation logic here if needed
  });

  const profileData = {
    Conservative: {
      color: "blue-600",
      bgColor: "blue-100",
      gradient: "from-blue-500 to-blue-600",
      icon: Shield,
      title: "Conservative Investor",
      description: "You prefer stability and capital preservation over high returns. You're comfortable with lower-risk investments.",
      characteristics: [
        "Focus on capital preservation",
        "Lower risk tolerance",
        "Steady, predictable returns",
        "Long-term stable growth"
      ],
      recommendations: [
        "Government bonds and fixed deposits",
        "Conservative mutual funds",
        "Dividend-paying stocks",
        "Money market funds"
      ]
    },
    Moderate: {
      color: "amber-600",
      bgColor: "amber-100",
      gradient: "from-amber-500 to-amber-600",
      icon: Target,
      title: "Moderate Investor",
      description: "You seek a balance between growth and stability. You can handle moderate market fluctuations for better returns.",
      characteristics: [
        "Balanced risk-reward approach",
        "Diversified portfolio",
        "Medium-term investment horizon",
        "Comfortable with volatility"
      ],
      recommendations: [
        "Balanced mutual funds",
        "Mix of stocks and bonds",
        "Index funds",
        "Real estate investment trusts"
      ]
    },
    Aggressive: {
      color: "red-600",
      bgColor: "red-100",
      gradient: "from-red-500 to-red-600",
      icon: TrendingUp,
      title: "Aggressive Investor",
      description: "You aim for maximum returns and are willing to take on higher risk. You have a long investment horizon and can weather market volatility.",
      characteristics: [
        "High growth potential focus",
        "Higher risk tolerance",
        "Long-term investment horizon",
        "Active portfolio management"
      ],
      recommendations: [
        "Growth stocks and equity funds",
        "Emerging market investments",
        "High-yield bonds",
        "Alternative investments"
      ]
    }
  };

  const data = profileData[riskProfile as keyof typeof profileData] || profileData.Moderate;
  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-accent-50/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl relative z-10"
      >
        <Card className="p-8 md:p-10 shadow-2xl border-2 border-primary-100/50 bg-card/95 backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center mb-6">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center border-2 border-primary-200 shadow-lg">
                <img src={logo} alt="WeeMeS Logo" className="w-12 h-12 object-contain" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-5 h-5 text-success" />
                <h2 className="text-2xl text-foreground">Profile Complete!</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Your investment risk profile has been determined
              </p>
            </motion.div>
          </div>

          {/* Risk Profile Result */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${data.gradient} p-8 mb-6 shadow-xl`}
          >
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-3xl mb-2">{data.title}</h3>
                <p className="text-white/90 text-sm max-w-xl mx-auto">
                  {data.description}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Characteristics and Recommendations */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Characteristics */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-5 h-full border-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <h4>Your Characteristics</h4>
                </div>
                <ul className="space-y-3">
                  {data.characteristics.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-5 h-full border-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30">
                    <AlertCircle className="w-5 h-5 text-accent" />
                  </div>
                  <h4>Recommended Investments</h4>
                </div>
                <ul className="space-y-3">
                  {data.recommendations.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Insight Section */}
          {insight && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mb-6"
            >
              <Card className="p-4 bg-accent-50/50 dark:bg-accent-900/20 border-accent/30">
                <div className="text-sm">
                  <h4 className="text-accent mb-2">Additional Insights</h4>
                  <p className="text-muted-foreground">{insight}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Information Banner */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Card className="p-4 bg-primary-50/50 dark:bg-primary-900/20 border-primary/30 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-foreground mb-1">
                    Your risk profile helps us provide personalized investment recommendations and portfolio strategies tailored to your goals.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    You can always review and update your profile from your account settings.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <Button
              onClick={onContinue}
              className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all gap-2"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </Card>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          🎉 Welcome to WeeMeS - Your wealth management journey starts now!
        </motion.p>
      </motion.div>
    </div>
  );
}
