"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    BookOpen,
    ChevronDown,
    Circle,
    GitBranch,
    Info,
    Lightbulb,
    Maximize2,
    Ruler,
    Search,
    Target,
    Waves,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Feature categories with detailed explanations
const featureCategories = [
  {
    id: "size",
    name: "Size Features",
    icon: Maximize2,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Measurements related to the physical size of cell nuclei",
    features: [
      {
        name: "radius",
        fullName: "Radius",
        unit: "μm",
        description: "Mean distance from the center to points on the perimeter of the cell nucleus.",
        clinicalMeaning: "Larger nuclei often indicate more aggressive cell growth, which can be a sign of malignancy.",
        normalRange: "6-10 μm (benign), 10-20+ μm (malignant)",
        importance: "high",
      },
      {
        name: "perimeter",
        fullName: "Perimeter",
        unit: "μm",
        description: "The total boundary length around the cell nucleus.",
        clinicalMeaning: "Increased perimeter correlates with larger cell size, often seen in cancerous cells.",
        normalRange: "40-80 μm (benign), 80-200+ μm (malignant)",
        importance: "high",
      },
      {
        name: "area",
        fullName: "Area",
        unit: "μm²",
        description: "The total surface area of the cell nucleus.",
        clinicalMeaning: "Malignant cells typically have larger nuclear areas due to uncontrolled growth.",
        normalRange: "150-500 μm² (benign), 500-2500+ μm² (malignant)",
        importance: "high",
      },
    ],
  },
  {
    id: "shape",
    name: "Shape Features",
    icon: Circle,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    description: "Measurements describing the shape and regularity of cell nuclei",
    features: [
      {
        name: "compactness",
        fullName: "Compactness",
        unit: "ratio",
        description: "Calculated as (perimeter² / area - 1.0). Measures how compact the nucleus is.",
        clinicalMeaning: "Higher compactness indicates irregular shapes, common in malignant cells.",
        normalRange: "0.02-0.1 (benign), 0.1-0.35+ (malignant)",
        importance: "medium",
      },
      {
        name: "concavity",
        fullName: "Concavity",
        unit: "ratio",
        description: "Severity of concave portions of the nucleus contour.",
        clinicalMeaning: "Malignant nuclei often have irregular, indented boundaries.",
        normalRange: "0-0.05 (benign), 0.05-0.45+ (malignant)",
        importance: "high",
      },
      {
        name: "concave points",
        fullName: "Concave Points",
        unit: "count",
        description: "Number of concave (indented) portions of the nucleus contour.",
        clinicalMeaning: "More concave points suggest irregular nuclear shape associated with cancer.",
        normalRange: "0-0.03 (benign), 0.03-0.2+ (malignant)",
        importance: "high",
      },
      {
        name: "symmetry",
        fullName: "Symmetry",
        unit: "ratio",
        description: "Measure of how symmetric the nucleus is along its major axis.",
        clinicalMeaning: "Cancer cells often show asymmetric nuclear shapes.",
        normalRange: "0.1-0.2 (benign), 0.15-0.35+ (malignant)",
        importance: "medium",
      },
      {
        name: "fractal dimension",
        fullName: "Fractal Dimension",
        unit: "ratio",
        description: "\"Coastline approximation\" - measures boundary complexity using fractal geometry.",
        clinicalMeaning: "Higher values indicate more complex, irregular boundaries typical of malignancy.",
        normalRange: "0.05-0.07 (benign), 0.06-0.1+ (malignant)",
        importance: "low",
      },
    ],
  },
  {
    id: "texture",
    name: "Texture Features",
    icon: Waves,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "Measurements of the surface texture and uniformity of cells",
    features: [
      {
        name: "texture",
        fullName: "Texture",
        unit: "gray-scale",
        description: "Standard deviation of gray-scale values in the cell image.",
        clinicalMeaning: "Higher texture variation can indicate heterogeneous chromatin distribution seen in cancer.",
        normalRange: "10-18 (benign), 17-40+ (malignant)",
        importance: "high",
      },
      {
        name: "smoothness",
        fullName: "Smoothness",
        unit: "ratio",
        description: "Local variation in radius lengths. Calculated as 1 - (1/variance).",
        clinicalMeaning: "Cancer cells often have less smooth nuclear boundaries.",
        normalRange: "0.05-0.1 (benign), 0.08-0.16+ (malignant)",
        importance: "medium",
      },
    ],
  },
];

