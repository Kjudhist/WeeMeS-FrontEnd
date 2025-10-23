import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Progress } from "../ui/progress";
import { CreditCard, MapPin, ArrowRight, Check, Shield } from "lucide-react";
import logo from '../../assets/Logo.png';
import { motion, AnimatePresence } from "motion/react";
import { Textarea } from "../ui/textarea";
import { saveKYC, validateCRPAnswers, saveCRPAnswers, normalizeRisk } from "../../service/handler";

interface Question {
  questionId: string;
  questionText: string;
  answers: Array<{
    answerId: string;
    answerText: string;
    seq: number;
  }>;
}

interface KYCPageProps {
  onComplete: (kycData: any) => void;
}

export function KYCPage({ onComplete }: KYCPageProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // KYC Data fields
  const [nik, setNik] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [pob, setPob] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [riskProfile, setRiskProfile] = useState<string | null>(null);
  const [insight, setInsight] = useState<string | null>(null);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/v1/crp/questions", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setQuestions(data.data.items);
        } else {
          setError("Failed to fetch questions.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("An error occurred while fetching questions.");
      }
    };

    fetchQuestions();
  }, []);

  const handleKYCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Missing auth token. Please log in again.");
      }

      // Convert DOB from DD/MM/YYYY to YYYY-MM-DD (backend format)
      const dobIso = (() => {
        const m = dob.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m) return `${m[3]}-${m[2]}-${m[1]}`;
        return dob; // if already ISO, send as-is
      })();

      // 1) Save KYC identity
      const kycResp = await saveKYC({ nik, pob, dob: dobIso }, token);
      if (!kycResp?.success) {
        setError(kycResp?.messages?.join(", ") || "Failed to submit KYC.");
        return;
      }
      // Prefer risk profile coming from KYC response if available
      const kycRiskProfileName = kycResp?.data?.riskProfileName ?? kycResp?.data?.riskProfile?.riskProfileName;
      const kycRiskProfileId = kycResp?.data?.riskProfileId ?? kycResp?.data?.riskProfile?.riskProfileId;
      const kycInsight = kycResp?.data?.insight;

      // 2) Validate CRP answers
      const answersArr = Object.entries(answers).map(([questionId, answerId]) => ({ questionId, answerId }));
      const crpValidateResp = await validateCRPAnswers(answersArr, token);
      if (crpValidateResp?.success) {
        const crpValidateInsight = crpValidateResp?.data?.insight;
        // Persist CRP answers
        const crpSaveResp = await saveCRPAnswers(answersArr, token);
        if (crpSaveResp?.success) {
          const crpRiskProfileName = crpSaveResp?.data?.riskProfileName ?? crpSaveResp?.data?.riskProfile?.riskProfileName;
          const crpRiskProfileId = crpSaveResp?.data?.riskProfileId ?? crpSaveResp?.data?.riskProfile?.riskProfileId;
          const crpInsight = crpSaveResp?.data?.insight;

          const rawName = kycRiskProfileName ?? crpRiskProfileName;
          const riskProfileName = normalizeRisk(rawName);
          const riskProfileId = riskProfileName ? (kycRiskProfileId ?? crpRiskProfileId) : undefined;
          const insightText = kycInsight ?? crpInsight ?? crpValidateInsight;

          setRiskProfile(riskProfileName || '');
          setInsight(insightText ?? null);
          onComplete({
            nik,
            address,
            dob,
            pob,
            answers,
            kycStatus: kycResp?.data?.kycStatus,
            riskProfileId,
            riskProfile: riskProfileName,
            insight: insightText,
          });
        } else {
          setError(crpSaveResp?.messages?.join(", ") || "Failed to save CRP answers.");
        }
      } else {
        setError(crpValidateResp?.messages?.join(", ") || "Failed to validate CRP answers.");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      setError("An error occurred while submitting answers.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

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
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="p-8 md:p-10 shadow-2xl border-2 border-primary-100/50 bg-card/95 backdrop-blur-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center border-2 border-primary-200 shadow-lg">
                <img src={logo} alt="WeeMeS Logo" className="w-12 h-12 object-contain" />
              </div>
            </motion.div>
            <h2 className="text-2xl text-foreground mb-2">Complete Your Profile</h2>
            <p className="text-sm text-muted-foreground">
              {step === 1 ? "Verify your identity" : "Determine your investment risk profile"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-500'} transition-colors`}>
              {step > 1 ? <Check className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary-600' : 'bg-secondary-200'} transition-colors`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-secondary-200 text-secondary-500'} transition-colors`}>
              2
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Identity Verification */}
            {step === 1 && (
              <motion.form
                key="kyc-step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleKYCSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="nik" className="text-sm">NIK (Nomor Induk Kependudukan)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <Input
                      id="nik"
                      type="text"
                      placeholder="16 digit NIK"
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      required
                      pattern="[0-9]{16}"
                      maxLength={16}
                      className="pl-10 h-11 border-2 focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your 16-digit national identification number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm">Full Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address (street, city, province, postal code)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={4}
                      className="pl-10 pt-3 border-2 focus:border-primary-500 transition-colors resize-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must match the address on your ID card
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm">Date of Birth</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <Input
                      id="dob"
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                      pattern="\d{2}/\d{2}/\d{4}"
                      className="pl-10 h-11 border-2 focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your date of birth in DD/MM/YYYY format
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pob" className="text-sm">Place of Birth</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <Input
                      id="pob"
                      type="text"
                      placeholder="City, Country"
                      value={pob}
                      onChange={(e) => setPob(e.target.value)}
                      required
                      className="pl-10 h-11 border-2 focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your place of birth (city and country)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all"
                >
                  Next: Risk Profile Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            )}

            {/* Step 2: Risk Profile Questions */}
            {step === 2 && (
              <motion.div
                key="kyc-step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Question Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-primary-600 font-medium">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Current Question */}
                <div className="space-y-4">
                  <h3 className="text-lg text-foreground">
                    {questions[currentQuestion].questionText}
                  </h3>

                  <RadioGroup
                    value={answers[questions[currentQuestion].questionId]?.toString()}
                    onValueChange={(value: string) => handleAnswerSelect(questions[currentQuestion].questionId, value)}
                  >
                    <div className="space-y-3">
                      {questions[currentQuestion].answers.map((option, index) => (
                        <Label
                          key={option.answerId}
                          htmlFor={`q${currentQuestion}-opt${index}`}
                          className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-all hover:bg-primary-50/30"
                        >
                          <RadioGroupItem
                            value={option.answerId}
                            id={`q${currentQuestion}-opt${index}`}
                            className="mt-0.5"
                          />
                          <span className="text-sm flex-1">{option.answerText}</span>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  
                  {currentQuestion < questions.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNextQuestion}
                      disabled={answers[questions[currentQuestion].questionId] === undefined}
                      className="flex-1"
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={!allQuestionsAnswered || isLoading}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Complete Setup"
                      )}
                    </Button>
                  )}
                </div>

                {/* Answer Summary */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Answered: {Object.keys(answers).length} of {questions.length} questions
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* Risk Profile Result */}
          {riskProfile && insight && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Your Risk Profile:{" "}
                <span className="text-primary-600">{riskProfile}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {insight}
              </p>
            </div>
          )}
        </Card>

        {/* Security note */}
      </motion.div>
    </div>
  );
}
