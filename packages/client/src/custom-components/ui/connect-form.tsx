import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export interface ConnectFormProps<FormDataType extends FieldValues = any> {
    children: (method: UseFormReturn<FormDataType>) => ReactNode;
}

export const ConnectForm = <FormDataType extends FieldValues = any>(
    props: ConnectFormProps<FormDataType>,
): ReactNode => {
    const { children } = props;
    const methods = useFormContext<FormDataType>();

    return children({ ...methods });
};
