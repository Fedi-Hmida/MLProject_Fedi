export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" />
        <div className="container-app relative z-10 py-16">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl skeleton" />
              <div className="w-40 h-8 rounded-full skeleton" />
            </div>
            <div className="w-80 h-12 skeleton rounded-lg" />
            <div className="w-full max-w-xl h-6 skeleton rounded-lg" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <div className="container-app py-12">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl skeleton" />
            <div className="space-y-2">
              <div className="w-40 h-6 skeleton rounded" />
              <div className="w-60 h-4 skeleton rounded" />
            </div>
          </div>
          
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-0 skeleton rounded-full" />
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-12 skeleton rounded-xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-4 skeleton rounded" />
                <div className="w-full h-12 skeleton rounded-xl" />
              </div>
            ))}
          </div>

          <div className="w-full h-16 skeleton rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
