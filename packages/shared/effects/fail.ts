type WorkflowErrorConstructor<E> = new (props: { message: string }) => E;

/** Bind a workflow TaggedError, then pass step names to get catch/mapError handlers. */
export const makeFail =
  <E>(ErrorClass: WorkflowErrorConstructor<E>) =>
  (step: string) =>
  (cause: unknown): E =>
    new ErrorClass({ message: `${step}: ${String(cause)}` });
