import { Skeleton } from "@/packages/ui/components/skeleton";

export default function Loading() {
  return (
    <main
      aria-busy
      className="container mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10"
    >
      <Skeleton className="h-5 w-32" />
      <div className="flex items-center gap-4 border-border/60 border-b pb-6">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>
    </main>
  );
}
