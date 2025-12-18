"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning";
  className?: string;
}

const variantStyles = {
  default: {
    border: "border-slate-200",
    icon: "from-blue-500 to-purple-600",
    glow: ""
  },
  success: {
    border: "border-emerald-200",
    icon: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/10"
  },
  danger: {
    border: "border-red-200",
    icon: "from-red-500 to-rose-500",
    glow: "shadow-red-500/10"
  },
  warning: {
    border: "border-orange-200",
    icon: "from-orange-500 to-amber-500",
    glow: "shadow-orange-500/10"
  }
};

export default function Card({ 
  title, 
  description, 
  children, 
  icon: Icon,
  variant = "default",
  className = ""
}: Props) {
  const styles = variantStyles[variant];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card rounded-2xl p-8 space-y-6 ${styles.glow} ${className}`}
    >
      <header className="flex items-start gap-4">
        {Icon && (
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${styles.icon} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-800">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 mt-1">
              {description}
            </p>
          )}
        </div>
      </header>

      <div>
        {children}
      </div>
    </motion.section>
  );
}
