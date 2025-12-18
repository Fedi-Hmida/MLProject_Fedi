"use client";

import { ExplanationItem } from "@/services/breastCancerApi";
import { motion } from "framer-motion";
import { ArrowDownAZ, ArrowUpDown, Info, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

interface ExplanationChartProps {
  explanations: ExplanationItem[];
  title?: string;
}

type SortType = "importance" | "alphabetical" | "contribution";

interface TooltipPayload {
  payload: {
    fullFeature: string;
    contribution: number;
    direction: string;
  };
}

// Custom tooltip component - defined outside to prevent recreation
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.contribution > 0;

    return (
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 max-w-xs">
        <p className="font-semibold text-slate-800 mb-2">{data.fullFeature}</p>
        <div className="flex items-center gap-2 mb-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          )}
          <span className={`font-medium ${isPositive ? "text-red-600" : "text-emerald-600"}`}>
            {data.direction}
          </span>
        </div>
        <p className="text-sm text-slate-600">
          Contribution: <span className="font-mono font-semibold">{Math.abs(data.contribution).toFixed(4)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ExplanationChart({
  explanations,
  title = "Feature Contributions (Explainable AI)",
}: ExplanationChartProps) {
  const [sortType, setSortType] = useState<SortType>("importance");
  const [showAll, setShowAll] = useState(false);

  // Sort and prepare data using useMemo
  const chartData = useMemo(() => {
    if (!explanations || explanations.length === 0) {
      return [];
    }

    // Sort data based on selected sort type
    const sortedExplanations = [...explanations].sort((a, b) => {
      switch (sortType) {
        case "alphabetical":
          return a.feature.localeCompare(b.feature);
        case "contribution":
          return b.contribution - a.contribution;
        case "importance":
        default:
          return Math.abs(b.contribution) - Math.abs(a.contribution);
      }
    });

    // Limit display unless showAll is true
    const displayData = showAll ? sortedExplanations : sortedExplanations.slice(0, 10);

    // Prepare data for chart
    return displayData.map((item) => ({
      feature: item.feature.length > 20 
        ? item.feature.substring(0, 18) + "..." 
        : item.feature,
      fullFeature: item.feature,
      contribution: item.contribution,
      direction: item.direction,
      fill: item.contribution > 0 ? "#ef4444" : "#10b981"
    }));
  }, [explanations, sortType, showAll]);

  if (!explanations || explanations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-6 space-y-6"
    >
      {/* Header with Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{title}</h4>
            <p className="text-sm text-slate-500">
              {showAll ? `All ${explanations.length} features` : `Top ${chartData.length} of ${explanations.length} features`}
            </p>
          </div>
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 mr-1">Sort by:</span>
          <button
            onClick={() => setSortType("importance")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              sortType === "importance"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            Importance
          </button>
          <button
            onClick={() => setSortType("alphabetical")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              sortType === "alphabetical"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ArrowDownAZ className="w-3 h-3" />
            A-Z
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={Math.min(400, chartData.length * 40 + 40)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
          >
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="feature" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
            <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={2} />
            <Bar 
              dataKey="contribution" 
              radius={[0, 6, 6, 0]}
              maxBarSize={30}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Show All / Show Less Button */}
        {explanations.length > 10 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              {showAll ? `Show Top 10 Only` : `Show All ${explanations.length} Features`}
            </button>
          </div>
        )}
      </div>

      {/* Legend / Explanation */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
          <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Increases Risk (Red)</p>
            <p className="text-sm text-red-600">
              Feature values push the prediction toward malignancy
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <TrendingDown className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-emerald-800">Decreases Risk (Green)</p>
            <p className="text-sm text-emerald-600">
              Feature values push the prediction toward benign
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-800">Understanding the Chart</p>
          <p className="text-sm text-blue-600">
            Bar length indicates the strength of each feature&apos;s influence on this specific prediction. 
            These contributions are based on the model&apos;s learned coefficients and the patient&apos;s feature values.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
