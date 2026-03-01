export default function ServiceCardSkeleton() {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 animate-pulse">
      {/* Icon Skeleton */}
      <div className="shrink-0 mb-4 sm:mb-0 sm:absolute sm:top-6 sm:left-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Content Skeleton */}
      <div className="sm:pl-20 flex-1 min-w-0 space-y-3">
        <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
        
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>

        {/* Rate Badge Skeleton */}
        <div className="mt-4">
          <div className="inline-flex rounded-full bg-slate-200 dark:bg-slate-700 px-4 py-1.5 h-7 w-24" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="mt-5 flex items-center gap-2">
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
