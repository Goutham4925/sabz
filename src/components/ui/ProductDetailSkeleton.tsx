export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
      {/* IMAGE */}
      <div>
        <div className="aspect-square rounded-3xl bg-muted" />
        <div className="flex gap-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-20 rounded-xl bg-muted" />
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <div className="space-y-4">
        <div className="h-5 w-32 bg-muted rounded" />
        <div className="h-12 w-3/4 bg-muted rounded" />
        <div className="h-6 w-full bg-muted rounded" />
        <div className="h-10 w-40 bg-muted rounded" />
        <div className="h-12 w-full bg-muted rounded" />

        <div className="space-y-2">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
