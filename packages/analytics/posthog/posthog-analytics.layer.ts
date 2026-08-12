import { Layer } from "effect";
import { AnalyticsLayerContext } from "../layer/analytics.layer";
import {
  captureServerEvent,
  groupIdentifyServer,
  identifyServerUser,
  isFeatureEnabled,
} from "./implementations";

export const PostHogAnalyticsLayerLive = Layer.succeed(
  AnalyticsLayerContext,
  AnalyticsLayerContext.of({
    captureServerEvent,
    groupIdentifyServer,
    identifyServerUser,
    isFeatureEnabled,
  })
);
