"use client";

import { useState } from "react";
import FeatureForm from "@/components/FeatureForm";
import Card from "@/components/Card";
import {
  riskStratify,
  RiskStratificationResponse,
  FeaturesInput,
} from "@/services/breastCancerApi";

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
    } catch {
      setError("Risk analysis failed. Please check the API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 bg-slate-100">
      {/* ================= HEADER ================= */}
      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">
          Risk Stratification
        </h1>
        <p className="text-slate-600">
          Analyze the patient’s risk level and receive clinically
          relevant recommendations based on machine learning predictions.
        </p>
      </header>

      {/* ================= FORM ================= */}
      <section>
        <Card
          title="🧪 Clinical Input"
          description="Provide the patient’s tumor measurements"
        >
          <FeatureForm
            onSubmit={handleRisk}
            loading={loading}
            buttonLabel="Analyze Risk"
          />
        </Card>
      </section>

      {/* ================= ERROR ================= */}
      {error && (
        <Card title="⚠️ Error">
          <p className="text-red-600 font-medium">{error}</p>
        </Card>
      )}

      {/* ================= RESULT ================= */}
      {result && (
        <Card
          title="📊 Risk Assessment Result"
          description="Risk level, score, and clinical recommendations"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Category */}
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Risk Category</p>
              <p
                className={`text-2xl font-bold ${
                  result.risk_category === "High"
                    ? "text-red-600"
                    : result.risk_category === "Medium"
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {result.risk_category}
              </p>
              <p className="text-sm text-slate-500">
                Confidence: {(result.confidence * 100).toFixed(2)}%
              </p>
            </div>

            {/* Risk Score Visualization */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  Risk Score
                </p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      result.risk_category === "High"
                        ? "bg-red-500"
                        : result.risk_category === "Medium"
                        ? "bg-orange-400"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${result.risk_score * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {(result.risk_score * 100).toFixed(2)}%
                </p>
              </div>

              {/* Diagnosis */}
              <div>
                <p className="text-sm text-slate-600">
                  Diagnosis
                </p>
                <p className="font-medium text-slate-800">
                  {result.diagnosis}
                </p>
              </div>
            </div>
          </div>

          {/* ================= RECOMMENDATION ================= */}
          <div className="mt-8 pt-6 border-t space-y-3">
            <p className="font-semibold text-slate-800">
              Clinical Recommendation
            </p>
            <p>
              <strong>Action:</strong>{" "}
              {result.recommendation.action}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {result.recommendation.description}
            </p>
            <p>
              <strong>Follow-up:</strong>{" "}
              {result.recommendation.follow_up}
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              <span className="font-medium">
                {result.recommendation.priority}
              </span>
            </p>
          </div>

          {/* ================= META ================= */}
          <div className="mt-6 pt-4 border-t text-sm text-slate-500">
            <p>
              Thresholds — Low: {result.thresholds.low}, High:{" "}
              {result.thresholds.high}
            </p>
            <p>Model version: {result.model_version}</p>
            <p>{new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </Card>
      )}
    </main>
  );
}
