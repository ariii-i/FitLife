import { FormProvider as RHFFormProvider, useForm } from "react-hook-form";

export interface PzFormProviderProps {
  className?: string;
  defaultValues?: any;
  children?: any;
  onSubmit?: any;
  showDevTool?: boolean;
}

export const FormProvider = (props: PzFormProviderProps) => {
  const { defaultValues, className, children, onSubmit } = props;
  const methods = useForm({
    mode: "all",
    defaultValues: defaultValues,
    shouldUseNativeValidation: false,
  });

  return (
    <RHFFormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </RHFFormProvider>
  );
};
