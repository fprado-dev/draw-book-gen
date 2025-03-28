export function SkeletonBook() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="h-3 w-full bg-muted rounded"></div>
            <div className="h-3 w-2/3 bg-muted rounded"></div>
            <div className="flex gap-2 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}