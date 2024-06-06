import { ButtonLoader, MuiTextField } from 'src/common/ui-kit'
import { ContractOtherFieldProps } from 'src/modules/Contracts/components/ContractOtherField/ContractOtherField.types'
import { useForm, FormProvider, FieldValues, UnpackNestedValue } from 'react-hook-form'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'

/**
 * Reusable component for contract other fields.
 *
 * @param param0 N/A.
 * @param param0.name Field name.
 * @param param0.label Field label.
 * @param param0.buttonLabel Button label.
 * @param param0.buttonAction Button action.
 * @param param0.buttonLoading Button loading state.
 * @param param0.validateFunctions Field validation functions.
 * @returns ContractOtherField component.
 */
export default function ContractOtherField<T extends unknown>({
    name,
    label,
    buttonLabel,
    buttonAction,
    buttonLoading,
    validateFunctions,
}: ContractOtherFieldProps<T>) {
    const methods = useForm<T & FieldValues>()
    const currentHousing = useCurrentHousing()

    const { getValues } = methods

    /**
     * Handle form submit.
     *
     * @param data Form data.
     */
    async function handleFormSubmit(data: UnpackNestedValue<T & FieldValues>) {
        const name = data.name as string
        if (currentHousing?.id) {
            await buttonAction({ name, housingId: currentHousing.id } as T)
        }
    }

    return (
        <FormProvider {...methods}>
            <div className="w-full">
                <MuiTextField
                    name={name}
                    label={label}
                    validateFunctions={validateFunctions}
                    margin="normal"
                    fullWidth
                />
                <div className="mt-5 w-full">
                    <ButtonLoader
                        fullWidth
                        inProgress={buttonLoading}
                        type="button"
                        onClick={() => {
                            const values = getValues()
                            handleFormSubmit(values)
                        }}
                    >
                        {buttonLabel}
                    </ButtonLoader>
                </div>
            </div>
        </FormProvider>
    )
}
