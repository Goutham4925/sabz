const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl bg-muted p-4">
    <div className="h-40 w-full rounded-xl bg-muted-foreground/20 mb-4" />
    <div className="h-4 w-3/4 bg-muted-foreground/20 rounded mb-2" />
    <div className="h-4 w-1/2 bg-muted-foreground/20 rounded mb-4" />
    <div className="h-8 w-full bg-muted-foreground/20 rounded" />
  </div>
);

export const ProductsGridLoader = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
