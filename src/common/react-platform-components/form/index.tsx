import { FormProvider, useForm, FieldValues } from 'react-hook-form'
import { FC } from 'react'

/**
 * Form wrapper props.
 */
export type FormProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Default values to be used in the form.
         */
        defaultValues?: FieldValues
        /**
         * Submission function.
         */
        onSubmit(model: unknown): void
        /**
         * Erro handler.
         */
        onError?(error: unknown): void
        /**
         * Form style.
         */
        style?: React.CSSProperties
    }

/**
 * Form wrapper for react form hooks.
 *
 * @param props N/A.
 * @param props.children React children elements.
 * @param props.defaultValues Default values to inject to the form.
 * @param props.onError Error handler.
 * @param props.onSubmit Submit handler.
 * @returns Wrapped form hook component.
 */
export const Form: FC<FormProps> = ({ children, defaultValues, onError, onSubmit, ...formProps }): JSX.Element => {
    const methods = useForm({ mode: 'all', ...(defaultValues ? { defaultValues } : null) })
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onError)} noValidate {...formProps}>
                {children}
            </form>
        </FormProvider>
    )
}
