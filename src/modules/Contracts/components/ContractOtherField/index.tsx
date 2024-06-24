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
 * @param param0.onButtonClick Button action.
 * @param param0.isButtonLoading Button loading state.
 * @param param0.validateFunctions Field validation functions.
 * @param param0.isOtherFieldSubmitted Boolean state to check if the field is submitted.
 * @param param0.onButtonClickParams Rest of params for ButtonClick data.
 * @returns ContractOtherField component.
 */
export default function ContractOtherField<T extends unknown, R>({
    name,
    label,
    buttonLabel,
    onButtonClick,
    isButtonLoading,
    validateFunctions,
    isOtherFieldSubmitted,
    onButtonClickParams,
}: ContractOtherFieldProps<T, R>) {
    const methods = useForm<T & FieldValues>()
    const currentHousing = useCurrentHousing()

    const { getValues } = methods

    /**
     * Handle form submit.
     *
     * @param data Form data.
     */
    async function handleFormSubmit(data: UnpackNestedValue<T & FieldValues>) {
        const name = data.name as keyof T
        if (currentHousing?.id) {
            return (await onButtonClick({ name, housingId: currentHousing.id, ...onButtonClickParams } as T)) as R
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
                    data-testid="custom-provider-textfield"
                />
                {/* When the field is submitted, we don't display the submit button */}
                {!isOtherFieldSubmitted && (
                    <div className="mt-5 w-full">
                        <ButtonLoader
                            fullWidth
                            inProgress={isButtonLoading}
                            type="button"
                            onClick={() => {
                                const values = getValues()
                                handleFormSubmit(values)
                            }}
                        >
                            {buttonLabel}
                        </ButtonLoader>
                    </div>
                )}
            </div>
        </FormProvider>
    )
}
