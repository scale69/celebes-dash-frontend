import { Skeleton } from "../ui/skeleton";

export function SkeletonTable() {
  return (
    <div className="flex flex-raw space-x-3">
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
