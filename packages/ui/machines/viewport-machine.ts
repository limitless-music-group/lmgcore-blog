import { useSelector } from "@xstate/react";
import { createActor, setup, types } from "xstate";

const MOBILE_BREAKPOINT = 768;

interface ViewportContext {
  isMobile: boolean | undefined;
}

const viewportMachine = setup({
  schemas: {
    context: types<ViewportContext>(),
    events: {
      "viewport.setMobile": types<{ value: boolean }>(),
    },
  },
}).createMachine({
  context: { isMobile: undefined },
  on: {
    "viewport.setMobile": {
      context: ({ event }) => ({ isMobile: event.value }),
    },
  },
});

const viewportActor = createActor(viewportMachine).start();

export function useViewportStore() {
  const isMobile = useSelector(
    viewportActor,
    (state) => state.context.isMobile
  );

  return {
    isMobile,
    setMobile: (value: boolean) =>
      viewportActor.send({ type: "viewport.setMobile", value }),
  };
}

let viewportCleanup: (() => void) | undefined;

export function initViewportStore() {
  if (typeof window === "undefined") {
    return;
  }
  if (viewportCleanup) {
    return viewportCleanup;
  }
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const update = () => {
    viewportActor.send({
      type: "viewport.setMobile",
      value: window.innerWidth < MOBILE_BREAKPOINT,
    });
  };
  mql.addEventListener("change", update);
  update();
  viewportCleanup = () => {
    mql.removeEventListener("change", update);
    viewportCleanup = undefined;
  };
  return viewportCleanup;
}
