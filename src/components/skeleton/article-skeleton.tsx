import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSats() {
  return (
    <div className="flex flex-raw space-x-3">
      <Skeleton className="h-[150px] w-[200px] rounded-xl" />
      <Skeleton className="h-[150px] w-[200px] rounded-xl" />
      <Skeleton className="h-[150px] w-[200px] rounded-xl" />
    </div>
  );
}
export function SkeletonArticles() {
  return (
    <div className="flex flex-raw space-x-3">
      <Skeleton className="h-[300px] w-[350px] rounded-xl" />
      <Skeleton className="h-[300px] w-[350px] rounded-xl" />
    </div>
  );
}
export function SkeletonFormArticles() {
  return (
    <div className="flex flex-raw space-x-3">
      <Skeleton className="h-98 w-full rounded-xl" />
    </div>
  );
}
