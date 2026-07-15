export const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
      <div className="h-56 animate-pulse rounded-[24px] bg-slate-100" />
      <div className="mt-6 space-y-3">
        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-8 flex items-end justify-between">
        <div className="space-y-3">
          <div className="h-3 w-14 animate-pulse rounded-full bg-slate-100" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
};
