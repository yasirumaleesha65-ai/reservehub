export function ResourceListSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-lg bg-slate-200" />

      <div className="h-20 rounded-2xl bg-slate-200" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-72 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-200" />
            <div className="mt-6 h-5 w-3/4 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-full rounded bg-slate-200" />
            <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
            <div className="mt-8 h-10 rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
