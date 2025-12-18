"use client";

import ExplanationChart from "@/components/ExplanationChart";
import FeatureForm from "@/components/FeatureForm";
import {
    FeaturesInput,
    predictCancer,
    PredictionResponse,
} from "@/services/breastCancerApi";
import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowDown,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Cpu,
    FileText,
    HelpCircle,
    Microscope,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    Target,
    TrendingUp,
    XCircle,
    Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, label: "Input", icon: Activity, description: "Enter clinical data" },
    { id: 2, label: "Processing", icon: Cpu, description: "ML analysis" },
    { id: 3, label: "Results", icon: Target, description: "View prediction" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isProcessing = currentStep === 2 && step.id === 2;

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25"
                    : isActive
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
                      : "bg-slate-200"
                }`}
                animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
                transition={isProcessing ? { repeat: Infinity, duration: 1 } : {}}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                ) : (
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? "text-white" : "text-slate-400"}`} />
                )}
                
                {/* Pulse effect for active step */}
                {isActive && !isProcessing && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-blue-500/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.div>
              
              <span className={`mt-2 text-xs md:text-sm font-medium ${
                isActive || isCompleted ? "text-slate-800" : "text-slate-400"
              }`}>
                {step.label}
              </span>
              <span className="hidden md:block text-xs text-slate-500">
                {step.description}
              </span>
            </motion.div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="mx-2 md:mx-4 w-8 md:w-16 h-1 rounded-full overflow-hidden bg-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Confidence Gauge Component
const ConfidenceGauge = ({ value }: { value: number }) => {
  const percentage = value * 100;
  const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="relative w-full h-32 flex items-end justify-center">
      {/* Semi-circle background */}
      <svg viewBox="0 0 200 100" className="w-full max-w-[200px]">
        {/* Background arc */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        {/* Progress arc */}
        <motion.path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="283"
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Value display */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-3xl font-bold text-slate-800">{percentage.toFixed(1)}%</span>
      </motion.div>
    </div>
  );
};

// Risk Thermometer Component
const RiskThermometer = ({ riskScore, riskCategory }: { riskScore: number; riskCategory: string }) => {
  const percentage = riskScore * 100;

  const getColor = () => {
    if (riskCategory === "High Risk") return "from-red-500 to-rose-500";
    if (riskCategory === "Medium Risk") return "from-yellow-500 to-amber-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-medium text-slate-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
      
      <div className="relative h-6 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded-full overflow-hidden">
        {/* Threshold markers */}
        <div className="absolute left-[20%] top-0 bottom-0 w-0.5 bg-white/50" />
        <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-white/50" />
        
        {/* Current position indicator */}
        <motion.div
          className={`absolute top-0 bottom-0 bg-gradient-to-r ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-800 rounded-full shadow-lg"
          initial={{ left: 0 }}
          animate={{ left: `calc(${percentage}% - 8px)` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-600">Risk Score</span>
        <span className={`font-bold ${
          riskCategory === "High Risk" ? "text-red-600" :
          riskCategory === "Medium Risk" ? "text-yellow-600" : "text-green-600"
        }`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

// Expandable Info Section
const ExpandableSection = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`section-${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-slate-800">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`section-${title}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-slate-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Prediction Page Component
export default function PredictionPage() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [result]);

  const handlePredict = async (data: FeaturesInput) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(2);

    try {
      const response = await predictCancer(data);
      setResult(response);
      setCurrentStep(3);

      // Show toast notification with risk level
      if (response.risk_category === "High Risk") {
        toast.error(`${response.diagnosis} - ${response.risk_category}`, {
          description: `Risk Score: ${(response.risk_score * 100).toFixed(1)}% | Confidence: ${(response.confidence * 100).toFixed(1)}%`,
        });
      } else if (response.risk_category === "Medium Risk") {
        toast.warning(`${response.diagnosis} - ${response.risk_category}`, {
          description: `Risk Score: ${(response.risk_score * 100).toFixed(1)}% | Confidence: ${(response.confidence * 100).toFixed(1)}%`,
        });
      } else {
        toast.success(`${response.diagnosis} - ${response.risk_category}`, {
          description: `Risk Score: ${(response.risk_score * 100).toFixed(1)}% | Confidence: ${(response.confidence * 100).toFixed(1)}%`,
        });
      }
    } catch {
      setError("Prediction failed. Please check the API connection.");
      setCurrentStep(1);
      toast.error("Prediction Failed", {
        description: "Unable to connect to the API server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
    setCurrentStep(1);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header Section */}
      <section className="relative overflow-hidden mesh-gradient">
        {/* Animated Orbs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm border border-white/20">
                Binary Classification
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Breast Cancer Risk Assessment
            </h1>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl">
              Enter clinical measurements or use sample data to generate a
              machine learning-based breast cancer diagnosis with confidence scores.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/20"
          >
            <StepIndicator currentStep={currentStep} />
          </motion.div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">Clinical Input</h2>
                    <p className="text-sm text-slate-500">
                      Enter tumor measurements for analysis
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <FeatureForm
                  onSubmit={handlePredict}
                  loading={loading}
                  buttonLabel="Run Prediction"
                  onReset={handleReset}
                />
              </div>
            </div>

            {/* Help Section */}
            <ExpandableSection title="Understanding the Features" icon={HelpCircle}>
              <div className="space-y-4 text-sm text-slate-600">
                <p>
                  The prediction model uses 30 features derived from Fine Needle Aspirate (FNA) images:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Mean Values:</strong> Average measurements of cell nuclei
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Standard Error:</strong> Variation in measurements
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Worst Values:</strong> Largest/most severe measurements
                    </div>
                  </div>
                </div>
              </div>
            </ExpandableSection>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Error State */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 border border-red-200 rounded-3xl p-6"
                >
                  <div className="flex items-center gap-3 text-red-600">
                    <XCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Prediction Failed</p>
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Waiting State */}
            {!result && !error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-8 md:p-12 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Complete the clinical input form on the left to generate a prediction with risk assessment.
                </p>
                <div className="mt-6">
                  <ArrowDown className="w-6 h-6 text-slate-300 mx-auto animate-bounce" />
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-8 md:p-12 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6"
                  >
                    <Zap className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Analyzing Data...
                  </h3>
                  <p className="text-slate-500">
                    Running machine learning model inference
                  </p>
                  
                  <div className="mt-6 space-y-2">
                    {["Preprocessing features", "Running model", "Generating explanation"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.5 }}
                        className="flex items-center justify-center gap-2 text-sm text-slate-500"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                          className="w-2 h-2 rounded-full bg-blue-500"
                        />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Main Diagnosis Card */}
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`relative overflow-hidden rounded-3xl p-8 ${
                      result.diagnosis === "Malignant"
                        ? "bg-gradient-to-br from-red-500 to-rose-600"
                        : "bg-gradient-to-br from-emerald-500 to-teal-600"
                    } shadow-2xl`}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
                      >
                        {result.diagnosis === "Malignant" ? (
                          <AlertTriangle className="w-10 h-10 text-white" />
                        ) : (
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        )}
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-2"
                      >
                        {result.diagnosis}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/80 text-lg"
                      >
                        {result.diagnosis === "Malignant"
                          ? "Tumor cells detected - requires medical attention"
                          : "No malignant cells detected"}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Confidence & Risk Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Confidence Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-slate-800">Model Confidence</span>
                      </div>
                      <ConfidenceGauge value={result.confidence} />
                    </motion.div>

                    {/* Risk Level Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        {result.risk_category === "High Risk" ? (
                          <ShieldAlert className="w-5 h-5 text-red-500" />
                        ) : result.risk_category === "Medium Risk" ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-green-500" />
                        )}
                        <span className="font-semibold text-slate-800">Risk Assessment</span>
                      </div>
                      
                      <div className="text-center mb-4">
                        <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${
                          result.risk_category === "High Risk"
                            ? "bg-red-100 text-red-700"
                            : result.risk_category === "Medium Risk"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}>
                          {result.risk_category}
                        </span>
                      </div>
                      
                      <RiskThermometer riskScore={result.risk_score} riskCategory={result.risk_category} />
                    </motion.div>
                  </div>

                  {/* Clinical Recommendation */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`rounded-3xl p-6 border-l-4 ${
                      result.risk_category === "High Risk"
                        ? "bg-red-50 border-red-500"
                        : result.risk_category === "Medium Risk"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-green-50 border-green-500"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        result.risk_category === "High Risk"
                          ? "bg-red-100"
                          : result.risk_category === "Medium Risk"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                      }`}>
                        <Stethoscope className={`w-6 h-6 ${
                          result.risk_category === "High Risk"
                            ? "text-red-600"
                            : result.risk_category === "Medium Risk"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className={`font-semibold ${
                            result.risk_category === "High Risk"
                              ? "text-red-800"
                              : result.risk_category === "Medium Risk"
                                ? "text-yellow-800"
                                : "text-green-800"
                          }`}>
                            Clinical Recommendation
                          </h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            result.risk_category === "High Risk"
                              ? "bg-red-200 text-red-700"
                              : result.risk_category === "Medium Risk"
                                ? "bg-yellow-200 text-yellow-700"
                                : "bg-green-200 text-green-700"
                          }`}>
                            {result.risk_category === "High Risk" ? "Urgent" : 
                             result.risk_category === "Medium Risk" ? "Important" : "Routine"}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          result.risk_category === "High Risk"
                            ? "text-red-700"
                            : result.risk_category === "Medium Risk"
                              ? "text-yellow-700"
                              : "text-green-700"
                        }`}>
                          {result.clinical_action}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Probability Distribution */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-6"
                  >
                    <h4 className="font-semibold text-slate-800 mb-6">Probability Distribution</h4>
                    
                    <div className="space-y-6">
                      {/* Malignant */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            Malignant
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            {(result.probability_malignant * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.probability_malignant * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Benign */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            Benign
                          </span>
                          <span className="text-sm font-bold text-emerald-600">
                            {(result.probability_benign * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.probability_benign * 100}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Interpret Results Section */}
                  <ExpandableSection title="Interpret Results" icon={BookOpen} defaultOpen={false}>
                    <div className="space-y-4 text-sm text-slate-600">
                      <p>
                        <strong className="text-slate-800">Diagnosis:</strong> The model classifies the tumor as{" "}
                        <span className={result.diagnosis === "Malignant" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                          {result.diagnosis.toLowerCase()}
                        </span>{" "}
                        based on the input measurements.
                      </p>
                      <p>
                        <strong className="text-slate-800">Confidence:</strong> The model is{" "}
                        {result.confidence > 0.9 ? "highly confident" : result.confidence > 0.7 ? "reasonably confident" : "somewhat uncertain"}{" "}
                        ({(result.confidence * 100).toFixed(1)}%) in this prediction.
                      </p>
                      <p>
                        <strong className="text-slate-800">Risk Score:</strong> Based on the probability of malignancy ({(result.risk_score * 100).toFixed(1)}%), 
                        this case is categorized as <span className="font-semibold">{result.risk_category.toLowerCase()}</span>.
                      </p>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                          <p className="text-amber-800 text-xs">
                            This AI prediction is for informational purposes only and should not replace professional medical diagnosis. 
                            Always consult with a qualified healthcare provider for medical decisions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  {/* Feature Importance */}
                  {result.explanations && result.explanations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 overflow-hidden"
                    >
                      <ExplanationChart explanations={result.explanations} />
                    </motion.div>
                  )}

                  {/* Model Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap gap-4 text-sm text-slate-500 justify-center"
                  >
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm">
                      <Cpu className="w-4 h-4" />
                      Model: {result.model_version}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm">
                      <FileText className="w-4 h-4" />
                      Logistic Regression
                    </span>
                  </motion.div>

                  {/* New Prediction Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    onClick={handleReset}
                    className="w-full py-4 px-6 rounded-2xl font-semibold text-lg bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Start New Prediction
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-50"
        >
          <button
            onClick={() => {
              const form = document.querySelector('form');
              if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <ChevronUp className="w-5 h-5" />
            Go to Form
          </button>
        </motion.div>
      )}
    </main>
  );
}
