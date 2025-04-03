import { useSidebar } from "@/components/ui/sidebar";

export function SkeletonBook() {
  const { open } = useSidebar();
  return (
    <div className={`grid grid-cols-1 gap-4 ${open ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
      {[...Array(open ? 3 : 4)].map((_, index) => (
        <div
          key={index}
          className="bg-card text-card-foreground animate-pulse rounded-lg border p-4 shadow-sm"
        >
          <div className="space-y-3">
            <div className="bg-muted h-4 w-3/4 rounded"></div>
            <div className="bg-muted h-3 w-full rounded"></div>
            <div className="bg-muted h-3 w-2/3 rounded"></div>
            <div className="flex gap-2 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted h-6 w-16 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
