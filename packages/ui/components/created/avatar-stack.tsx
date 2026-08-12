import {
  Children,
  type ComponentProps,
  type CSSProperties,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "tailwind-variants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

interface AvatarStackProps extends ComponentProps<"div"> {
  avatarSize?: number;
  mask?: boolean;
  max?: number;
  orientation?: "horizontal" | "vertical";
  overlapRatio?: number;
}

/** Pull a tooltip label off a child's props, in priority order. */
function labelFor(node: ReactElement): ReactNode {
  const props = node.props as {
    "aria-label"?: ReactNode;
    title?: ReactNode;
    alt?: ReactNode;
  };
  return props["aria-label"] ?? props.title ?? props.alt;
}

export function AvatarStack({
  children,
  className,
  orientation = "horizontal",
  max, // Max visible avatar before "+N"
  avatarSize, // Avatar size in pixels
  overlapRatio = 0.2, // 20% of avatar size
  mask = true,
  style,
  ...props
}: AvatarStackProps) {
  const items = Children.toArray(children);
  const overflow = max ? Math.max(0, items.length - max) : 0;
  const visible = items.slice(0, max);

  // Use the first child as the chip wrapper so its size, shape, and styling
  // (Avatar from any registry, plain div, etc.) automatically apply to "+N".
  const firstChild = visible.find(isValidElement);
  // `avatarSize` set: force children + chip to that pixel size; derive overlap from it.
  // `avatarSize` omitted: children keep intrinsic size; overlap falls back to 0.5rem.
  // Override the fallback overlap via `style={{ "--overlap": "..." }}` if needed.
  const overlap =
    avatarSize === undefined ? "0.5rem" : `${overlapRatio * avatarSize}px`;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "group isolate flex items-center",
          "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:-space-x-(--overlap)",
          "data-[orientation=vertical]:flex-col data-[orientation=vertical]:-space-y-(--overlap)",
          "*:shrink-0 *:object-cover *:object-center",
          avatarSize !== undefined && "*:size-(--avatar-size)!",
          mask && "*:ring-2 *:ring-background",
          className
        )}
        data-orientation={orientation}
        data-slot="avatar-stack"
        style={
          {
            ...style,
            "--overlap": overlap,
            ...(avatarSize !== undefined && {
              "--avatar-size": `${avatarSize}px`,
            }),
          } as CSSProperties
        }
        {...props}
      >
        {visible.map((child, index) => {
          if (!isValidElement(child)) {
            return child;
          }
          const label = labelFor(child);
          if (label === null || label === undefined) {
            return child;
          }
          // `asChild` keeps the avatar itself as the direct DOM child, so the
          // stack's `*:` size/ring/overlap styling still applies.
          return (
            <Tooltip key={child.key ?? index}>
              <TooltipTrigger asChild>{child}</TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          );
        })}
        {overflow > 0 &&
          firstChild &&
          cloneElement(
            firstChild as ReactElement<Record<string, unknown>>,
            { "data-slot": "avatar-stack-overflow", key: "overflow" },
            <span className="flex size-full items-center justify-center rounded-[inherit] font-medium text-muted-foreground text-xs">
              +{overflow}
            </span>
          )}
      </div>
    </TooltipProvider>
  );
}
