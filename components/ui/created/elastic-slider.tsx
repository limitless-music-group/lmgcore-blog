import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import {
  type FC,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppIcons } from "../app-icons";

// import { Slider } from "../slider";

interface SliderProps {
  defaultValue: number;
  isStepped: boolean;
  leftIcon: ReactNode;
  maxValue: number;
  onValueChange?: (value: number[]) => void;
  rightIcon: ReactNode;
  startingValue: number;
  stepSize: number;
  value?: number[];
}

const Slider: FC<SliderProps> = ({
  defaultValue,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  leftIcon,
  rightIcon,
  onValueChange,
  value: controlledValue,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const value = isControlled ? (controlledValue[0] ?? 0) : internalValue;

  const setValue = (newValue: number) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.([newValue]);
  };

  const sliderRef = useRef<HTMLDivElement>(null);
  const [region, setRegion] = useState<"left" | "middle" | "right">("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  useMotionValueEvent(clientX, "change", (latest: number) => {
    if (sliderRef.current) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue: number;
      if (latest < left) {
        setRegion("left");
        newValue = left - latest;
      } else if (latest > right) {
        setRegion("right");
        newValue = latest - right;
      } else {
        setRegion("middle");
        newValue = 0;
      }
      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue =
        startingValue +
        ((e.clientX - left) / width) * (maxValue - startingValue);
      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }
      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      setValue(newValue);
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { bounce: 0.5, type: "spring" });
  };

  const handleScaleUp = useCallback(() => animate(scale, 1.1), [scale]);
  const handleScaleDown = useCallback(() => animate(scale, 1), [scale]);

  const getRangePercentage = (): number => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) {
      return 0;
    }
    return ((value - startingValue) / totalRange) * 100;
  };

  return (
    <>
      <motion.div
        className="flex w-full touch-none select-none items-center justify-center gap-4"
        onHoverEnd={handleScaleDown}
        onHoverStart={handleScaleUp}
        onTouchEnd={handleScaleDown}
        onTouchStart={handleScaleUp}
        style={{
          opacity: useTransform(scale, [1, 1.1], [0.7, 1]),
          scale,
        }}
      >
        <motion.div
          animate={{
            scale: region === "left" ? [1, 1.1, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() =>
              region === "left" ? -overflow.get() / scale.get() : 0
            ),
          }}
        >
          {leftIcon}
        </motion.div>

        <div
          className="relative flex w-full max-w-xs grow cursor-grab touch-none select-none items-center py-4"
          onLostPointerCapture={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={sliderRef}
        >
          <motion.div
            className="flex grow"
            style={{
              height: useTransform(scale, [1, 1.2], [6, 12]),
              marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
              marginTop: useTransform(scale, [1, 1.2], [0, -3]),
              scaleX: useTransform(() => {
                if (sliderRef.current) {
                  const { width } = sliderRef.current.getBoundingClientRect();
                  return 1 + overflow.get() / width;
                }
                return 1;
              }),
              scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
              transformOrigin: useTransform(() => {
                if (sliderRef.current) {
                  const { left, width } =
                    sliderRef.current.getBoundingClientRect();
                  return clientX.get() < left + width / 2 ? "right" : "left";
                }
                return "center";
              }),
            }}
          >
            <div className="relative h-full grow overflow-hidden rounded-full bg-gray-400">
              <div
                className="absolute h-full rounded-full bg-gray-500"
                style={{ width: `${getRangePercentage()}%` }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{
            scale: region === "right" ? [1, 1.1, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() =>
              region === "right" ? overflow.get() / scale.get() : 0
            ),
          }}
        >
          {rightIcon}
        </motion.div>
      </motion.div>
      <p className="absolute -translate-y-4 transform font-medium text-gray-400 text-xs tracking-wide">
        {Math.round(value)}
      </p>
    </>
  );
};

function decay(value: number, max: number): number {
  if (max === 0) {
    return 0;
  }
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

const MAX_OVERFLOW = 50;

interface ElasticSliderProps {
  "aria-label"?: string;
  className?: string;
  defaultValue?: number;
  isStepped?: boolean;
  leftIcon?: ReactNode;
  maxValue?: number;
  onValueChange?: (value: number[]) => void;
  rightIcon?: ReactNode;
  startingValue?: number;
  stepSize?: number;
  value?: number[];
}

const ElasticSlider: FC<ElasticSliderProps> = ({
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon = <AppIcons.Common.Minus />,
  rightIcon = <AppIcons.Common.Plus />,
  onValueChange,
  value,
}) => (
  <div
    className={`flex w-48 flex-col items-center justify-center gap-4 ${className}`}
  >
    <Slider
      defaultValue={defaultValue}
      isStepped={isStepped}
      leftIcon={leftIcon}
      maxValue={maxValue}
      onValueChange={onValueChange}
      rightIcon={rightIcon}
      startingValue={startingValue}
      stepSize={stepSize}
      value={value}
    />
  </div>
);

export default ElasticSlider;
