import { Duration } from "effect";

export const SANITY_QUERY_OPTIONS = {
  HOUR: {
    next: {
      revalidate: Duration.hours(1),
    },
  },
  THIRTY_SECONDS: {
    next: {
      revalidate: 30,
    },
  },
};
