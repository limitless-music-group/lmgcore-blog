import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormCheckbox } from "./form-checkbox";
import { FormColorPicker } from "./form-color-picker";
import { FormCombobox } from "./form-combobox";
import { FormDatePicker } from "./form-date-picker";
import { FormDateRangePicker } from "./form-date-range-picker";
import { FormFileUpload } from "./form-file-upload";
import { FormImageUpload } from "./form-image-upload";
import { FormInput } from "./form-input";
import { FormInputOTP } from "./form-input-otp";
import { FormLockedField } from "./form-locked-field";
import { FormMultiSelect } from "./form-multi-select";
import { FormNumberInput } from "./form-number-input";
import { FormPasswordInput } from "./form-password-input";
import { FormPhoneInput } from "./form-phone-input";
import { FormRadioGroup } from "./form-radio-group";
import { FormRating } from "./form-rating";
import { FormRichTextEditor } from "./form-rich-text-editor";
import { FormSaveBar } from "./form-save-bar";
import { FormSelect } from "./form-select";
import { FormSliderInput } from "./form-slider-input";
import { FormSlugInput } from "./form-slug-input";
import { FormSwitch } from "./form-switch";
import { FormTagsInput } from "./form-tags-input";
import { FormTextarea } from "./form-textarea";
import { FormTimePicker } from "./form-time-picker";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Checkbox: FormCheckbox,
    ColorPicker: FormColorPicker,
    Combobox: FormCombobox,
    DatePicker: FormDatePicker,
    DateRangePicker: FormDateRangePicker,
    FileUpload: FormFileUpload,
    ImageUpload: FormImageUpload,
    Input: FormInput,
    InputOTP: FormInputOTP,
    MultiSelect: FormMultiSelect,
    NumberInput: FormNumberInput,
    PasswordInput: FormPasswordInput,
    PhoneInput: FormPhoneInput,
    RadioGroup: FormRadioGroup,
    Rating: FormRating,
    RichTextEditor: FormRichTextEditor,
    Select: FormSelect,
    SliderInput: FormSliderInput,
    Slug: FormSlugInput,
    Switch: FormSwitch,
    TagsInput: FormTagsInput,
    Textarea: FormTextarea,
    TimePicker: FormTimePicker,
  },
  fieldContext,
  formComponents: {
    LockedField: FormLockedField,
    SaveBar: FormSaveBar,
  },
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
