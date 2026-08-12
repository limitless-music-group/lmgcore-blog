"use client";

import {
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import {
  type DefaultLegendContentProps,
  type DefaultTooltipContentProps,
  Legend,
  ResponsiveContainer,
  Tooltip,
  type TooltipValueType,
} from "recharts";
import { cn } from "tailwind-variants";

// --- Constants ---
// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { dark: ".dark", light: "" } as const;

const INITIAL_DIMENSION = { height: 200, width: 320 } as const;

const CHART_BASE_STYLES =
  "flex aspect-video justify-center text-xs " +
  "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground " +
  "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 " +
  "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border " +
  "[&_.recharts-dot[stroke='#fff']]:stroke-transparent " +
  "[&_.recharts-layer]:outline-hidden " +
  "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border " +
  "[&_.recharts-radial-bar-background-sector]:fill-muted " +
  "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted " +
  "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border " +
  "[&_.recharts-sector[stroke='#fff']]:stroke-transparent " +
  "[&_.recharts-sector]:outline-hidden " +
  "[&_.recharts-surface]:outline-hidden";

const TOOLTIP_CONTAINER_STYLES =
  "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs/relaxed shadow-xl";

const TOOLTIP_ROW_STYLES =
  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground";

const LEGEND_ITEM_STYLES =
  "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground";

// --- Types ---
type TooltipNameType = number | string;

type IndicatorType = "dot" | "line" | "dashed";

type DivProps = ComponentProps<"div">;

type RechartsTooltipProps = DefaultTooltipContentProps<
  TooltipValueType,
  TooltipNameType
>;

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | {
        color?: string;
        theme?: never;
      }
    | {
        color?: never;
        theme: Record<keyof typeof THEMES, string>;
      }
  )
>;

interface ChartContextProps {
  config: ChartConfig;
}

interface ChartContainerProps extends ComponentProps<"div"> {
  children: ComponentProps<typeof ResponsiveContainer>["children"];
  config: ChartConfig;
  initialDimension?: {
    width: number;
    height: number;
  };
}

interface ChartTooltipContentProps
  extends DivProps,
    Omit<RechartsTooltipProps, "accessibilityLayer"> {
  active?: boolean;
  hideIndicator?: boolean;
  hideLabel?: boolean;
  indicator?: IndicatorType;
  labelKey?: string;
  nameKey?: string;
}

interface TooltipIndicatorProps {
  color?: string;
  hidden?: boolean;
  icon?: ComponentType;
  indicator: IndicatorType;
  nestLabel?: boolean;
}

interface TooltipRowProps {
  formatter?: RechartsTooltipProps["formatter"];
  hideIndicator?: boolean;
  indicator: IndicatorType;
  item: NormalizedTooltipItem;
  nestLabel: boolean;
  tooltipLabel: ReactNode;
}

interface NormalizedTooltipItem {
  color?: string;
  icon?: ComponentType;
  key: string;
  label?: ReactNode;
  name?: string | number;
  payload: unknown;
  raw: NonNullable<RechartsTooltipProps["payload"]>[number];
  value?: TooltipValueType;
}

// ======================================================
// Context
// ======================================================

const ChartContext = createContext<ChartContextProps | null>(null);

function useChart() {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

// ======================================================
// Utilities
// ======================================================

function isVisiblePayload(item: { type?: string }) {
  return item.type !== "none";
}

function formatTooltipValue(value: TooltipValueType) {
  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return String(value);
}

function resolvePayloadConfig(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const nestedPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configKey = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configKey = payload[key as keyof typeof payload] as string;
  } else if (
    nestedPayload &&
    key in nestedPayload &&
    typeof nestedPayload[key as keyof typeof nestedPayload] === "string"
  ) {
    configKey = nestedPayload[key as keyof typeof nestedPayload] as string;
  }

  return config[configKey] ?? config[key];
}

function normalizeTooltipItem(
  config: ChartConfig,
  item: NonNullable<RechartsTooltipProps["payload"]>[number],
  nameKey?: string
): NormalizedTooltipItem {
  const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;

  const itemConfig = resolvePayloadConfig(config, item, key);

  return {
    color: item.payload?.fill ?? item.color ?? undefined,
    icon: itemConfig?.icon,
    key,
    label: itemConfig?.label ?? item.name,
    name: item.name,
    payload: item.payload,
    raw: item,
    value: item.value,
  };
}

function createChartCssVars(id: string, config: ChartConfig) {
  const colorConfig = Object.entries(config).filter(
    ([, value]) => value.theme ?? value.color
  );

  return Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const variables = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
            itemConfig.color;

          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");

      return `${prefix} [data-chart=${id}] {${variables}}`;
    })
    .join("\n");
}

// ======================================================
// Chart Container
// ======================================================

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: ChartContainerProps) {
  const uniqueId = useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(CHART_BASE_STYLES, className)}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ======================================================
