"use client";

import { ExplanationItem } from "@/services/breastCancerApi";

interface ExplanationChartProps {
  explanations: ExplanationItem[];
  title?: string;
}

export default function ExplanationChart({
  explanations,
  title = "🔍 Feature Contributions (XAI)",
}: ExplanationChartProps) {
  if (!explanations || explanations.length === 0) {
    return null;
  }

  // Find max absolute contribution for scaling
  const maxAbs = Math.max(...explanations.map((e) => Math.abs(e.contribution)));

  return (
    <div className="mt-8 pt-6 border-t space-y-4">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="text-sm text-slate-600">
        These features had the strongest influence on the diagnosis:
      </p>

      <div className="space-y-3">
        {explanations.map((item, idx) => {
          const isPositive = item.contribution > 0;
          const percentage = Math.abs(item.contribution) / maxAbs;
          const barWidth = `${Math.max(percentage * 100, 5)}%`;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 truncate">
                  {item.feature}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isPositive
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {item.direction}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded h-2.5 overflow-hidden">
                  {isPositive ? (
                    <div
                      className="bg-red-500 h-2.5"
                      style={{ width: barWidth }}
                      title={`Contribution: ${item.contribution.toFixed(3)}`}
                    />
                  ) : (
                    <div
                      className="ml-auto bg-green-500 h-2.5"
                      style={{ width: barWidth }}
                      title={`Contribution: ${item.contribution.toFixed(3)}`}
                    />
                  )}
                </div>
                <span className="text-xs text-slate-500 w-16 text-right">
                  {Math.abs(item.contribution).toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-slate-700">
        <p className="font-medium text-blue-900 mb-1">💡 How to read this:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-800">
          <li>
            <strong>Increases risk</strong> (red): Feature values push toward
            malignancy prediction
          </li>
          <li>
            <strong>Decreases risk</strong> (green): Feature values push toward
            benign prediction
          </li>
          <li>
            Bar length shows the strength of influence on this specific case
          </li>
        </ul>
      </div>
    </div>
  );
}
