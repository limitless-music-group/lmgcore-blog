import { addEqualityTesters } from "@effect/vitest";

addEqualityTesters();

// Ignore warnings from usage of experimental features to declutter test output.
const ignore = ["ExperimentalWarning"];
const { emitWarning } = process;
process.emitWarning = ((warning: string | Error, ...args: unknown[]) => {
  const [head] = args;
  if (head !== null) {
    if (typeof head === "string" && ignore.includes(head)) {
      return;
    }

    if (
      typeof head === "object" &&
      ignore.includes((head as { type?: string } | null)?.type ?? "")
    ) {
      return;
    }
  }
  return (emitWarning as (...callArgs: unknown[]) => void)(warning, ...args);
}) as typeof process.emitWarning;
