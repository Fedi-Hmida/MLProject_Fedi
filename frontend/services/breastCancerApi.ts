const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FeaturesInput {
  // Mean values
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  symmetry_mean: number;
  fractal_dimension_mean: number;

  // Standard error values
  radius_se: number;
  texture_se: number;
  perimeter_se: number;
  area_se: number;
  smoothness_se: number;
  compactness_se: number;
  concavity_se: number;
  concave_points_se: number;
  symmetry_se: number;
  fractal_dimension_se: number;

  // Worst values
  radius_worst: number;
  texture_worst: number;
  perimeter_worst: number;
  area_worst: number;
  smoothness_worst: number;
  compactness_worst: number;
  concavity_worst: number;
  concave_points_worst: number;
  symmetry_worst: number;
  fractal_dimension_worst: number;
}

/* =========================================================
   RESPONSE TYPES
   ========================================================= */

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  version: string;
  timestamp: string;
}

export interface ExplanationItem {
  feature: string;
  contribution: number;
  abs_contribution: number;
  direction: "increases risk" | "decreases risk" | "no effect";
}

export interface PredictionResponse {
  diagnosis: "Benign" | "Malignant";
  confidence: number;
  probability_malignant: number;
  probability_benign: number;
  model_version: string;
  timestamp: string;
  explanations?: ExplanationItem[];
}

export interface RiskStratificationResponse {
  risk_category: "Low" | "Medium" | "High";
  risk_score: number;
  diagnosis: "Benign" | "Malignant";
  confidence: number;
  recommendation: {
    action: string;
    description: string;
    follow_up: string;
    priority: string;
  };
  thresholds: {
    low: number;
    high: number;
  };
  model_version: string;
  timestamp: string;
  explanations?: ExplanationItem[];
}

/* =========================================================
   API CALLS
   ========================================================= */

/* ---------- Health Check ---------- */
export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/api/v1/health`);

  if (!res.ok) {
    throw new Error("Health check failed");
  }

  return res.json();
}

/* ---------- Binary Prediction ---------- */
export async function predictCancer(
  data: FeaturesInput
): Promise<PredictionResponse> {
  const res = await fetch(`${API_URL}/api/v1/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Prediction request failed");
  }

  return res.json();
}

/* ---------- Risk Stratification ---------- */
export async function riskStratify(
  data: FeaturesInput
): Promise<RiskStratificationResponse> {
  const res = await fetch(`${API_URL}/api/v1/risk-stratify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Risk stratification request failed");
  }

  return res.json();
}
