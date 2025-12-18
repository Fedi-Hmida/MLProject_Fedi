"""
Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime


class FeatureInput(BaseModel):
    """
    Input schema for breast cancer features.
    All 30 features from the Wisconsin Diagnostic Breast Cancer dataset.
    """
    
    # Mean features
    radius_mean: float = Field(..., gt=0, description="Mean of distances from center to points on the perimeter")
    texture_mean: float = Field(..., gt=0, description="Standard deviation of gray-scale values")
    perimeter_mean: float = Field(..., gt=0, description="Mean size of the core tumor")
    area_mean: float = Field(..., gt=0, description="Mean area of the core tumor")
    smoothness_mean: float = Field(..., ge=0, le=1, description="Mean of local variation in radius lengths")
    compactness_mean: float = Field(..., ge=0, description="Mean of perimeter^2 / area - 1.0")
    concavity_mean: float = Field(..., ge=0, description="Mean of severity of concave portions of the contour")
    concave_points_mean: float = Field(..., ge=0, description="Mean number of concave portions of the contour")
    symmetry_mean: float = Field(..., ge=0, le=1, description="Mean symmetry")
    fractal_dimension_mean: float = Field(..., ge=0, description="Mean 'coastline approximation' - 1")
    
    # SE features
    radius_se: float = Field(..., gt=0, description="Standard error of distances from center to points on the perimeter")
    texture_se: float = Field(..., gt=0, description="Standard error of gray-scale values")
    perimeter_se: float = Field(..., gt=0, description="Standard error of size of the core tumor")
    area_se: float = Field(..., gt=0, description="Standard error of area of the core tumor")
    smoothness_se: float = Field(..., ge=0, description="Standard error of local variation in radius lengths")
    compactness_se: float = Field(..., ge=0, description="Standard error of perimeter^2 / area - 1.0")
    concavity_se: float = Field(..., ge=0, description="Standard error of severity of concave portions")
    concave_points_se: float = Field(..., ge=0, description="Standard error of number of concave portions")
    symmetry_se: float = Field(..., ge=0, description="Standard error of symmetry")
    fractal_dimension_se: float = Field(..., ge=0, description="Standard error of 'coastline approximation' - 1")
    
    # Worst features
    radius_worst: float = Field(..., gt=0, description="Worst (largest) mean of distances from center to points")
    texture_worst: float = Field(..., gt=0, description="Worst standard deviation of gray-scale values")
    perimeter_worst: float = Field(..., gt=0, description="Worst size of the core tumor")
    area_worst: float = Field(..., gt=0, description="Worst area of the core tumor")
    smoothness_worst: float = Field(..., ge=0, le=1, description="Worst local variation in radius lengths")
    compactness_worst: float = Field(..., ge=0, description="Worst perimeter^2 / area - 1.0")
    concavity_worst: float = Field(..., ge=0, description="Worst severity of concave portions of the contour")
    concave_points_worst: float = Field(..., ge=0, description="Worst number of concave portions of the contour")
    symmetry_worst: float = Field(..., ge=0, le=1, description="Worst symmetry")
    fractal_dimension_worst: float = Field(..., ge=0, description="Worst 'coastline approximation' - 1")
    
    class Config:
        json_schema_extra = {
            "example": {
                "radius_mean": 17.99, "texture_mean": 10.38, "perimeter_mean": 122.8,
                "area_mean": 1001.0, "smoothness_mean": 0.1184, "compactness_mean": 0.2776,
                "concavity_mean": 0.3001, "concave_points_mean": 0.1471, "symmetry_mean": 0.2419,
                "fractal_dimension_mean": 0.07871, "radius_se": 1.095, "texture_se": 0.9053,
                "perimeter_se": 8.589, "area_se": 153.4, "smoothness_se": 0.006399,
                "compactness_se": 0.04904, "concavity_se": 0.05373, "concave_points_se": 0.01587,
                "symmetry_se": 0.03003, "fractal_dimension_se": 0.006193, "radius_worst": 25.38,
                "texture_worst": 17.33, "perimeter_worst": 184.6, "area_worst": 2019.0,
                "smoothness_worst": 0.1622, "compactness_worst": 0.6656, "concavity_worst": 0.7119,
                "concave_points_worst": 0.2654, "symmetry_worst": 0.4601, "fractal_dimension_worst": 0.1189
            }
        }
    
    def to_list(self) -> List[float]:
        """Convert features to ordered list matching training data."""
        return [
            self.radius_mean, self.texture_mean, self.perimeter_mean, self.area_mean,
            self.smoothness_mean, self.compactness_mean, self.concavity_mean,
            self.concave_points_mean, self.symmetry_mean, self.fractal_dimension_mean,
            self.radius_se, self.texture_se, self.perimeter_se, self.area_se,
            self.smoothness_se, self.compactness_se, self.concavity_se,
            self.concave_points_se, self.symmetry_se, self.fractal_dimension_se,
            self.radius_worst, self.texture_worst, self.perimeter_worst, self.area_worst,
            self.smoothness_worst, self.compactness_worst, self.concavity_worst,
            self.concave_points_worst, self.symmetry_worst, self.fractal_dimension_worst
        ]


class PredictionResponse(BaseModel):
    """Response schema for binary prediction."""
    
    diagnosis: str = Field(..., description="Predicted diagnosis: Benign or Malignant")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence (0-1)")
    probability_malignant: float = Field(..., ge=0, le=1, description="Probability of malignancy")
    probability_benign: float = Field(..., ge=0, le=1, description="Probability of benign")
    model_version: str = Field(..., description="Model version used for prediction")
    timestamp: datetime = Field(default_factory=datetime.now, description="Prediction timestamp")
    explanations: Optional[List[dict]] = Field(None, description="Optional explanation items describing feature contributions")


class RiskRecommendation(BaseModel):
    """Clinical recommendations based on risk level."""
    
    action: str = Field(..., description="Recommended clinical action")
    description: str = Field(..., description="Detailed recommendation description")
    follow_up: str = Field(..., description="Follow-up procedure recommendation")
    priority: str = Field(..., description="Priority level: Standard, Elevated, or Urgent")


class RiskStratificationResponse(BaseModel):
    """Response schema for risk stratification."""
    
    risk_category: str = Field(..., description="Risk level: Low, Medium, or High")
    risk_score: float = Field(..., ge=0, le=1, description="Continuous risk score (probability of malignancy)")
    diagnosis: str = Field(..., description="Predicted diagnosis: Benign or Malignant")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence")
    recommendation: RiskRecommendation = Field(..., description="Clinical recommendations")
    thresholds: dict = Field(..., description="Threshold values used for stratification")
    model_version: str = Field(..., description="Model version used")
    timestamp: datetime = Field(default_factory=datetime.now, description="Prediction timestamp")
    explanations: Optional[List[dict]] = Field(None, description="Optional explanation items describing feature contributions")


class HealthResponse(BaseModel):
    """Health check response."""
    
    status: str = Field(..., description="Service status")
    model_loaded: bool = Field(..., description="Whether ML model is loaded")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.now, description="Check timestamp")


class BatchFeatureInput(BaseModel):
    """Batch prediction input schema."""
    
    samples: List[FeatureInput] = Field(..., description="List of feature samples")
    
    @field_validator('samples')
    @classmethod
    def validate_samples(cls, v):
        if len(v) == 0:
            raise ValueError("At least one sample is required")
        if len(v) > 100:
            raise ValueError("Maximum 100 samples per batch")
        return v


class BatchPredictionResponse(BaseModel):
    """Batch prediction response schema."""
    
    predictions: List[PredictionResponse] = Field(..., description="List of predictions")
    total_samples: int = Field(..., description="Total number of samples processed")
    processing_time: float = Field(..., description="Total processing time in seconds")
    timestamp: datetime = Field(default_factory=datetime.now, description="Batch processing timestamp")
