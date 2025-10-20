import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "motion/react";
import { 
  Target, 
  Home, 
  GraduationCap, 
  Plane, 
  Heart,
  Briefcase,
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock
} from "lucide-react";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (goal: any) => void;
  editGoal?: any;
  onEditGoal?: (goal: any) => void;
}

type GoalType = 'retirement' | 'other' | null;
type OtherGoalCategory = 'home' | 'education' | 'vacation' | 'emergency' | 'business' | 'custom';

export function AddGoalDialog({ open, onOpenChange, onAddGoal, editGoal, onEditGoal }: AddGoalDialogProps) {
  const isEditMode = !!editGoal;
  const [step, setStep] = useState<'type' | 'category' | 'form'>('type');
  const [goalType, setGoalType] = useState<GoalType>(null);
  const [category, setCategory] = useState<OtherGoalCategory>('custom');
  
  // Form states
  const [goalName, setGoalName] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  
  // Retirement specific
  const [lifeExpectancy, setLifeExpectancy] = useState('');
  const [monthlyNeeds, setMonthlyNeeds] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editGoal && open) {
      setGoalName(editGoal.title);
      setTargetYear(editGoal.deadline);
      setInitialInvestment(editGoal.current?.toString() || '');
      
      // Determine if it's a retirement goal
      if (editGoal.retirementDetails) {
        setGoalType('retirement');
        setStep('form');
        setLifeExpectancy(editGoal.retirementDetails.yearsAfterRetirement?.toString() || '');
        setMonthlyNeeds(editGoal.retirementDetails.monthlyNeeds?.toString() || '');
      } else {
        setGoalType('other');
        setStep('form');
        setTargetAmount(editGoal.target?.toString() || '');
        setCategory(editGoal.category?.toLowerCase() || 'custom');
      }
    } else if (!open) {
      resetForm();
    }
  }, [editGoal, open]);

  const resetForm = () => {
    setStep('type');
    setGoalType(null);
    setCategory('custom');
    setGoalName('');
    setTargetYear('');
    setTargetAmount('');
    setInitialInvestment('');
    setLifeExpectancy('');
    setMonthlyNeeds('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSelectType = (type: GoalType) => {
    setGoalType(type);
    if (type === 'retirement') {
      setStep('form');
      setGoalName('Retirement Fund');
    } else {
      setStep('category');
    }
  };

  const handleSelectCategory = (cat: OtherGoalCategory) => {
    setCategory(cat);
    setStep('form');
    
    // Pre-fill goal name based on category
    const categoryNames: Record<OtherGoalCategory, string> = {
      home: 'Dream Home',
      education: 'Education Fund',
      vacation: 'Dream Vacation',
      emergency: 'Emergency Fund',
      business: 'Business Venture',
      custom: ''
    };
    setGoalName(categoryNames[cat]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseGoal = {
      id: isEditMode ? editGoal.id : Date.now().toString(),
      title: goalName,
      deadline: targetYear,
      category: goalType === 'retirement' ? 'Retirement' : category.charAt(0).toUpperCase() + category.slice(1),
      initialInvestment: initialInvestment ? parseFloat(initialInvestment) : 0,
    };

    if (goalType === 'retirement') {
      // Calculate retirement target based on years after retirement and monthly needs
      const retirementYears = parseInt(lifeExpectancy);
      const monthsOfRetirement = retirementYears * 12;
      const calculatedTarget = parseFloat(monthlyNeeds) * monthsOfRetirement;
      
      const goal = {
        ...baseGoal,
        target: calculatedTarget,
        current: parseFloat(initialInvestment) || 0,
        retirementDetails: {
          yearsAfterRetirement: parseInt(lifeExpectancy),
          monthlyNeeds: parseFloat(monthlyNeeds),
          retirementYear: parseInt(targetYear)
        }
      };
      
      if (isEditMode && onEditGoal) {
        onEditGoal(goal);
      } else {
        onAddGoal(goal);
      }
    } else {
      const goal = {
        ...baseGoal,
        target: parseFloat(targetAmount),
        current: parseFloat(initialInvestment) || 0,
      };
      
      if (isEditMode && onEditGoal) {
        onEditGoal(goal);
      } else {
        onAddGoal(goal);
      }
    }

    handleClose();
  };

  const otherGoalCategories = [
    { id: 'home', label: 'Home Purchase', icon: Home, description: 'Buy your dream home' },
    { id: 'education', label: 'Education', icon: GraduationCap, description: 'Fund education goals' },
    { id: 'vacation', label: 'Vacation', icon: Plane, description: 'Dream vacation trip' },
    { id: 'emergency', label: 'Emergency Fund', icon: Heart, description: 'Financial safety net' },
    { id: 'business', label: 'Business', icon: Briefcase, description: 'Start a business' },
    { id: 'custom', label: 'Custom Goal', icon: Target, description: 'Create your own goal' },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== 'type' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (step === 'form') {
                    setStep(goalType === 'retirement' ? 'type' : 'category');
                  } else if (step === 'category') {
                    setStep('type');
                  }
                }}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {step === 'type' && 'Choose Goal Type'}
            {step === 'category' && 'Select Category'}
            {step === 'form' && `${isEditMode ? 'Edit' : 'New'} ${goalType === 'retirement' ? 'Retirement' : 'Financial'} Goal`}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Goal Type - Skip in edit mode */}
          {step === 'type' && !isEditMode && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className="p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:border-primary group"
                  onClick={() => handleSelectType('retirement')}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1">Retirement Goal</h3>
                      <p className="text-sm text-muted-foreground">
                        Plan for your golden years with detailed retirement calculations
                      </p>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left w-full">
                      <li>• Life expectancy planning</li>
                      <li>• Monthly income needs</li>
                      <li>• Long-term projections</li>
                    </ul>
                  </div>
                </Card>

                <Card 
                  className="p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:border-primary group"
                  onClick={() => handleSelectType('other')}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center group-hover:bg-accent-200 dark:group-hover:bg-accent-800/40 transition-colors">
                      <Target className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="mb-1">Other Goals</h3>
                      <p className="text-sm text-muted-foreground">
                        Set targets for homes, education, vacations, and more
                      </p>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left w-full">
                      <li>• Flexible goal categories</li>
                      <li>• Custom target amounts</li>
                      <li>• Timeline tracking</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Step 2: Choose Category (for Other goals) */}
          {step === 'category' && !isEditMode && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 py-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {otherGoalCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Card
                      key={cat.id}
                      className="p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:border-primary group"
                      onClick={() => handleSelectCategory(cat.id as OtherGoalCategory)}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm">{cat.label}</div>
                          <div className="text-xs text-muted-foreground">{cat.description}</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Form */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                {/* Goal Name - Disabled in edit mode */}
                <div className="space-y-2">
                  <Label htmlFor="goalName" className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Goal Name
                  </Label>
                  <Input
                    id="goalName"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g., Dream Home, College Fund"
                    required
                    disabled={isEditMode}
                    className="transition-all duration-300 focus:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {isEditMode && (
                    <p className="text-xs text-muted-foreground">
                      Goal name cannot be changed
                    </p>
                  )}
                </div>

                {goalType === 'retirement' ? (
                  <>
                    {/* Retirement Year */}
                    <div className="space-y-2">
                      <Label htmlFor="retirementYear" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Target Retirement Year
                      </Label>
                      <Input
                        id="retirementYear"
                        type="number"
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        placeholder="e.g., 2045"
                        min={new Date().getFullYear()}
                        max={new Date().getFullYear() + 50}
                        required
                        className="transition-all duration-300 focus:scale-[1.01]"
                      />
                    </div>

                    {/* Years After Retirement */}
                    <div className="space-y-2">
                      <Label htmlFor="lifeExpectancy" className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        Expected Retirement Duration (Years)
                      </Label>
                      <Input
                        id="lifeExpectancy"
                        type="number"
                        value={lifeExpectancy}
                        onChange={(e) => setLifeExpectancy(e.target.value)}
                        placeholder="e.g., 30"
                        min={1}
                        max={60}
                        required
                        className="transition-all duration-300 focus:scale-[1.01]"
                      />
                      <p className="text-xs text-muted-foreground">
                        How many years do you expect to live after retirement?
                      </p>
                    </div>

                    {/* Monthly Needs */}
                    <div className="space-y-2">
                      <Label htmlFor="monthlyNeeds" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Monthly Income Needed After Retirement (Rp)
                      </Label>
                      <Input
                        id="monthlyNeeds"
                        type="number"
                        value={monthlyNeeds}
                        onChange={(e) => setMonthlyNeeds(e.target.value)}
                        placeholder="e.g., 10000000"
                        min={0}
                        step={100000}
                        required
                        className="transition-all duration-300 focus:scale-[1.01]"
                      />
                      <p className="text-xs text-muted-foreground">
                        How much do you need per month for living expenses?
                      </p>
                    </div>

                    {/* Calculated Target Display */}
                    {targetYear && lifeExpectancy && monthlyNeeds && (
                      <Card className="p-4 bg-primary-50/50 dark:bg-primary-900/20 border-primary/20">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">Calculated Target Amount:</span>
                          </div>
                          <div className="text-2xl text-primary">
                            Rp {(parseFloat(monthlyNeeds) * (parseInt(lifeExpectancy) * 12)).toLocaleString('id-ID')}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Based on {parseInt(lifeExpectancy)} years × 12 months × Rp {parseFloat(monthlyNeeds).toLocaleString('id-ID')}/month
                          </p>
                        </div>
                      </Card>
                    )}
                  </>
                ) : (
                  <>
                    {/* Target Year */}
                    <div className="space-y-2">
                      <Label htmlFor="targetYear" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Target Year
                      </Label>
                      <Input
                        id="targetYear"
                        type="number"
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        placeholder="e.g., 2028"
                        min={new Date().getFullYear()}
                        max={new Date().getFullYear() + 50}
                        required
                        className="transition-all duration-300 focus:scale-[1.01]"
                      />
                    </div>

                    {/* Target Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="targetAmount" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Target Amount (Rp)
                      </Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="e.g., 500000000"
                        min={0}
                        step={1000000}
                        required
                        className="transition-all duration-300 focus:scale-[1.01]"
                      />
                    </div>
                  </>
                )}

                {isEditMode && (
                  <Card className="p-4 bg-accent-50/50 dark:bg-accent-900/20 border-accent/30">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> In edit mode, you can only update the target year and target amount. Goal name and initial investment remain unchanged.
                    </p>
                  </Card>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                  >
                    <Target className="w-4 h-4" />
                    {isEditMode ? 'Update Goal' : 'Create Goal'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}