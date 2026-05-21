import Skeleton from "./Skeleton";

const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>

        <Skeleton className="h-12 w-12 rounded-2xl" />
      </div>
    </div>
  );
};

export default CardSkeleton;