import type { ReactNode } from "react";
import { Spinner } from "@/packages/ui/components/spinner";

interface LoaderProps {
  children: ReactNode;
  loading: boolean;
}

export const Loader = ({ loading, children }: LoaderProps) =>
  loading ? (
    <div className="flex w-full justify-center py-5">
      <Spinner />
    </div>
  ) : (
    children
  );
