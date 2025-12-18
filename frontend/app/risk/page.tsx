"use client";

import Card from "@/components/Card";
import ExplanationChart from "@/components/ExplanationChart";
import FeatureForm from "@/components/FeatureForm";
import {
    FeaturesInput,
    RiskStratificationResponse,
    riskStratify,
} from "@/services/breastCancerApi";
import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Flag,
    Shield,
    Stethoscope,
    XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const riskConfig = {
  Low: {
    color: "emerald",
    bgGradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    icon: CheckCircle2,
    barGradient: "from-emerald-500 to-teal-500"
  },
  Medium: {
    color: "orange",
    bgGradient: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    text: "text-orange-600",
    icon: AlertTriangle,
    barGradient: "from-orange-500 to-amber-500"
  },
  High: {
    color: "red",
    bgGradient: "from-red-50 to-rose-50",
    border: "border-red-200",
    text: "text-red-600",
    icon: XCircle,
    barGradient: "from-red-500 to-rose-500"
  }
};

export default function RiskPage() {
  const [result, setResult] = useState<RiskStratificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRisk = async (data: FeaturesInput) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await riskStratify(data);
      setResult(response);

      // Show toast based on risk level
      const toastFn = response.risk_category === "High" 
        ? toast.error 
        : response.risk_category === "Medium" 
          ? toast.warning 
          : toast.success;

      toastFn(`${response.risk_category} Risk Detected`, {
        description: `Risk Score: ${(response.risk_score * 100).toFixed(1)}%`,
      });
    } catch {
      setError("Risk analysis failed. Please check the API connection.");
      toast.error("Analysis Failed", {
        description: "Unable to connect to the API server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const config = result ? riskConfig[result.risk_category as keyof typeof riskConfig] : null;
  const RiskIcon = config?.icon || Shield;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Decorative Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="container-app relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm border border-white/20">
                3-Tier Stratification
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Risk Stratification
            </h1>
            <p className="text-lg text-purple-100 max-w-2xl">
              Analyze patient risk levels and receive clinically relevant recommendations 
              based on machine learning predictions with optimized thresholds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-app py-12 space-y-8">
        {/* Form Card */}
        <Card
          title="Clinical Input"
          description="Provide the patient's tumor measurements for risk analysis"
          icon={Activity}
        >
          <FeatureForm
            onSubmit={handleRisk}
            loading={loading}
            buttonLabel="Analyze Risk"
          />
        </Card>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card title="Error" icon={AlertCircle} variant="danger">
                <div className="flex items-center gap-3 text-red-600">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && config && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Main Result Card */}
              <Card
                title="Risk Assessment Result"
                description="Risk level, score, and clinical recommendations"
                icon={Shield}
                variant={result.risk_category === "High" ? "danger" : result.risk_category === "Medium" ? "warning" : "success"}
              >
                <div className="space-y-8">
                  {/* Risk Overview */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Risk Category */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`p-6 rounded-2xl bg-gradient-to-br ${config.bgGradient} ${config.border} border`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <RiskIcon className={`w-5 h-5 ${config.text}`} />
                        <span className="text-sm font-medium text-slate-600">Risk Category</span>
                      </div>
                      <p className={`text-3xl font-bold ${config.text}`}>
                        {result.risk_category}
                      </p>
                    </motion.div>

                    {/* Risk Score */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-slate-600">Risk Score</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">
                        {(result.risk_score * 100).toFixed(1)}%
                      </p>
                    </motion.div>

                    {/* Diagnosis */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className={`p-6 rounded-2xl ${
                        result.diagnosis === "Malignant"
                          ? "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200"
                          : "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Stethoscope className={`w-5 h-5 ${
                          result.diagnosis === "Malignant" ? "text-red-500" : "text-emerald-500"
                        }`} />
                        <span className="text-sm font-medium text-slate-600">Diagnosis</span>
                      </div>
                      <p className={`text-3xl font-bold ${
                        result.diagnosis === "Malignant" ? "text-red-600" : "text-emerald-600"
                      }`}>
                        {result.diagnosis}
                      </p>
                    </motion.div>
                  </div>

                  {/* Risk Score Visualization */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Risk Score Visualization</h4>
                    <div className="relative">
                      <div className="h-6 bg-gradient-to-r from-emerald-100 via-orange-100 to-red-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.risk_score * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${config.barGradient} rounded-full relative`}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-current" 
                               style={{ borderColor: `var(--${config.color}-500)` }} />
                        </motion.div>
                      </div>
                      
                      {/* Threshold Markers */}
                      <div className="relative h-8 mt-2">
                        <div className="absolute left-0 text-xs text-slate-500">0%</div>
                        <div 
                          className="absolute text-xs text-orange-600 -translate-x-1/2"
                          style={{ left: `${result.thresholds.low * 100}%` }}
                        >
                          Low ({(result.thresholds.low * 100).toFixed(0)}%)
                        </div>
                        <div 
                          className="absolute text-xs text-red-600 -translate-x-1/2"
                          style={{ left: `${result.thresholds.high * 100}%` }}
                        >
                          High ({(result.thresholds.high * 100).toFixed(0)}%)
                        </div>
                        <div className="absolute right-0 text-xs text-slate-500">100%</div>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Recommendation */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Clinical Recommendation
                    </h4>
                    
                    <div className={`p-6 rounded-2xl bg-gradient-to-br ${config.bgGradient} ${config.border} border`}>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Action */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <ArrowRight className="w-4 h-4" />
                            <span className="text-sm font-medium">Recommended Action</span>
                          </div>
                          <p className="font-semibold text-slate-800">
                            {result.recommendation.action}
                          </p>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Flag className="w-4 h-4" />
                            <span className="text-sm font-medium">Priority Level</span>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            result.recommendation.priority === "High" || result.recommendation.priority === "Urgent"
                              ? "bg-red-100 text-red-700"
                              : result.recommendation.priority === "Medium"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {result.recommendation.priority}
                          </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 md:col-span-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Description</span>
                          </div>
                          <p className="text-slate-700">
                            {result.recommendation.description}
                          </p>
                        </div>

                        {/* Follow-up */}
                        <div className="space-y-2 md:col-span-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">Follow-up</span>
                          </div>
                          <p className="text-slate-700">
                            {result.recommendation.follow_up}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Thresholds: Low ≤ {(result.thresholds.low * 100).toFixed(0)}% | High ≥ {(result.thresholds.high * 100).toFixed(0)}%
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Explanations Chart */}
                  {result.explanations && result.explanations.length > 0 && (
                    <ExplanationChart 
                      explanations={result.explanations}
                      title="Feature Contributions to Risk Assessment"
                    />
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
