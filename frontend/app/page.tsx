"use client";

import { motion } from "framer-motion";
import {
    Activity,
    ArrowRight, Brain,
    CheckCircle2,
    Database,
    FileText,
    Github,
    Heart,
    Shield,
    Stethoscope,
    Target,
    TrendingUp,
    Zap
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Brain,
    title: "Machine Learning Core",
    description: "Logistic Regression model trained on the Wisconsin Diagnostic Breast Cancer Dataset with 96%+ validated accuracy.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Stethoscope,
    title: "Clinical-Oriented Design",
    description: "Risk stratification aligned with clinical thresholds to assist medical decision-making and patient care.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Real-Time Predictions",
    description: "Instant inference via FastAPI backend with explainable AI insights for transparent decision support.",
    gradient: "from-orange-500 to-red-500"
  }
];

const stats = [
  { value: "96%", label: "Model Accuracy", icon: Target },
  { value: "30", label: "Clinical Features", icon: Database },
  { value: "<100ms", label: "Response Time", icon: Zap },
  { value: "3-Tier", label: "Risk Levels", icon: Shield }
];

const techStack = [
  { name: "Python", icon: "🐍" },
  { name: "FastAPI", icon: "⚡" },
  { name: "Scikit-learn", icon: "🔬" },
  { name: "Next.js", icon: "▲" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "TypeScript", icon: "📘" }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-gradient">
        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />

        <div className="container-app relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-blue-300 backdrop-blur-sm">
                  <Activity className="w-4 h-4" />
                  AI-Powered Clinical Decision Support
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                Breast Cancer
                <br />
                <span className="gradient-text-primary">Detection & Risk</span>
                <br />
                Stratification
              </motion.h1>

              {/* Description */}
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed"
              >
                A machine learning-powered clinical decision support system for breast cancer 
                diagnosis and risk assessment, built on the Wisconsin Diagnostic Dataset.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                <Link href="/prediction" className="btn-primary group flex items-center gap-2">
                  <span>Run Prediction</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
                <Link href="/about" className="btn-secondary flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Learn More</span>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 pt-6">
                {[
                  "Validated Model",
                  "Explainable AI",
                  "Clinical Thresholds"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              {/* Main Card */}
              <div className="relative glass-dark rounded-3xl p-8 shadow-2xl">
                {/* Mock Dashboard Preview */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Patient Analysis</p>
                        <p className="text-slate-400 text-sm">Real-time prediction</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      Active
                    </div>
                  </div>

                  {/* Mock Result */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Diagnosis</span>
                      <span className="text-emerald-400 font-bold text-xl">Benign</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Confidence</span>
                        <span className="text-white">94.2%</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "94.2%" }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mock Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "radius_mean", value: "14.25" },
                      { name: "texture_mean", value: "18.72" },
                      { name: "perimeter_mean", value: "92.15" },
                      { name: "area_mean", value: "654.8" }
                    ].map((feature) => (
                      <div key={feature.name} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-500 truncate">{feature.name}</p>
                        <p className="text-white font-medium">{feature.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl"
                >
                  <p className="text-white text-sm font-medium">96% Accuracy</p>
                </motion.div>
              </div>

              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="relative bg-white border-y border-slate-200">
        <div className="container-app py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center space-y-3"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="section-padding bg-slate-50">
        <div className="container-app">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-16"
          >
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Key Capabilities
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
                Sahitna Safe Platform
              </h2>
              <p className="text-lg text-slate-600">
                Built with medical professionals in mind, our platform combines cutting-edge 
                machine learning with clinical best practices.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group relative glass-card rounded-2xl p-8 card-hover"
                  >
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= TECH STACK SECTION ================= */}
      <section className="section-padding bg-white">
        <div className="container-app">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Leveraging the best tools in data science and web development for a reliable, 
                scalable, and maintainable platform.
              </p>
            </motion.div>

            <motion.div 
              variants={stagger}
              className="flex flex-wrap justify-center gap-4"
            >
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 cursor-default"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="font-medium text-slate-700">{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container-app relative z-10 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center space-y-8"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-2xl mx-auto"
            >
              Try our prediction model with sample data or enter your own clinical measurements 
              for instant results.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/prediction" className="btn-primary group flex items-center gap-2">
                <span>Start Prediction</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <Link href="/about" className="btn-secondary flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>About Project</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container-app py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">Sahitna Safe</span>
              </div>
              <p className="text-slate-400 max-w-md">
                An academic machine learning project for breast cancer detection and risk 
                stratification. Built with care for clinical decision support.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Platform</h4>
              <div className="space-y-2">
                <Link href="/prediction" className="block text-slate-400 hover:text-white transition-colors">
                  Prediction
                </Link>
                <Link href="/features" className="block text-slate-400 hover:text-white transition-colors">
                  Feature Guide
                </Link>
                <Link href="/about" className="block text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                  Documentation
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 Sahitna Safe. Academic Project.
            </p>
            <p className="flex items-center gap-1 text-slate-500 text-sm">
              Made with <Heart className="w-4 h-4 text-red-500" /> for better healthcare
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
