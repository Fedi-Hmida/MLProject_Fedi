"use client";

import { motion } from "framer-motion";
import {
    Activity,
    BarChart3,
    BookOpen,
    Brain,
    CheckCircle2,
    Code2,
    Database,
    FileText,
    FlaskConical, GraduationCap, Layers,
    Lightbulb,
    LineChart,
    Microscope,
    Server,
    Shield,
    Sparkles,
    Target, Zap
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden mesh-gradient">
        {/* Animated Orbs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white">
              About This Project
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Sahitna Safe: A comprehensive machine learning platform for breast cancer risk assessment, 
              built as part of an academic project following the CRISP-DM methodology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-16">
        {/* Project Overview */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Project Overview</h2>
            <p className="text-slate-600">
              This project implements a binary classification model to predict whether a breast tumor 
              is malignant or benign based on features computed from digitized images of Fine Needle 
              Aspirate (FNA) of breast masses.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Objective",
                description: "Develop an accurate ML model to assist in early breast cancer detection and provide explainable predictions.",
                color: "blue",
              },
              {
                icon: Database,
                title: "Dataset",
                description: "Wisconsin Diagnostic Breast Cancer (WDBC) dataset with 569 samples and 30 features.",
                color: "purple",
              },
              {
                icon: Brain,
                title: "Model",
                description: "Logistic Regression classifier achieving high accuracy with interpretable feature contributions.",
                color: "emerald",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${item.color}-100 flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CRISP-DM Methodology */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              Methodology
            </span>
            <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-4">CRISP-DM Framework</h2>
            <p className="text-slate-600">
              The project follows the Cross-Industry Standard Process for Data Mining (CRISP-DM), 
              a robust and well-proven methodology for data science projects.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { phase: "1", title: "Business Understanding", icon: Lightbulb, description: "Define objectives and requirements from a medical perspective" },
              { phase: "2", title: "Data Understanding", icon: Database, description: "Explore and analyze the WDBC dataset characteristics" },
              { phase: "3", title: "Data Preparation", icon: FlaskConical, description: "Clean, transform, and prepare features for modeling" },
              { phase: "4", title: "Modeling", icon: Brain, description: "Train and optimize the Logistic Regression classifier" },
              { phase: "5", title: "Evaluation", icon: BarChart3, description: "Assess model performance with cross-validation" },
              { phase: "6", title: "Deployment", icon: Server, description: "Deploy via FastAPI backend and Next.js frontend" },
            ].map((item) => (
              <motion.div
                key={item.phase}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-200/50 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{item.phase}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              Technology
            </span>
            <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-4">Tech Stack</h2>
            <p className="text-slate-600">
              Built with modern technologies for performance, scalability, and excellent developer experience.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6">
            {/* Backend */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Backend</h3>
                  <p className="text-sm text-slate-500">API & ML Services</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "FastAPI", desc: "High-performance Python web framework" },
                  { name: "Scikit-learn", desc: "Machine learning library" },
                  { name: "Pandas & NumPy", desc: "Data manipulation and analysis" },
                  { name: "Uvicorn", desc: "ASGI server for production" },
                ].map((tech) => (
                  <div key={tech.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <span className="font-medium text-slate-800">{tech.name}</span>
                      <span className="text-slate-500 text-sm ml-2">— {tech.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frontend */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Frontend</h3>
                  <p className="text-sm text-slate-500">User Interface</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Next.js 15", desc: "React framework with App Router" },
                  { name: "TypeScript", desc: "Type-safe JavaScript" },
                  { name: "Tailwind CSS", desc: "Utility-first CSS framework" },
                  { name: "Framer Motion", desc: "Animation library" },
                  { name: "Recharts", desc: "Data visualization" },
                ].map((tech) => (
                  <div key={tech.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="font-medium text-slate-800">{tech.name}</span>
                      <span className="text-slate-500 text-sm ml-2">— {tech.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Features
            </span>
            <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-4">Key Features</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Microscope, title: "Binary Classification", desc: "Malignant vs Benign prediction" },
              { icon: LineChart, title: "Confidence Scores", desc: "Probability estimates for each class" },
              { icon: Shield, title: "Risk Stratification", desc: "Low, Medium, High risk categories" },
              { icon: Sparkles, title: "Explainable AI", desc: "Feature contribution visualization" },
              { icon: Activity, title: "Real-time Predictions", desc: "Instant model inference" },
              { icon: FileText, title: "Clinical Actions", desc: "Recommended next steps" },
              { icon: Zap, title: "Fast Performance", desc: "Optimized API responses" },
              { icon: Code2, title: "REST API", desc: "Programmatic access available" },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-200/50 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Dataset Info */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-200/50"
        >
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Dataset Information</h2>
              <p className="text-slate-600">
                Wisconsin Diagnostic Breast Cancer (WDBC) dataset from UCI Machine Learning Repository.
              </p>
            </div>
            <div className="md:w-2/3 grid sm:grid-cols-2 gap-4">
              {[
                { label: "Total Samples", value: "569" },
                { label: "Malignant Cases", value: "212 (37.3%)" },
                { label: "Benign Cases", value: "357 (62.7%)" },
                { label: "Features", value: "30 numeric" },
                { label: "Feature Types", value: "Mean, SE, Worst" },
                { label: "Source", value: "UCI ML Repository" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-slate-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-amber-50 border border-amber-200 rounded-3xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Disclaimer</h3>
              <p className="text-amber-700 text-sm">
                This application is developed for <strong>educational and research purposes only</strong>. 
                It is not intended to be used as a medical diagnostic tool. The predictions provided by this 
                system should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
                Always consult with qualified healthcare providers for medical decisions.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Academic Context */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Academic Project</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            This project was developed as part of a Machine Learning course, demonstrating the complete 
            lifecycle of a data science project from data understanding to deployment.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
              Machine Learning
            </span>
            <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
              Data Science
            </span>
            <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
              Full Stack Development
            </span>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
