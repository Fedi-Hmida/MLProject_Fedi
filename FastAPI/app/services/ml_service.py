"""
Machine Learning service for model loading and predictions.
"""

import pickle
import joblib
import numpy as np
from pathlib import Path
from typing import Tuple, Dict, Any
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class MLService:
    """
    Service class for ML model management and predictions.
    Handles model loading, preprocessing, and inference.
    """
    
    def __init__(self, models_dir: Path):
        """
        Initialize ML service.
        
        Args:
            models_dir: Directory containing saved model artifacts
        """
        self.models_dir = Path(models_dir)
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.model_metadata = {}
        
        logger.info(f"Initialized MLService with models directory: {self.models_dir}")
    
    def load_models(self) -> None:
        """
        Load all required model artifacts from disk.
        
        Raises:
            FileNotFoundError: If model files are not found
            Exception: If model loading fails
        """
        try:
            # Load main model using joblib (as the notebook uses joblib)
            model_path = self.models_dir / "best_model_logistic_regression_20251213_184350.pkl"
            if not model_path.exists():
                raise FileNotFoundError(f"Model not found at {model_path}")
            
            self.model = joblib.load(model_path)
            logger.info(f"✅ Loaded model: {type(self.model).__name__}")
            
            # Load scaler
            scaler_path = self.models_dir / "scaler_20251213_184350.pkl"
            if scaler_path.exists():
                self.scaler = joblib.load(scaler_path)
                logger.info(f"✅ Loaded scaler: {type(self.scaler).__name__}")
            else:
                logger.warning("⚠️ Scaler not found - predictions may be affected")
            
            # Load feature names (if available)
            feature_names_path = self.models_dir / "feature_names.pkl"
            if feature_names_path.exists():
                self.feature_names = joblib.load(feature_names_path)
                logger.info(f"✅ Loaded {len(self.feature_names)} feature names")
            else:
                self.feature_names = settings.FEATURE_NAMES
                logger.warning("⚠️ Using default feature names from config")
            
            # Load metadata if available
            metadata_path = self.models_dir / "model_metadata_20251213_184350.pkl"
            if metadata_path.exists():
                self.model_metadata = joblib.load(metadata_path)
                # Extract feature names from metadata if available
                if isinstance(self.model_metadata, dict) and 'feature_names' in self.model_metadata:
                    self.feature_names = self.model_metadata['feature_names']
                    logger.info(f"✅ Loaded {len(self.feature_names)} feature names from metadata")
                logger.info(f"✅ Loaded model metadata: {self.model_metadata.get('model_name', 'Unknown')}")
            
            # Validate model
            self._validate_model()
            
        except Exception as e:
            logger.error(f"❌ Failed to load models: {str(e)}")
            raise
    
    def _validate_model(self) -> None:
        """
        Validate that loaded models are ready for inference.
        
        Raises:
            ValueError: If model validation fails
        """
        if self.model is None:
            raise ValueError("Model is not loaded")
        
        # Check if model has required methods
        if not hasattr(self.model, 'predict') or not hasattr(self.model, 'predict_proba'):
            raise ValueError("Model does not have required prediction methods")
        
        # Validate feature count
        if len(self.feature_names) != settings.EXPECTED_FEATURES:
            raise ValueError(
                f"Feature count mismatch: expected {settings.EXPECTED_FEATURES}, "
                f"got {len(self.feature_names)}"
            )
        
        logger.info("✅ Model validation passed")
    
    def preprocess_features(self, features: np.ndarray) -> np.ndarray:
        """
        Preprocess input features (scaling, normalization).
        
        Args:
            features: Raw input features (n_samples, n_features)
            
        Returns:
            Preprocessed features ready for model input
        """
        if self.scaler is not None:
            return self.scaler.transform(features)
        return features
    
    def predict(self, features: np.ndarray) -> Tuple[int, float]:
        """
        Make binary prediction (Benign/Malignant).
        
        Args:
            features: Input features as numpy array (n_samples, 30)
            
        Returns:
            Tuple of (prediction, confidence)
            prediction: 0 for Benign, 1 for Malignant
            confidence: Probability of the predicted class
        """
        # Preprocess
        features_processed = self.preprocess_features(features)
        
        # Predict
        prediction = self.model.predict(features_processed)[0]
        probabilities = self.model.predict_proba(features_processed)[0]
        
        # Get confidence (probability of predicted class)
        confidence = probabilities[prediction]
        
        return int(prediction), float(confidence)
    
    def predict_proba(self, features: np.ndarray) -> np.ndarray:
        """
        Get prediction probabilities for both classes.
        
        Args:
            features: Input features as numpy array (n_samples, 30)
            
        Returns:
            Array of [prob_benign, prob_malignant]
        """
        features_processed = self.preprocess_features(features)
        return self.model.predict_proba(features_processed)[0]
    
    def stratify_risk(self, probability_malignant: float) -> str:
        """
        Stratify patient into risk category based on malignancy probability.
        
        Uses optimized thresholds from ML notebook:
        - Low Risk: < 20% (BI-RADS Category 2 aligned)
        - Medium Risk: 20% - 70%
        - High Risk: > 70%
        
        Args:
            probability_malignant: Probability of malignancy (0-1)
            
        Returns:
            Risk category: "Low", "Medium", or "High"
        """
        if probability_malignant < settings.LOW_RISK_THRESHOLD:
            return "Low"
        elif probability_malignant < settings.HIGH_RISK_THRESHOLD:
            return "Medium"
        else:
            return "High"
    
    def get_prediction_details(self, features: np.ndarray) -> Dict[str, Any]:
        """
        Get comprehensive prediction details including risk stratification.
        
        Args:
            features: Input features as numpy array (1, 30)
            
        Returns:
            Dictionary containing prediction, probabilities, risk level, etc.
        """
        # Get probabilities
        probabilities = self.predict_proba(features)
        prob_benign = float(probabilities[0])
        prob_malignant = float(probabilities[1])
        
        # Get binary prediction
        prediction, confidence = self.predict(features)
        diagnosis = "Malignant" if prediction == 1 else "Benign"
        
        # Risk stratification
        risk_category = self.stratify_risk(prob_malignant)
        recommendation = settings.RISK_RECOMMENDATIONS[risk_category]
        
        return {
            "diagnosis": diagnosis,
            "confidence": confidence,
            "probability_benign": prob_benign,
            "probability_malignant": prob_malignant,
            "risk_category": risk_category,
            "risk_score": prob_malignant,
            "recommendation": recommendation,
            "thresholds": {
                "low": settings.LOW_RISK_THRESHOLD,
                "high": settings.HIGH_RISK_THRESHOLD
            },
            "model_version": self.model_metadata.get("model_name", "Logistic Regression v1.0")
        }
    
    def is_loaded(self) -> bool:
        """Check if model is loaded and ready."""
        return self.model is not None
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded model."""
        return {
            "model_type": type(self.model).__name__ if self.model else None,
            "scaler_type": type(self.scaler).__name__ if self.scaler else None,
            "n_features": len(self.feature_names) if self.feature_names else 0,
            "metadata": self.model_metadata,
            "is_loaded": self.is_loaded()
        }
