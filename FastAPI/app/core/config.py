"""
Application configuration settings.
"""

from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # API Information
    PROJECT_NAME: str = "Breast Cancer Detection API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI backend for breast cancer classification and risk stratification"
    API_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8000,http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:8000"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS string into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # Model Configuration
    MODELS_DIR: Path = Path(__file__).parent.parent.parent.parent / "models"
    
    # Risk Stratification Thresholds (optimized values from ML notebook)
    LOW_RISK_THRESHOLD: float = 0.20
    HIGH_RISK_THRESHOLD: float = 0.70
    
    # Feature Configuration
    EXPECTED_FEATURES: int = 30
    FEATURE_NAMES: List[str] = [
        'radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean',
        'smoothness_mean', 'compactness_mean', 'concavity_mean',
        'concave points_mean', 'symmetry_mean', 'fractal_dimension_mean',
        'radius_se', 'texture_se', 'perimeter_se', 'area_se',
        'smoothness_se', 'compactness_se', 'concavity_se',
        'concave points_se', 'symmetry_se', 'fractal_dimension_se',
        'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst',
        'smoothness_worst', 'compactness_worst', 'concavity_worst',
        'concave points_worst', 'symmetry_worst', 'fractal_dimension_worst'
    ]
    
    # Clinical Recommendations
    RISK_RECOMMENDATIONS: dict = {
        "Low": {
            "action": "Routine Surveillance",
            "description": "Continue with standard screening protocols. Low probability of malignancy.",
            "follow_up": "Annual mammography screening",
            "priority": "Standard"
        },
        "Medium": {
            "action": "Additional Diagnostic Testing",
            "description": "Further evaluation recommended. Consider additional imaging or biopsy.",
            "follow_up": "Ultrasound, MRI, or biopsy as clinically indicated",
            "priority": "Elevated"
        },
        "High": {
            "action": "Immediate Clinical Attention",
            "description": "High probability of malignancy. Urgent diagnostic workup required.",
            "follow_up": "Immediate biopsy and pathological examination",
            "priority": "Urgent"
        }
    }
    
    class Config:
        case_sensitive = True
        env_file = ".env"


# Create settings instance
settings = Settings()
