import { FeaturesInput } from "@/services/breastCancerApi";

// Sample data that typically predicts MALIGNANT (High Risk)
export const SAMPLE_MALIGNANT: FeaturesInput = {
  // Mean
  radius_mean: 17.99,
  texture_mean: 10.38,
  perimeter_mean: 122.8,
  area_mean: 1001,
  smoothness_mean: 0.1184,
  compactness_mean: 0.2776,
  concavity_mean: 0.3001,
  concave_points_mean: 0.1471,
  symmetry_mean: 0.2419,
  fractal_dimension_mean: 0.07871,

  // SE
  radius_se: 1.095,
  texture_se: 0.9053,
  perimeter_se: 8.589,
  area_se: 153.4,
  smoothness_se: 0.006399,
  compactness_se: 0.04904,
  concavity_se: 0.05373,
  concave_points_se: 0.01587,
  symmetry_se: 0.03003,
  fractal_dimension_se: 0.006193,

  // Worst
  radius_worst: 25.38,
  texture_worst: 17.33,
  perimeter_worst: 184.6,
  area_worst: 2019,
  smoothness_worst: 0.1622,
  compactness_worst: 0.6656,
  concavity_worst: 0.7119,
  concave_points_worst: 0.2654,
  symmetry_worst: 0.4601,
  fractal_dimension_worst: 0.1189,
};

// Sample data that typically predicts BENIGN (Low Risk)
export const SAMPLE_BENIGN: FeaturesInput = {
  // Mean - smaller, more regular values typical of benign tumors
  radius_mean: 12.45,
  texture_mean: 15.70,
  perimeter_mean: 82.57,
  area_mean: 477.1,
  smoothness_mean: 0.1278,
  compactness_mean: 0.0700,
  concavity_mean: 0.0335,
  concave_points_mean: 0.0220,
  symmetry_mean: 0.1890,
  fractal_dimension_mean: 0.0595,

  // SE - lower variability
  radius_se: 0.3345,
  texture_se: 0.8902,
  perimeter_se: 2.217,
  area_se: 27.19,
  smoothness_se: 0.007510,
  compactness_se: 0.01683,
  concavity_se: 0.01350,
  concave_points_se: 0.01020,
  symmetry_se: 0.01940,
  fractal_dimension_se: 0.002750,

  // Worst - still relatively small values
  radius_worst: 13.50,
  texture_worst: 20.15,
  perimeter_worst: 89.00,
  area_worst: 551.1,
  smoothness_worst: 0.1430,
  compactness_worst: 0.1200,
  concavity_worst: 0.0900,
  concave_points_worst: 0.0550,
  symmetry_worst: 0.2750,
  fractal_dimension_worst: 0.0720,
};

// Keep SAMPLE_PATIENT as alias for backwards compatibility
export const SAMPLE_PATIENT = SAMPLE_MALIGNANT;
