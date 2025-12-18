# 🧠 Breast Cancer Detection – Frontend (Next.js)

This repository contains the **frontend application** for the **Breast Cancer Detection & Risk Stratification System**, a machine learning–based clinical decision support tool.

The frontend is built with **Next.js (App Router)** and **Tailwind CSS**, and communicates with a **FastAPI backend** to provide real-time predictions and clinical risk analysis.

---

## 🎯 Project Objectives

The frontend aims to:

- Provide a **clean, medical-grade user interface**
- Allow users to **enter tumor measurements**
- Display **machine learning predictions** clearly
- Visualize **risk levels and probabilities**
- Ensure **good UX and accessibility**

---

## 🧩 Features

### 🏠 Landing Page
- Project presentation and context
- Navigation to prediction and risk modules

### 🧪 Breast Cancer Prediction
- Dynamic clinical input form (30 WDBC features)
- Auto-fill with sample patient data
- Prediction: Benign / Malignant
- Probability bars and confidence score

### 📊 Risk Stratification
- Risk category (Low / Medium / High)
- Risk score visualization
- Clinical recommendations
- Model metadata and thresholds

### 🎨 UI / UX
- Medical dashboard–style design
- Tab-based navigation for features
- Responsive layout
- Consistent visual hierarchy

---

## 🛠️ Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Communication:** REST (Fetch API)
- **Backend:** FastAPI (Python)

---

## 📂 Project Structure

frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── prediction/page.tsx   # Prediction page
│   ├── risk/page.tsx         # Risk stratification page
│   └── layout.tsx            # Global layout
│
├── components/
│   ├── FeatureForm.tsx
│   ├── Card.tsx
│   └── Navbar.tsx
│
├── constants/
│   ├── features.ts
│   └── sampleData.ts
│
├── services/
│   └── breastCancerApi.ts
│
├── public/images/
│   └── hero-medical.jpg
│
├── styles/globals.css
└── README.md

---

## 🔌 Backend Integration

Create a `.env.local` file:

NEXT_PUBLIC_API_URL=http://localhost:8000

Used endpoints:
- POST /api/v1/predict
- POST /api/v1/risk-stratify
- GET  /api/v1/health

---

## 🚀 Getting Started

Install dependencies:
npm install

Run development server:
npm run dev

Open browser:
http://localhost:3000

---

## 🎓 Academic Context

This project was developed for **educational purposes** in the context of:
- Machine Learning
- Clinical Decision Support Systems
- Frontend UX/UI Design

---

## ⚠️ Disclaimer

This application is for **educational and research purposes only**.
It is **not intended for real medical diagnosis**.
