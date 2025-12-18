"""
API route definitions and endpoint handlers.
"""

from fastapi import APIRouter, HTTPException, Request, status
from typing import List
import numpy as np
import logging
import time

from app.models.schemas import (
    FeatureInput,
    PredictionResponse,
    RiskStratificationResponse,
    HealthResponse,
    BatchFeatureInput,
    BatchPredictionResponse,
    RiskRecommendation
)
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check(request: Request):
    """
    Health check endpoint.
    Returns service status and model availability.
    """
    ml_service = request.app.state.ml_service
    
    return HealthResponse(
        status="healthy" if ml_service.is_loaded() else "unhealthy",
        model_loaded=ml_service.is_loaded(),
        version=settings.VERSION
    )


@router.get("/model-info", tags=["Health"])
async def get_model_info(request: Request):
    """
    Get detailed information about the loaded ML model.
    """
    ml_service = request.app.state.ml_service
    
    if not ml_service.is_loaded():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not loaded"
        )
    
    return ml_service.get_model_info()


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict(features: FeatureInput, request: Request):
    """
    Make binary classification prediction (Benign/Malignant).
    
    - **features**: All 30 breast cancer features
    - Returns diagnosis, confidence, and probabilities
    """
    try:
        ml_service = request.app.state.ml_service
        
        if not ml_service.is_loaded():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model is not loaded. Please contact administrator."
            )
        
        # Convert features to numpy array
        feature_array = np.array([features.to_list()])

        # Get comprehensive prediction details (includes explanations)
        details = ml_service.get_prediction_details(feature_array)

        logger.info(f"Prediction made: {details['diagnosis']} (confidence: {details['confidence']:.4f})")

        return PredictionResponse(
            diagnosis=details['diagnosis'],
            confidence=details['confidence'],
            probability_malignant=details['probability_malignant'],
            probability_benign=details['probability_benign'],
            model_version=details['model_version'],
            explanations=details.get('explanations', [])
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid input features: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@router.post("/risk-stratify", response_model=RiskStratificationResponse, tags=["Risk Stratification"])
async def risk_stratify(features: FeatureInput, request: Request):
    """
    Perform risk stratification with clinical recommendations.
    
    - **features**: All 30 breast cancer features
    - Returns risk category (Low/Medium/High), diagnosis, and clinical recommendations
    
    Risk Categories:
    - **Low Risk** (< 20%): Routine surveillance, annual screening
    - **Medium Risk** (20-70%): Additional diagnostic testing recommended
    - **High Risk** (> 70%): Immediate clinical attention required
    """
    try:
        ml_service = request.app.state.ml_service
        
        if not ml_service.is_loaded():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model is not loaded. Please contact administrator."
            )
        
        # Convert features to numpy array
        feature_array = np.array([features.to_list()])

        # Get comprehensive prediction details (includes explanations)
        details = ml_service.get_prediction_details(feature_array)
        
        logger.info(
            f"Risk stratification: {details['risk_category']} "
            f"(score: {details['risk_score']:.4f}, diagnosis: {details['diagnosis']})"
        )
        
        return RiskStratificationResponse(
            risk_category=details['risk_category'],
            risk_score=details['risk_score'],
            diagnosis=details['diagnosis'],
            confidence=details['confidence'],
            recommendation=RiskRecommendation(**details['recommendation']),
            thresholds=details['thresholds'],
            model_version=details['model_version']
            ,explanations=details.get('explanations', [])
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid input features: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Risk stratification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Risk stratification failed: {str(e)}"
        )


@router.post("/batch-predict", response_model=BatchPredictionResponse, tags=["Prediction"])
async def batch_predict(batch_input: BatchFeatureInput, request: Request):
    """
    Perform batch predictions on multiple samples (max 100 per request).
    
    - **samples**: List of feature sets
    - Returns list of predictions with processing time
    """
    try:
        ml_service = request.app.state.ml_service
        
        if not ml_service.is_loaded():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model is not loaded. Please contact administrator."
            )
        
        start_time = time.time()
        predictions = []
        
        for sample in batch_input.samples:
            feature_array = np.array([sample.to_list()])
            prediction, confidence = ml_service.predict(feature_array)
            probabilities = ml_service.predict_proba(feature_array)
            
            diagnosis = "Malignant" if prediction == 1 else "Benign"
            
            predictions.append(
                PredictionResponse(
                    diagnosis=diagnosis,
                    confidence=confidence,
                    probability_malignant=float(probabilities[1]),
                    probability_benign=float(probabilities[0]),
                    model_version=ml_service.model_metadata.get("model_name", "Logistic Regression v1.0")
                )
            )
        
        processing_time = time.time() - start_time
        
        logger.info(
            f"Batch prediction completed: {len(predictions)} samples "
            f"in {processing_time:.3f}s ({processing_time/len(predictions)*1000:.1f}ms per sample)"
        )
        
        return BatchPredictionResponse(
            predictions=predictions,
            total_samples=len(predictions),
            processing_time=processing_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid input: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch prediction failed: {str(e)}"
        )


@router.get("/features", tags=["Metadata"])
async def get_feature_info():
    """
    Get information about required input features.
    Returns feature names, descriptions, and validation rules.
    """
    feature_info = {
        "total_features": settings.EXPECTED_FEATURES,
        "feature_names": settings.FEATURE_NAMES,
        "feature_groups": {
            "mean": settings.FEATURE_NAMES[:10],
            "standard_error": settings.FEATURE_NAMES[10:20],
            "worst": settings.FEATURE_NAMES[20:]
        },
        "risk_thresholds": {
            "low": settings.LOW_RISK_THRESHOLD,
            "high": settings.HIGH_RISK_THRESHOLD
        }
    }
    
    return feature_info
