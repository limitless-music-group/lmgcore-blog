import { Skeleton } from "@/packages/ui/components/skeleton";

export default function Loading() {
  return (
    <main
      aria-busy
      className="container mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10"
    >
      <Skeleton className="h-5 w-24" />
      <div className="flex flex-col gap-2 border-border/60 border-b pb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-64" />
      </div>
    </main>
  );
}
