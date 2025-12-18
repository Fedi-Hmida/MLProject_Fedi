# Makefile for MLProject Pipeline Automation
# Project: Sahitna Safe - Breast Cancer Risk Assessment

.PHONY: help install install-backend install-frontend setup clean \
        run-backend run-frontend run-all dev \
        test test-backend test-frontend \
        lint lint-backend lint-frontend format \
        build build-frontend train-model \
        docker-build docker-up docker-down

# Default target
.DEFAULT_GOAL := help

# Colors for terminal output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Project paths
BACKEND_DIR := FastAPI
FRONTEND_DIR := frontend
VENV_DIR := .venv
MODELS_DIR := saved_models

# Python and Node commands
PYTHON := python
PIP := pip
NPM := npm
UVICORN := uvicorn

##@ Help

help: ## Display this help message
	@echo "Sahitna Safe - ML Project Pipeline"
	@echo "===================================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  install              Install all dependencies (backend + frontend)"
	@echo "  install-backend      Install Python backend dependencies"
	@echo "  install-frontend     Install Node.js frontend dependencies"
	@echo "  setup                Complete project setup (venv + dependencies)"
	@echo ""
	@echo "Development:"
	@echo "  run-backend          Start FastAPI backend server"
	@echo "  run-frontend         Start Next.js frontend server"
	@echo "  dev                  Show development instructions"
	@echo ""
	@echo "Testing:"
	@echo "  test                 Run all tests"
	@echo "  test-backend         Run backend tests"
	@echo "  test-frontend        Run frontend tests"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint                 Run linters on all code"
	@echo "  lint-backend         Lint Python code"
	@echo "  lint-frontend        Lint TypeScript code"
	@echo "  format               Format all code"
	@echo ""
	@echo "Build & Production:"
	@echo "  build                Build for production"
	@echo "  build-frontend       Build Next.js frontend"
	@echo ""
	@echo "Machine Learning:"
	@echo "  train-model          Train/retrain the ML model"
	@echo "  evaluate-model       Evaluate model performance"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build         Build Docker containers"
	@echo "  docker-up            Start Docker containers"
	@echo "  docker-down          Stop Docker containers"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean                Clean up caches and generated files"
	@echo "  clean-all            Deep clean (including dependencies)"
	@echo ""
	@echo "Quick Commands:"
	@echo "  start                Quick start (run both servers)"
	@echo "  stop                 Stop all services"
	@echo "  restart              Restart all services"

##@ Setup & Installation

install: install-backend install-frontend ## Install all dependencies (backend + frontend)
	@echo "$(GREEN)✓ All dependencies installed successfully$(NC)"

install-backend: ## Install Python backend dependencies
	@echo "$(BLUE)Installing backend dependencies...$(NC)"
	@cd $(BACKEND_DIR) && $(PIP) install -r requirements.txt
	@echo "$(GREEN)✓ Backend dependencies installed$(NC)"

install-frontend: ## Install Node.js frontend dependencies
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) install
	@echo "$(GREEN)✓ Frontend dependencies installed$(NC)"

setup: ## Complete project setup (venv + dependencies)
	@echo "$(BLUE)Setting up project environment...$(NC)"
	@$(PYTHON) -m venv $(VENV_DIR)
	@echo "$(YELLOW)Activating virtual environment...$(NC)"
	@. $(VENV_DIR)/Scripts/activate && make install
	@echo "$(GREEN)✓ Project setup complete$(NC)"

##@ Development

dev: ## Run backend and frontend in development mode (use separate terminals)
	@echo "$(YELLOW)Run 'make run-backend' in one terminal$(NC)"
	@echo "$(YELLOW)Run 'make run-frontend' in another terminal$(NC)"

run-backend: ## Start FastAPI backend server
	@echo "$(BLUE)Starting FastAPI backend on port 8000...$(NC)"
	@cd $(BACKEND_DIR) && $(UVICORN) app.main:app --reload --host 0.0.0.0 --port 8000

run-frontend: ## Start Next.js frontend server
	@echo "$(BLUE)Starting Next.js frontend on port 3000...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run dev

run-all: ## Run both backend and frontend (requires 'concurrently' package)
	@echo "$(BLUE)Starting all services...$(NC)"
	@$(NPM) install -g concurrently
	@concurrently "make run-backend" "make run-frontend"

