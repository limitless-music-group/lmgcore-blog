import type { ReactNode } from "react";
import { cn } from "tailwind-variants";
import { Spinner } from "../spinner";

interface LoadingSwapProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  loading: boolean;
}

/**
 * OVERLAY MODE (best for buttons, actions)
 *
 * SWAP MODE (default)
 */

function LoadingSwap({
  loading,
  children,
  fallback,
  className,
}: LoadingSwapProps) {
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        {fallback ?? <Spinner />}
      </div>
    );
  }

  return <>{children}</>;
}

interface LoadingOverlayProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  fallback?: ReactNode;
  loading: boolean;
}

function LoadingOverlay({
  loading,
  children,
  fallback,
  className,
  disabled = true,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(loading && disabled && "pointer-events-none opacity-60")}
      >
        {children}
      </div>

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
          {fallback ?? <Spinner />}
        </div>
      ) : null}
    </div>
  );
}

export const LoadingState = {
  Overlay: LoadingOverlay,
  Swap: LoadingSwap,
};
