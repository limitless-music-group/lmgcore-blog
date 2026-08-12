import { Skeleton } from "@/packages/ui/components/skeleton";

export default function Loading() {
  return (
    <article aria-busy className="py-6 md:py-10">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mt-10 flex flex-col items-center gap-6">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-full max-w-xl" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-5xl px-6">
        <Skeleton className="aspect-video w-full rounded-3xl" />
      </div>
    </article>
  );
}
