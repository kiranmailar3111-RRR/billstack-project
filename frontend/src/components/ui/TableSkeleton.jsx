import Skeleton from "./Skeleton";

const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <Skeleton className="h-7 w-48 mb-3" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 items-center"
          >
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;