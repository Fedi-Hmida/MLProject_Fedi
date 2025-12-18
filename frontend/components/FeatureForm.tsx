"use client";

import { FEATURES } from "@/constants/features";
import { SAMPLE_BENIGN, SAMPLE_MALIGNANT } from "@/constants/sampleData";
import { FeaturesInput } from "@/services/breastCancerApi";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    ArrowRight,
    Beaker,
    Calculator,
    CheckCircle2,
    Loader2,
    RotateCcw,
    ShieldAlert,
    ShieldCheck
} from "lucide-react";
import { useState } from "react";

interface Props {
  onSubmit: (data: FeaturesInput) => void;
  loading?: boolean;
  buttonLabel: string;
  onReset?: () => void;
}

type TabKey = "Mean Values" | "Standard Error" | "Worst Values";

const tabConfig: Record<TabKey, { icon: typeof Beaker; gradient: string }> = {
  "Mean Values": { icon: Beaker, gradient: "from-blue-500 to-cyan-500" },
  "Standard Error": { icon: Calculator, gradient: "from-purple-500 to-pink-500" },
  "Worst Values": { icon: AlertTriangle, gradient: "from-orange-500 to-red-500" }
};

export default function FeatureForm({
  onSubmit,
  loading = false,
  buttonLabel,
  onReset,
}: Props) {
  const [values, setValues] = useState<Partial<FeaturesInput>>({});
  const [activeTab, setActiveTab] = useState<TabKey>("Mean Values");
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : Number(value),
    }));
    setTouched((prev) => new Set(prev).add(key));
  };

  const handleAutofillMalignant = () => {
    setValues(SAMPLE_MALIGNANT);
    // Mark all fields as touched
    const allKeys = FEATURES.flatMap(section => section.items.map(item => item.key));
    setTouched(new Set(allKeys));
  };

  const handleAutofillBenign = () => {
    setValues(SAMPLE_BENIGN);
    // Mark all fields as touched
    const allKeys = FEATURES.flatMap(section => section.items.map(item => item.key));
    setTouched(new Set(allKeys));
  };

  const handleResetForm = () => {
    setValues({});
    setTouched(new Set());
    setActiveTab("Mean Values");
    onReset?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values as FeaturesInput);
  };

  const currentSection = FEATURES.find(
    (section) => section.group === activeTab
  );

  // Calculate completion percentage
  const totalFields = FEATURES.flatMap(s => s.items).length;
  const filledFields = Object.keys(values).filter(k => values[k as keyof typeof values] !== undefined).length;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);

  const TabIcon = tabConfig[activeTab].icon;

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-8 transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 font-medium">Form Completion</span>
          <span className="text-blue-600 font-semibold">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-slate-500">{filledFields} of {totalFields} features entered</p>
      </div>

      {/* Sample Data Buttons */}
      <div className="flex flex-wrap justify-between gap-3">
        <motion.button
          type="button"
          onClick={handleResetForm}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-200 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Form
        </motion.button>
        <div className="flex flex-wrap gap-3">
          <motion.button
            type="button"
            onClick={handleAutofillMalignant}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-600 font-medium text-sm hover:from-red-100 hover:to-rose-100 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            High Risk Sample
          </motion.button>
          <motion.button
            type="button"
            onClick={handleAutofillBenign}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-600 font-medium text-sm hover:from-green-100 hover:to-emerald-100 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Low Risk Sample
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        {(["Mean Values", "Standard Error", "Worst Values"] as TabKey[]).map((tab) => {
          const config = tabConfig[tab];
          const Icon = config.icon;
          const isActive = activeTab === tab;

          return (
            <motion.button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                  : "text-slate-600 hover:bg-white hover:shadow-sm"
              }`}
              whileHover={{ scale: isActive ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <AnimatePresence mode="wait">
        {currentSection && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tabConfig[activeTab].gradient} flex items-center justify-center shadow-lg`}>
                <TabIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{activeTab}</h4>
                <p className="text-sm text-slate-500">Enter clinical measurements</p>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSection.items.map((feature) => {
                const value = (values as Record<string, number | undefined>)[feature.key];
                const isFilled = value !== undefined;
                const isTouched = touched.has(feature.key);

                return (
                  <motion.div
                    key={feature.key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {feature.label}
                      {isFilled && (
                        <CheckCircle2 className="inline w-4 h-4 text-emerald-500 ml-2" />
                      )}
                    </label>

                    <input
                      type="number"
                      step="any"
                      required
                      disabled={loading}
                      placeholder="0.00"
                      value={value ?? ""}
                      onChange={(e) => handleChange(feature.key, e.target.value)}
                      className={`input-modern ${
                        isFilled 
                          ? "border-emerald-300 bg-emerald-50/50" 
                          : isTouched 
                            ? "border-orange-300" 
                            : ""
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <div className="pt-6">
        <motion.button
          type="submit"
          disabled={loading || completionPercentage < 100}
          whileHover={{ scale: completionPercentage === 100 ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
            completionPercentage === 100
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              {buttonLabel}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
        
        {completionPercentage < 100 && (
          <p className="text-center text-sm text-slate-500 mt-3">
            Please fill in all {totalFields - filledFields} remaining fields to continue
          </p>
        )}
      </div>
    </form>
  );
}