// Chart Style
// ======================================================

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const css = createChartCssVars(id, config);

  if (!css) {
    return null;
  }

  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme ?? itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed
      dangerouslySetInnerHTML={{
        __html: css,
      }}
    />
  );
};

// ======================================================
// Tooltip
// ======================================================

const ChartTooltip = Tooltip;

function TooltipIndicator({
  color,
  indicator,
  hidden,
  icon: Icon,
  nestLabel,
}: TooltipIndicatorProps) {
  if (Icon) {
    return <Icon />;
  }

  if (hidden) {
    return null;
  }

  const indicatorStyles: Record<IndicatorType, string> = {
    dashed: "w-0 border-[1.5px] border-dashed bg-transparent",
    dot: "h-2.5 w-2.5",
    line: "w-1",
  };

  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        indicatorStyles[indicator],
        nestLabel && indicator === "dashed" && "my-0.5"
      )}
      style={
        {
          "--color-bg": color,
          "--color-border": color,
        } as CSSProperties
      }
    />
  );
}

function TooltipLabel({
  label,
  className,
}: {
  label: ReactNode;
  className?: string;
}) {
  if (!label) {
    return null;
  }

  return <div className={cn("font-medium", className)}>{label}</div>;
}

function TooltipValue({ value }: { value?: TooltipValueType }) {
  if (value === null || value === undefined) {
    return null;
  }

  return (
    <span className="font-medium font-mono text-foreground tabular-nums">
      {formatTooltipValue(value)}
    </span>
  );
}

function TooltipRow({
  item,
  indicator,
  hideIndicator,
  nestLabel,
  tooltipLabel,
  formatter,
}: TooltipRowProps) {
  if (formatter && item.value !== undefined && item.name) {
    return (
      <div className={TOOLTIP_ROW_STYLES}>
        {formatter(
          item.value,
          item.name,
          item.raw,
          0,
          item.payload as NonNullable<RechartsTooltipProps["payload"]>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(TOOLTIP_ROW_STYLES, indicator === "dot" && "items-center")}
    >
      <TooltipIndicator
        color={item.color}
        hidden={hideIndicator}
        icon={item.icon}
        indicator={indicator}
        nestLabel={nestLabel}
      />

      <div
        className={cn(
          "flex flex-1 justify-between leading-none",
          nestLabel ? "items-end" : "items-center"
        )}
      >
        <div className="grid gap-1.5">
          {nestLabel ? tooltipLabel : null}

          <span className="text-muted-foreground">{item.label}</span>
        </div>

        <TooltipValue value={item.value} />
      </div>
    </div>
  );
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();
  const visiblePayload = useMemo(
    () => payload?.filter(isVisiblePayload) ?? [],
    [payload]
  );

  const normalizedItems = useMemo(
    () =>
      visiblePayload.map((item) => normalizeTooltipItem(config, item, nameKey)),
    [config, visiblePayload, nameKey]
  );

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !normalizedItems.length) {
      return null;
    }

    const [firstItem] = visiblePayload;

    if (!firstItem) {
      return null;
    }

    const key = `${labelKey ?? firstItem.dataKey ?? firstItem.name ?? "value"}`;

    const itemConfig = resolvePayloadConfig(config, firstItem, key);

    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <TooltipLabel
          className={labelClassName}
          label={labelFormatter(value, visiblePayload)}
        />
      );
    }

    return <TooltipLabel className={labelClassName} label={value} />;
  }, [
    config,
    hideLabel,
    label,
    labelClassName,
    labelFormatter,
    labelKey,
    normalizedItems.length,
    visiblePayload,
  ]);

  if (!(active && normalizedItems.length)) {
    return null;
  }

  const nestLabel = normalizedItems.length === 1 && indicator !== "dot";

  return (
    <div className={cn(TOOLTIP_CONTAINER_STYLES, className)}>
      {nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {normalizedItems.map((item) => (
          <TooltipRow
            formatter={formatter}
            hideIndicator={hideIndicator}
            indicator={indicator}
            item={item}
            key={item.key}
            nestLabel={nestLabel}
            tooltipLabel={tooltipLabel}
          />
        ))}
      </div>
    </div>
  );
}

// ======================================================
// Legend
// ======================================================

const ChartLegend = Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
} & DefaultLegendContentProps) {
  const { config } = useChart();

  const visiblePayload = payload?.filter(isVisiblePayload) ?? [];

  if (!visiblePayload.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {visiblePayload.map((item) => {
        const key = `${nameKey ?? item.dataKey ?? "value"}`;
        const itemConfig = resolvePayloadConfig(config, item, key);
        const Icon = itemConfig?.icon;

        return (
          <div className={LEGEND_ITEM_STYLES} key={key}>
            {Icon && !hideIcon ? (
              <Icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}

            {itemConfig?.label ?? item.value}
          </div>
        );
      })}
    </div>
  );
}

// ======================================================
// Exports
// ======================================================

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
