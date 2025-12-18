"use client";

import { useState } from "react";
import FeatureForm from "@/components/FeatureForm";
import Card from "@/components/Card";
import ExplanationChart from "@/components/ExplanationChart";
import {
  predictCancer,
  PredictionResponse,
  FeaturesInput,
} from "@/services/breastCancerApi";

export default function PredictionPage() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (data: FeaturesInput) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await predictCancer(data);
      setResult(response);
    } catch {
      setError("Prediction failed. Please check the API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 bg-slate-100">
      {/* ================= HEADER ================= */}
      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">
          Breast Cancer Prediction
        </h1>
        <p className="text-slate-600">
          Enter clinical measurements or use sample data to generate
          a machine-learning-based breast cancer diagnosis.
        </p>
      </header>

      {/* ================= FORM ================= */}
      <section>
        <Card
          title="🧪 Clinical Input"
          description="Provide the patient’s tumor measurements"
        >
          <FeatureForm
            onSubmit={handlePredict}
            loading={loading}
            buttonLabel="Run Prediction"
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
          title="🧠 Prediction Result"
          description="Model inference summary"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Diagnosis */}
            <div className="md:col-span-1 space-y-2">
              <p className="text-sm text-slate-500">Diagnosis</p>
              <p
                className={`text-2xl font-bold ${
                  result.diagnosis === "Malignant"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {result.diagnosis}
              </p>
              <p className="text-sm text-slate-500">
                Confidence: {(result.confidence * 100).toFixed(2)}%
              </p>
            </div>

            {/* Probabilities */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  Malignant Probability
                </p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{
                      width: `${result.probability_malignant * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {(result.probability_malignant * 100).toFixed(2)}%
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  Benign Probability
                </p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${result.probability_benign * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {(result.probability_benign * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-6 pt-4 border-t text-sm text-slate-500">
            <p>Model version: {result.model_version}</p>
            <p>{new Date(result.timestamp).toLocaleString()}</p>
          </div>

          {/* Explanations */}
          {result.explanations && result.explanations.length > 0 && (
            <ExplanationChart explanations={result.explanations} />
          )}
        </Card>
      )}
    </main>
  );
}
