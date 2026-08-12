"use client";

import { useEffect } from "react";
import { Spinner } from "@/packages/ui/components/spinner";
import { useIntersectionObserver } from "@/packages/ui/hooks/use-intersection-observer";

interface InfiniteScrollProps {
  isLoading: boolean;
  loadMore: (numItems: number) => void;
  numItems?: number;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
}

export function InfiniteScroll({
  status,
  isLoading,
  loadMore,
  numItems = 20,
}: InfiniteScrollProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    rootMargin: "100px",
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && status === "CanLoadMore" && !isLoading) {
      loadMore(numItems);
    }
  }, [isIntersecting, status, isLoading, loadMore, numItems]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="h-1" ref={targetRef} />
      {status === "LoadingMore" && (
        <div className="flex w-full items-center justify-center py-2">
          <Spinner />
        </div>
      )}
    </div>
  );
}