##@ Testing

test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests with pytest
	@echo "$(BLUE)Running backend tests...$(NC)"
	@cd $(BACKEND_DIR) && pytest tests/ -v --cov=app --cov-report=term-missing
	@echo "$(GREEN)✓ Backend tests completed$(NC)"

test-frontend: ## Run frontend tests with Jest
	@echo "$(BLUE)Running frontend tests...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) test
	@echo "$(GREEN)✓ Frontend tests completed$(NC)"

##@ Code Quality

lint: lint-backend lint-frontend ## Run linters on all code

lint-backend: ## Lint Python code with flake8 and mypy
	@echo "$(BLUE)Linting backend code...$(NC)"
	@cd $(BACKEND_DIR) && flake8 app/ --max-line-length=100 --exclude=__pycache__
	@cd $(BACKEND_DIR) && mypy app/ --ignore-missing-imports
	@echo "$(GREEN)✓ Backend linting complete$(NC)"

lint-frontend: ## Lint TypeScript/JavaScript code with ESLint
	@echo "$(BLUE)Linting frontend code...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run lint
	@echo "$(GREEN)✓ Frontend linting complete$(NC)"

format: ## Format code (black for Python, prettier for JS/TS)
	@echo "$(BLUE)Formatting code...$(NC)"
	@cd $(BACKEND_DIR) && black app/ tests/
	@cd $(FRONTEND_DIR) && $(NPM) run format || npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"
	@echo "$(GREEN)✓ Code formatting complete$(NC)"

##@ Build & Production

build: build-frontend ## Build for production

build-frontend: ## Build Next.js frontend for production
	@echo "$(BLUE)Building frontend for production...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run build
	@echo "$(GREEN)✓ Frontend build complete$(NC)"

start-prod: ## Start production servers
	@echo "$(BLUE)Starting production servers...$(NC)"
	@concurrently "cd $(BACKEND_DIR) && $(UVICORN) app.main:app --host 0.0.0.0 --port 8000" \
	              "cd $(FRONTEND_DIR) && $(NPM) start"

##@ Machine Learning

train-model: ## Train/retrain the ML model
	@echo "$(BLUE)Training machine learning model...$(NC)"
	@$(PYTHON) scripts/train_model.py
	@echo "$(GREEN)✓ Model training complete. Saved to $(MODELS_DIR)$(NC)"

evaluate-model: ## Evaluate model performance
	@echo "$(BLUE)Evaluating model performance...$(NC)"
	@$(PYTHON) scripts/evaluate_model.py
	@echo "$(GREEN)✓ Model evaluation complete$(NC)"

run-notebook: ## Start Jupyter notebook server
	@echo "$(BLUE)Starting Jupyter notebook...$(NC)"
	@jupyter notebook

##@ Docker Operations

docker-build: ## Build Docker containers
	@echo "$(BLUE)Building Docker containers...$(NC)"
	@docker-compose build
	@echo "$(GREEN)✓ Docker containers built$(NC)"

docker-up: ## Start Docker containers
	@echo "$(BLUE)Starting Docker containers...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Docker containers running$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:8000$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(NC)"

docker-down: ## Stop Docker containers
	@echo "$(BLUE)Stopping Docker containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Docker containers stopped$(NC)"

docker-logs: ## View Docker logs
	@docker-compose logs -f

##@ Database (if applicable)

db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	@cd $(BACKEND_DIR) && alembic upgrade head
	@echo "$(GREEN)✓ Database migrations complete$(NC)"

db-seed: ## Seed database with sample data
	@echo "$(BLUE)Seeding database...$(NC)"
	@$(PYTHON) scripts/seed_database.py
	@echo "$(GREEN)✓ Database seeding complete$(NC)"

##@ Maintenance

clean: ## Clean up generated files and caches
	@echo "$(BLUE)Cleaning up project...$(NC)"
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@find . -type f -name "*.pyo" -delete 2>/dev/null || true
	@find . -type f -name "*.log" -delete 2>/dev/null || true
	@cd $(FRONTEND_DIR) && rm -rf .next node_modules/.cache 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-all: clean ## Deep clean (including node_modules and venv)
	@echo "$(RED)Deep cleaning project (including dependencies)...$(NC)"
	@rm -rf $(VENV_DIR)
	@cd $(FRONTEND_DIR) && rm -rf node_modules
	@echo "$(GREEN)✓ Deep cleanup complete$(NC)"

