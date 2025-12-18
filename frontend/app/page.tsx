import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-6 text-white animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Breast Cancer Detection <br />
              <span className="text-blue-400">
                & Risk Stratification
              </span>
            </h1>

            <p className="text-slate-300 text-lg max-w-xl">
              A machine learning–powered clinical decision support system
              for breast cancer diagnosis and risk assessment based on
              the Wisconsin Diagnostic Dataset.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/prediction"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold
                           hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Run Prediction
              </Link>

              <Link
                href="/risk"
                className="px-6 py-3 rounded-lg bg-white/10 text-white font-semibold
                           hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 backdrop-blur"
              >
                Risk Stratification
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative hidden md:block animate-fade-in">
            <div className="relative w-full h-[380px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/hero-medical.jpg"
                alt="Medical AI analysis"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20 grid gap-10 md:grid-cols-3">
          {[
            {
              icon: "🧠",
              title: "Machine Learning Core",
              text: "Logistic Regression trained on the Wisconsin Diagnostic Breast Cancer Dataset with validated performance.",
            },
            {
              icon: "🏥",
              title: "Clinical-Oriented Design",
              text: "Risk stratification aligned with clinical thresholds to assist medical decision-making.",
            },
            {
              icon: "⚡",
              title: "Real-Time & Interactive",
              text: "Instant predictions via FastAPI backend and modern Next.js frontend.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="space-y-4 p-6 rounded-xl border bg-slate-50
                         hover:shadow-md hover:-translate-y-1
                         transition-all duration-300 animate-fade-in"
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="text-lg font-semibold text-slate-800">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Technology Stack
          </h2>

          <div className="flex flex-wrap gap-3 text-sm">
            {[
              "Python",
              "FastAPI",
              "Scikit-learn",
              "Next.js",
              "Tailwind CSS",
              "Machine Learning",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-1.5 bg-white rounded-full border
                           hover:bg-blue-50 hover:border-blue-300
                           transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-500">
          Academic Machine Learning Project · Breast Cancer Detection & Risk Stratification
        </div>
      </footer>
    </main>
  );
}
