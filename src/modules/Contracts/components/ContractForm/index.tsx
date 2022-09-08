import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { requiredBuilder } from 'src/common/react-platform-components'
import { ButtonLoader } from 'src/common/ui-kit'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { ContractFormProps, addContractDataType } from 'src/modules/Contracts/contractsTypes'
import { useFormContext, useWatch } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import { Form } from 'src/common/react-platform-components'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import './ContractForm.scss'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'

const defaultContractFormValues = {
    endSubscription: '',
    offer: '',
    power: 0,
    provider: '',
    startSubscription: '',
    tariffType: '',
} as addContractDataType
/**
 * Contract form component.
 *
 * @param props N/A.
 * @param props.onSubmit Callback when submitting form.
 * @param props.isContractsLoading Loading state when submitting form.
 * @returns Contract Form component.
 */
const ContractForm = ({ onSubmit, isContractsLoading }: ContractFormProps) => {
    const { formatMessage } = useIntl()

    return (
        <Form onSubmit={onSubmit} defaultValues={defaultContractFormValues}>
            <div className="p-24">
                <TypographyFormatMessage className="text-16 font-medium md:text-20">
                    Contrat de fourniture
                </TypographyFormatMessage>
                <TypographyFormatMessage
                    className="text-13 font-medium md:text-16"
                    sx={{ color: 'primary.main', marginBottom: '20px' }}
                >
                    Toutes les informations demandées sont disponibles sur votre facture ou votre contrat d'énergie
                </TypographyFormatMessage>
                <div className="flex flex-col justify-center w-full">
                    <ContractFormFields />
                    <ButtonLoader
                        variant="contained"
                        color="primary"
                        className="w-224 mx-auto"
                        inProgress={isContractsLoading}
                        type="submit"
                    >
                        {formatMessage({
                            id: 'Enregistrer',
                            defaultMessage: 'Enregistrer',
                        })}
                    </ButtonLoader>
                </div>
            </div>
        </Form>
    )
}

export default ContractForm
/**
 * Contract Form Fields component.
 *
 * @returns Contract Form Fields component.
 */
const ContractFormFields = () => {
    const formData = useWatch<addContractDataType>({ defaultValue: defaultContractFormValues })
    const { reset, watch, getValues } = useFormContext<addContractDataType>()
    const providerValue = watch('provider')
    const offerValue = watch('offer')
    const tariffTypeValue = watch('tariffType')
    const powerValue = watch('power')
    const startSubscriptionValue = watch('startSubscription')
    const { formatMessage } = useIntl()

    console.log('formData', formData)

    useEffect(() => {
        // Load OFFERS
        // fieldNNames.reduce((prev, curr) => {}, )
        reset({
            ...defaultContractFormValues,
            provider: formData.provider,
        })
    }, [formData.provider, reset])

    return (
        <>
            {/* TODO Change offer Select so that data comes from commercial offer request  */}
            <Select
                name="provider"
                label={formatMessage({
                    id: 'Fournisseur',
                    defaultMessage: 'Fournisseur',
                })}
            >
                {Array(9)
                    .fill(0)
                    .map((val, index) => (
                        <MenuItem key={`Fournisseur-${index + 1}`} value={`Fournisseur-${index + 1}`}>{`Fournisseur-${
                            index + 1
                        }`}</MenuItem>
                    ))}
            </Select>
            {/* TODO Change offer Select so that data comes from commercial offer request  */}
            {providerValue && (
                <Select
                    name="offer"
                    label={formatMessage({
                        id: 'Offre',
                        defaultMessage: 'Offre',
                    })}
                    validateFunctions={[requiredBuilder()]}
                >
                    {Array(5)
                        .fill(0)
                        .map((val, index) => (
                            <MenuItem key={`Offre-${index + 1}`} value={`Offre-${index + 1}`}>{`Offre-${
                                index + 1
                            }`}</MenuItem>
                        ))}
                </Select>
            )}
            {/* TODO Change offer Select so that data comes from commercial offer request  */}
            {offerValue && (
                <Select
                    name="tariffType"
                    label={formatMessage({
                        id: 'Type de contrat',
                        defaultMessage: 'Type de contrat',
                    })}
                    validateFunctions={[requiredBuilder()]}
                >
                    {Array(3)
                        .fill(0)
                        .map((val, index) => (
                            <MenuItem key={`Type-${index + 1}`} value={`Type-${index + 1}`}>{`Type-${
                                index + 1
                            }`}</MenuItem>
                        ))}
                </Select>
            )}
            {tariffTypeValue && (
                <Select
                    name="power"
                    label={formatMessage({
                        id: 'Puissance',
                        defaultMessage: 'Puissance',
                    })}
                    validateFunctions={[requiredBuilder()]}
                >
                    {Array(9)
                        .fill(0)
                        .map((val, index) => (
                            <MenuItem key={`${index + 1} kVA`} value={`${index + 1} kVA`}>{`${
                                index + 1
                            } kVA`}</MenuItem>
                        ))}
                </Select>
            )}
            {powerValue !== 0 && (
                <DatePicker
                    name="startSubscription"
                    label={formatMessage({
                        id: 'Date de début',
                        defaultMessage: 'Date de début',
                    })}
                    validateFunctions={[requiredBuilder()]}
                />
            )}
            {startSubscriptionValue && (
                <DatePicker
                    name="endSubscription"
                    label={formatMessage({
                        id: 'Date de fin',
                        defaultMessage: 'Date de fin',
                    })}
                />
            )}
        </>
    )
}