##@ Git Operations

git-status: ## Check git status
	@git status

git-push: ## Stage, commit and push changes
	@echo "$(BLUE)Staging changes...$(NC)"
	@git add .
	@echo "$(YELLOW)Enter commit message: $(NC)" && read msg && git commit -m "$$msg"
	@git push
	@echo "$(GREEN)✓ Changes pushed to remote$(NC)"

##@ Deployment

deploy-vercel: ## Deploy frontend to Vercel
	@echo "$(BLUE)Deploying to Vercel...$(NC)"
	@cd $(FRONTEND_DIR) && vercel --prod
	@echo "$(GREEN)✓ Deployed to Vercel$(NC)"

deploy-railway: ## Deploy backend to Railway
	@echo "$(BLUE)Deploying to Railway...$(NC)"
	@railway up
	@echo "$(GREEN)✓ Deployed to Railway$(NC)"

##@ Documentation

docs: ## Generate project documentation
	@echo "$(BLUE)Generating documentation...$(NC)"
	@cd $(BACKEND_DIR) && pdoc --html --output-dir ../docs app/
	@echo "$(GREEN)✓ Documentation generated in docs/$(NC)"

api-docs: ## View API documentation
	@echo "$(YELLOW)Opening API docs at http://localhost:8000/docs$(NC)"
	@xdg-open http://localhost:8000/docs 2>/dev/null || open http://localhost:8000/docs 2>/dev/null || start http://localhost:8000/docs

##@ Monitoring

health-check: ## Check if services are running
	@echo "Checking service health..."
	@powershell -Command "try { Invoke-WebRequest -Uri http://localhost:8000/health -UseBasicParsing | Out-Null; Write-Host '✓ Backend is running' } catch { Write-Host '✗ Backend is down' -ForegroundColor Red }"
	@powershell -Command "try { Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing | Out-Null; Write-Host '✓ Frontend is running' } catch { Write-Host '✗ Frontend is down' -ForegroundColor Red }"

logs-backend: ## View backend logs
	@tail -f $(BACKEND_DIR)/logs/*.log 2>/dev/null || echo "No logs found"

logs-frontend: ## View frontend logs (dev server output)
	@echo "Frontend logs are in the terminal running 'npm run dev'"

##@ Quick Commands (Windows-friendly)

start: ## Quick start - run backend and frontend
	@echo "Starting Sahitna Safe..."
	@echo "Backend will run on: http://localhost:8000"
	@echo "Frontend will run on: http://localhost:3000"
	@echo ""
	@echo "Opening two PowerShell windows..."
	@powershell -Command "Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd $(CURDIR); .\.venv\Scripts\Activate.ps1; cd $(BACKEND_DIR); uvicorn app.main:app --reload'"
	@powershell -Command "Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd $(CURDIR)\$(FRONTEND_DIR); npm run dev'"
	@echo "✓ Services started in separate windows"

stop: ## Stop all services (kill ports 3000 and 8000)
	@echo "Stopping all services..."
	@powershell -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $$_ -Force }" 2>nul || echo ""
	@powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $$_ -Force }" 2>nul || echo ""
	@echo "✓ Services stopped"

restart: stop start ## Restart all services

check-ports: ## Check which ports are in use
	@echo "Checking ports 3000 and 8000..."
	@powershell -Command "Get-NetTCPConnection -LocalPort 3000,8000 -ErrorAction SilentlyContinue | Format-Table -Property LocalPort, State, OwningProcess -AutoSize" || echo "Ports are free"

info: ## Show project information
	@echo "=================================="
	@echo "Sahitna Safe"
	@echo "Breast Cancer Risk Assessment System"
	@echo "=================================="
	@echo ""
	@echo "Backend:  FastAPI (Python)"
	@echo "Frontend: Next.js 15 + React 19"
	@echo "ML Model: Logistic Regression"
	@echo ""
	@echo "URLs:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8000"
	@echo "  API Docs: http://localhost:8000/docs"
	@echo ""
	@echo "Quick Start:"
	@echo "  make start    - Start both servers"
	@echo "  make stop     - Stop all services"
	@echo "  make help     - Show all commands"
