// Reusable skeleton loader components

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full aspect-[2/1] bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonVenue() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center animate-pulse">
      <div className="rounded-2xl w-full aspect-[4/3] bg-gray-200" />
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGallery() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
