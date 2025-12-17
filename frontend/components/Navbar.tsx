"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${
       pathname === path
         ? "bg-blue-100 text-blue-700"
         : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
     }`;

  return (
    <nav className="sticky top-0 z-50 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="font-semibold text-slate-800 tracking-tight">
            Breast Cancer ML
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex space-x-2">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/prediction" className={linkClass("/prediction")}>
            Prediction
          </Link>
          <Link href="/risk" className={linkClass("/risk")}>
            Risk Stratification
          </Link>
        </div>
      </div>
    </nav>
  );
}
