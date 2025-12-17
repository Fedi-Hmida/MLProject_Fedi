"use client";

import { useState } from "react";
import { FEATURES } from "@/constants/features";
import { FeaturesInput } from "@/services/breastCancerApi";
import { SAMPLE_PATIENT } from "@/constants/sampleData";
import Card from "@/components/Card";

interface Props {
  onSubmit: (data: FeaturesInput) => void;
  loading?: boolean;
  buttonLabel: string;
}

type TabKey = "Mean Values" | "Standard Error" | "Worst Values";

export default function FeatureForm({
  onSubmit,
  loading = false,
  buttonLabel,
}: Props) {
  const [values, setValues] = useState<Partial<FeaturesInput>>({});
  const [activeTab, setActiveTab] = useState<TabKey>("Mean Values");

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleAutofill = () => {
    setValues(SAMPLE_PATIENT);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values as FeaturesInput);
  };

  const currentSection = FEATURES.find(
    (section) => section.group === activeTab
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-8 ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Helper action */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAutofill}
          className="text-sm text-blue-600 hover:underline"
        >
          Use sample patient data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(["Mean Values", "Standard Error", "Worst Values"] as TabKey[]).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition
                ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Active Tab Content */}
      {currentSection && (
        <Card
          title={
            activeTab === "Mean Values"
              ? "📊 Mean Values"
              : activeTab === "Standard Error"
              ? "📐 Standard Error"
              : "⚠️ Worst Values"
          }
          description="Enter numeric clinical measurements"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSection.items.map((feature) => (
              <div key={feature.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {feature.label}
                </label>

                <input
                  type="number"
                  step="any"
                  required
                  disabled={loading}
                  placeholder="Enter value"
                  value={(values as any)[feature.key] ?? ""}
                  onChange={(e) =>
                    handleChange(feature.key, e.target.value)
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                             transition"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sticky submit */}
      <div className="sticky bottom-0 bg-slate-100 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-lg bg-blue-600 text-white text-lg font-semibold
                     hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : buttonLabel}
        </button>
      </div>
    </form>
  );
}
