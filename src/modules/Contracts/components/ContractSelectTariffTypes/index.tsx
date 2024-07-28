import { FormProvider, useForm } from 'react-hook-form'
import { ButtonLoader } from 'src/common/ui-kit'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import MenuItem from '@mui/material/MenuItem'
import { requiredBuilder } from 'src/common/react-platform-components'
import { ContractSelectTariffTypesProps } from 'src/modules/Contracts/components/ContractSelectTariffTypes/ContractSelectTariffTypes.types'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'

/**
 * Contract Base Tariff type.
 */
export const BASE = 'Base'
const HEURES_PLEINES_HEURES_CREUSES = 'Heures Pleines / Heures Creuses'

/**
 * Contract select custom tariff types.
 *
 * @param root0 N/A.
 * @param root0.label Select label.
 * @param root0.isButtonLoading Button loading.
 * @param root0.isOtherFieldSubmitted State of other field when submitted.
 * @param root0.onButtonClick On button click handler.
 * @param root0.onButtonClickParams On button click params.
 * @param root0.disabled Disabled.
 * @returns Select custom tariff types.
 */
export function ContractSelectTariffTypes({
    label,
    isButtonLoading,
    isOtherFieldSubmitted,
    onButtonClick,
    onButtonClickParams,
    disabled,
}: ContractSelectTariffTypesProps) {
    const methods = useForm()
    const { getValues, watch } = methods
    const currentHousing = useCurrentHousing()

    const customTariffTypeValue = watch('customTariffType')

    /**
     * Handle form submit.
     *
     * @param data Form data.
     * @param data.customTariffType Custom tariff type.
     */
    async function handleFormSubmit(data: /**
     *
     */
    {
        /**
         *
         */
        customTariffType: string
    }) {
        if (!currentHousing) return

        return await onButtonClick({
            name: data.customTariffType,
            housingId: currentHousing.id,
            ...onButtonClickParams,
        })
    }

    return (
        <FormProvider {...methods}>
            <div className="mt-5 w-full">
                <Select
                    name="customTariffType"
                    label={label}
                    validateFunctions={[requiredBuilder()]}
                    formControlProps={{
                        margin: 'normal',
                    }}
                    disabled={disabled}
                >
                    <MenuItem value={BASE}>{BASE}</MenuItem>
                    <MenuItem value={HEURES_PLEINES_HEURES_CREUSES}>{HEURES_PLEINES_HEURES_CREUSES}</MenuItem>
                </Select>
                {/* When the field is submitted, we don't display the submit button */}
                {!isOtherFieldSubmitted && (
                    <div className="mt-5 w-full">
                        <ButtonLoader
                            fullWidth
                            inProgress={isButtonLoading}
                            type="button"
                            onClick={() => {
                                const values = getValues()
                                // eslint-disable-next-line jsdoc/require-jsdoc
                                handleFormSubmit(values as { customTariffType: string })
                            }}
                            disabled={!customTariffTypeValue}
                        >
                            Créer votre type de contract
                        </ButtonLoader>
                    </div>
                )}
            </div>
        </FormProvider>
    )
}