// Statistics types explanation
const statisticTypes = [
  {
    name: "Mean",
    suffix: "_mean",
    description: "Average value across all nuclei in the sample",
    icon: Target,
    color: "text-blue-500",
  },
  {
    name: "Standard Error (SE)",
    suffix: "_se",
    description: "Measure of variability in measurements",
    icon: GitBranch,
    color: "text-purple-500",
  },
  {
    name: "Worst",
    suffix: "_worst",
    description: "Largest/most severe value (mean of 3 largest nuclei)",
    icon: AlertCircle,
    color: "text-red-500",
  },
];

// Feature card component
function FeatureCard({ feature, categoryColor }: { feature: typeof featureCategories[0]["features"][0]; categoryColor: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const importanceColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{feature.fullName}</h3>
            <p className="text-sm text-slate-500">Unit: {feature.unit}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${importanceColors[feature.importance as keyof typeof importanceColors]}`}>
            {feature.importance} importance
          </span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-4 bg-slate-50/50">
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  What is it?
                </h4>
                <p className="text-slate-600">{feature.description}</p>
              </div>

              {/* Clinical Meaning */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Clinical Significance
                </h4>
                <p className="text-slate-600">{feature.clinicalMeaning}</p>
              </div>

              {/* Normal Range */}
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Typical Ranges</h4>
                <p className="text-sm text-slate-600 font-mono">{feature.normalRange}</p>
              </div>

              {/* Feature variations */}
              <div className="flex gap-2 flex-wrap">
                {statisticTypes.map((stat) => (
                  <span
                    key={stat.suffix}
                    className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200"
                  >
                    {feature.name}{stat.suffix}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter features based on search and category
  const filteredCategories = useMemo(() => {
    return featureCategories
      .filter((cat) => !selectedCategory || cat.id === selectedCategory)
      .map((cat) => ({
        ...cat,
        features: cat.features.filter(
          (f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((cat) => cat.features.length > 0);
  }, [searchQuery, selectedCategory]);

  const totalFeatures = featureCategories.reduce((acc, cat) => acc + cat.features.length, 0);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden mesh-gradient">
        <div className="container-app py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm">
                Educational Resource
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Feature Guide
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Understand the 30 diagnostic features used in breast cancer prediction.
              Each feature captures unique characteristics of cell nuclei from Fine Needle Aspirate (FNA) images.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-white font-semibold">{totalFeatures * 3}</span>
                <span className="text-white/70 ml-2">Total Features</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-white font-semibold">3</span>
                <span className="text-white/70 ml-2">Categories</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-white font-semibold">3</span>
                <span className="text-white/70 ml-2">Statistics per Feature</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Features Work Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container-app">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How Features are Calculated</h2>
          <p className="text-slate-600 mb-8 max-w-3xl">
            For each cell nucleus image, 10 base features are computed. Then, for each base feature, 
            three statistics are calculated, resulting in 30 total features:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {statisticTypes.map((stat, index) => (
              <motion.div
                key={stat.suffix}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{stat.name}</h3>
                <p className="text-slate-600 text-sm mb-3">{stat.description}</p>
                <code className="px-2 py-1 bg-slate-200 rounded text-sm text-slate-700">
                  feature{stat.suffix}
                </code>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
        <div className="container-app">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Features
              </button>
              {featureCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-12">
        <div className="container-app">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No features found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
                      <p className="text-slate-500">{category.description}</p>
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid gap-4">
                    {category.features.map((feature) => (
                      <FeatureCard
                        key={feature.name}
                        feature={feature}
                        categoryColor={category.color}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container-app">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Try Prediction?
            </h2>
            <p className="text-slate-600 mb-8">
              Now that you understand the features, try running a prediction with your own data.
            </p>
            <Link
              href="/prediction"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <span>Go to Prediction</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50 border-t border-amber-200">
        <div className="container-app">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Medical Disclaimer</h3>
              <p className="text-amber-700 text-sm">
                This feature guide is for educational purposes only. The ranges and clinical interpretations 
                provided are general guidelines based on the Wisconsin Breast Cancer Dataset. Always consult 
                with qualified healthcare professionals for medical diagnosis and treatment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
