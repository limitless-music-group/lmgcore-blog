import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Children,
  type ComponentProps,
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  type SVGProps,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "tailwind-variants";
import { Button } from "../button";
import { Card, CardAction, CardContent, CardHeader } from "../card";

interface StepProps {
  children: ReactNode;
}

interface StepIndicatorProps {
  currentStep: number;
  disableStepIndicators?: boolean;
  onClickStepAction: (clicked: number) => void;
  step: number;
}

interface CheckIconProps extends SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.1,
          duration: 0.3,
          ease: "easeOut",
          type: "tween",
        }}
      />
    </svg>
  );
}

type IndicatorStatus = "active" | "complete" | "inactive";

function getIndicatorStatus(
  step: number,
  currentStep: number
): IndicatorStatus {
  if (currentStep === step) {
    return "active";
  }
  if (currentStep < step) {
    return "inactive";
  }
  return "complete";
}

function IndicatorGlyph({
  status,
  step,
}: {
  status: IndicatorStatus;
  step: number;
}) {
  if (status === "complete") {
    return <CheckIcon className="size-4 text-black" />;
  }
  if (status === "active") {
    return <div className="size-3 rounded-full bg-[#120F17]" />;
  }
  return <span className="text-sm">{step}</span>;
}

function StepIndicator({
  step,
  currentStep,
  onClickStepAction,
  disableStepIndicators = false,
}: StepIndicatorProps) {
  const status = getIndicatorStatus(step, currentStep);

  const handleClick = useCallback(() => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStepAction(step);
    }
  }, [currentStep, disableStepIndicators, onClickStepAction, step]);

  return (
    <motion.div
      animate={status}
      className={`relative outline-none focus:outline-none ${disableStepIndicators ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
      initial={false}
      onClick={handleClick}
    >
      <motion.div
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
        transition={{ duration: 0.3 }}
        variants={{
          active: { backgroundColor: "#5227FF", color: "#5227FF", scale: 1 },
          complete: { backgroundColor: "#5227FF", color: "#3b82f6", scale: 1 },
          inactive: { backgroundColor: "#222", color: "#a3a3a3", scale: 1 },
        }}
      >
        <IndicatorGlyph status={status} step={step} />
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    complete: { backgroundColor: "#5227FF", width: "100%" },
    incomplete: { backgroundColor: "transparent", width: 0 },
  };

  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600">
      <motion.div
        animate={isComplete ? "complete" : "incomplete"}
        className="absolute top-0 left-0 h-full"
        initial={false}
        transition={{ duration: 0.4 }}
        variants={lineVariants}
      />
    </div>
  );
}

export function Step({ children }: StepProps) {
  return <div className="px-8">{children}</div>;
}

const stepVariants: Variants = {
  center: {
    opacity: 1,
    x: "0%",
  },
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? "-100%" : "100%",
  }),
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? "50%" : "-50%",
  }),
};

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReadyAction: (height: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReadyAction,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReadyAction(containerRef.current.offsetHeight);
    }
    // `key={currentStep}` on this component already forces a full remount
    // (and therefore a re-run of this effect) whenever the step's content
    // changes, so `children` itself isn't a necessary dependency here.
  }, [onHeightReadyAction]);

  return (
    <motion.div
      animate="center"
      custom={direction}
      exit="exit"
      initial="enter"
      ref={containerRef}
      style={{ left: 0, position: "absolute", right: 0, top: 0 }}
      transition={{ duration: 0.4 }}
      variants={stepVariants}
    >
      {children}
    </motion.div>
  );
}

interface StepContentWrapperProps {
  children: ReactNode;
  className?: string;
  currentStep: number;
  direction: number;
  isCompleted: boolean;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = "",
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      animate={{ height: isCompleted ? 0 : parentHeight }}
      className={className}
      style={{ overflow: "hidden", position: "relative" }}
      transition={{ duration: 0.4, type: "spring" }}
    >
      <AnimatePresence>
        {!isCompleted && (
          <SlideTransition
            direction={direction}
            key={currentStep}
            onHeightReadyAction={setParentHeight}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  backButtonProps?: ComponentProps<"button">;
  backButtonText?: string;
  children: ReactNode;
  contentClassName?: string;
  disableStepIndicators?: boolean;
  footerClassName?: string;
  /** The initial step to start off the stepper */
  initialStep?: number;
  nextButtonProps?: ComponentProps<"button">;
  nextButtonText?: string;
  onFinalStepCompletedAction?: () => void;
  onStepChangeAction?: (step: number) => void;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClickAction: (clicked: number) => void;
  }) => ReactNode;
  /** Styles for the step circle */
  stepCircleContainerClassName?: string;
  /** Styles for the step container */
  stepContainerClassName?: string;
}

export function Stepper({
  children,
  initialStep = 1,
  onStepChangeAction = () => {
    // No-op default — the stepper works uncontrolled when the caller
    // doesn't care about step-change notifications.
  },
  onFinalStepCompletedAction = () => {
    // No-op default — see onStepChangeAction.
  },
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;
  const nextLabel = isLastStep ? "Complete" : nextButtonText;

  const updateStep = useCallback(
    (newStep: number) => {
      setCurrentStep(newStep);
      if (newStep > totalSteps) {
        onFinalStepCompletedAction();
      } else {
        onStepChangeAction(newStep);
      }
    },
    [totalSteps, onFinalStepCompletedAction, onStepChangeAction]
  );

  const handleBack = useCallback(() => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep - 1);
    }
  }, [isLastStep, currentStep, updateStep]);

  const handleNext = useCallback(() => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  }, [isLastStep, currentStep, updateStep]);

  const handleComplete = useCallback(() => {
    setDirection(1);
    updateStep(totalSteps + 1);
  }, [totalSteps, updateStep]);

  const handleStepClick = useCallback(
    (clicked: number) => {
      setDirection(clicked > currentStep ? 1 : -1);
      updateStep(clicked);
    },
    [currentStep, updateStep]
  );

  return (
    <Card
      {...rest}
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-4/3 md:aspect-2/1"
    >
      <CardHeader
        className={cn(
          "mx-auto w-full max-w-md rounded-4xl shadow-xl",
          stepCircleContainerClassName
        )}
        style={{ border: "1px solid #222" }}
      >
        <div
          className={cn("flex w-full items-center p-8", stepContainerClassName)}
        >
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    currentStep,
                    onStepClickAction: handleStepClick,
                    step: stepNumber,
                  })
                ) : (
                  <StepIndicator
                    currentStep={currentStep}
                    disableStepIndicators={disableStepIndicators}
                    onClickStepAction={handleStepClick}
                    step={stepNumber}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </Fragment>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <StepContentWrapper
          className={cn("space-y-2 px-8", contentClassName)}
          currentStep={currentStep}
          direction={direction}
          isCompleted={isCompleted}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-8 pb-8 ${footerClassName}`}>
            <div
              className={`mt-10 flex ${currentStep === 1 ? "justify-end" : "justify-between"}`}
            >
              {currentStep !== 1 && (
                <CardAction>
                  <Button
                    className={cn(
                      "rounded px-2 py-1 transition duration-350",
                      currentStep === 1
                        ? "pointer-events-none text-neutral-400 opacity-50"
                        : "text-neutral-400 hover:text-neutral-700"
                    )}
                    onClick={handleBack}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </Button>
                </CardAction>
              )}
              <CardAction>
                <Button
                  className="flex items-center justify-center rounded-full bg-green-500 px-3.5 py-1.5 font-medium text-white tracking-tight transition duration-350 hover:bg-green-600 active:bg-green-700"
                  onClick={isLastStep ? handleComplete : handleNext}
                  {...nextButtonProps}
                >
                  {nextLabel}
                </Button>
              </CardAction>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
