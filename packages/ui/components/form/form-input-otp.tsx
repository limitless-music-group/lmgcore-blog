import { InputOTP, InputOTPGroup, InputOTPSlot } from "../input-otp";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormInputOTP({
  length = 6,
  ...props
}: FormControlProps & { length?: number }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <InputOTP
        aria-invalid={isInvalid}
        id={field.name}
        maxLength={length}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        value={field.state.value}
      >
        <InputOTPGroup>
          {Array.from({ length }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: slot position is the identity — a fixed-length OTP never reorders.
            <InputOTPSlot index={i} key={`otp-${i}`} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </FormBase>
  );
}
