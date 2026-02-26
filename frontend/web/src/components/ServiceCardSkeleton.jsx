export default function ServiceCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border
                    bg-white dark:bg-surface p-4 animate-pulse">
      <div className="w-20 h-20 rounded-lg bg-muted/40" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 bg-surface rounded" />
        <div className="h-3 w-2/3 bg-surface rounded" />
        <div className="h-3 w-1/4 bg-surface rounded" />
      </div>

      <div className="h-8 w-20 bg-muted/40 rounded-lg" />
    </div>
  );
}
