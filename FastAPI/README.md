# Breast Cancer Detection API

FastAPI backend for breast cancer classification and risk stratification using machine learning models.

## Features

- **Binary Classification**: Predict Benign/Malignant diagnosis
- **Risk Stratification**: Categorize patients into Low/Medium/High risk groups
- **Clinical Recommendations**: Provide evidence-based follow-up guidance
- **Batch Processing**: Handle multiple predictions in a single request
- **Auto Documentation**: Interactive API docs at `/docs` and `/redoc`

## Project Structure

```
FastAPI/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py           # API endpoint definitions
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py           # Configuration and settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Pydantic models for validation
│   └── services/
│       ├── __init__.py
│       └── ml_service.py       # ML model loading and inference
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
├── .gitignore
└── README.md
```

## Installation

### 1. Create Virtual Environment

```powershell
# Navigate to FastAPI directory
cd c:\Users\Fedih\Downloads\MLProject\FastAPI

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Configure Environment

```powershell
# Copy environment template
cp .env.example .env

# Edit .env with your settings (optional)
# Default values should work if models are in ../models/
```

## Usage

### Start the Server

```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Start server with auto-reload (development)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python -m app.main
```

Server will start at: **http://localhost:8000**

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Health & Info

- `GET /` - Root endpoint with API information
- `GET /api/v1/health` - Health check and model status
- `GET /api/v1/model-info` - Detailed model information
- `GET /api/v1/features` - Feature names and metadata

### Predictions

- `POST /api/v1/predict` - Binary classification (Benign/Malignant)
- `POST /api/v1/risk-stratify` - Risk stratification with recommendations
- `POST /api/v1/batch-predict` - Batch predictions (max 100 samples)

## Example Usage

### 1. Health Check

```bash
curl http://localhost:8000/api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0",
  "timestamp": "2025-12-13T12:00:00"
}
```

### 2. Predict Diagnosis

```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "radius_mean": 17.99,
    "texture_mean": 10.38,
    "perimeter_mean": 122.8,
    ... (all 30 features)
  }'
```

**Response:**
```json
{
  "diagnosis": "Malignant",
  "confidence": 0.98,
  "probability_malignant": 0.98,
  "probability_benign": 0.02,
  "model_version": "Logistic Regression v1.0",
  "timestamp": "2025-12-13T12:00:00"
}
```

### 3. Risk Stratification

```bash
curl -X POST http://localhost:8000/api/v1/risk-stratify \
  -H "Content-Type: application/json" \
  -d '{...features...}'
```

**Response:**
```json
{
  "risk_category": "High",
  "risk_score": 0.98,
  "diagnosis": "Malignant",
  "confidence": 0.98,
  "recommendation": {
    "action": "Immediate Clinical Attention",
    "description": "High probability of malignancy. Urgent diagnostic workup required.",
    "follow_up": "Immediate biopsy and pathological examination",
    "priority": "Urgent"
  },
  "thresholds": {
    "low": 0.20,
    "high": 0.70
  },
  "model_version": "Logistic Regression v1.0",
  "timestamp": "2025-12-13T12:00:00"
}
```

## Risk Stratification

The system uses evidence-based thresholds aligned with BI-RADS Category 2 criteria:

| Risk Level | Threshold | Recommendation | Priority |
|-----------|-----------|----------------|----------|
| **Low** | < 20% | Routine surveillance, annual screening | Standard |
| **Medium** | 20-70% | Additional testing (ultrasound, MRI, biopsy) | Elevated |
| **High** | > 70% | Immediate biopsy and clinical workup | Urgent |

## Model Information

- **Algorithm**: Logistic Regression (optimized via GridSearchCV)
- **Performance**: 98.83% accuracy, 98.44% sensitivity, 99.07% specificity
- **Dataset**: Wisconsin Diagnostic Breast Cancer (30 features)
- **Validation**: Clinically safe - 0 false negatives in Low Risk category

## Development

### Run Tests

```powershell
pytest
```

### Code Quality

```powershell
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/
```

## Deployment

### Production Server

```powershell
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Docker (Coming Soon)

```bash
docker build -t breast-cancer-api .
docker run -p 8000:8000 breast-cancer-api
```

## Security Considerations

- **Input Validation**: All inputs validated via Pydantic schemas
- **Error Handling**: Comprehensive exception handling and logging
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Batch predictions limited to 100 samples
- **Logging**: All predictions logged with timestamps

## Performance

- **Average Response Time**: < 50ms per prediction
- **Model Load Time**: < 2 seconds at startup
- **Batch Processing**: ~100 predictions/second
- **Memory Usage**: ~200MB (model + dependencies)

## Troubleshooting

### Model Not Found

Ensure models are in the correct location:
```
MLProject/
├── models/
│   ├── best_model.pkl
│   ├── scaler.pkl
│   ├── feature_names.pkl
│   └── model_metadata.pkl
└── FastAPI/
    └── app/
```

### Port Already in Use

```powershell
# Use different port
uvicorn app.main:app --port 8001
```

### Import Errors

```powershell
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## License

This project is part of an academic Machine Learning project following CRISP-DM methodology.

## Contact

For issues or questions, please contact the development team.
