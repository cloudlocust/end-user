import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { requiredBuilder } from 'src/common/react-platform-components'
import { ContractFormProps, contractFormValuesType } from 'src/modules/Contracts/contractsTypes'
import { useFormContext, useWatch } from 'react-hook-form'
import { Form } from 'src/common/react-platform-components'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import './ContractForm.scss'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import ContractFormSelect from 'src/modules/Contracts/components/ContractFormSelect'
import { useCommercialOffer } from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { IContractType, IOffer, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'
import { ButtonLoader } from 'src/common/ui-kit'
import { isNull, pick } from 'lodash'

const defaultContractFormValues = {
    contractType: '',
    endSubscription: '',
    offer: '',
    power: 0,
    provider: '',
    startSubscription: '',
    tariffType: '',
} as contractFormValuesType

/**
 * Contract form component.
 *
 * @param props N/A.
 * @param props.onSubmit Callback when submitting form.
 * @returns Contract Form component.
 */
const ContractForm = ({ onSubmit }: ContractFormProps) => {
    return (
        <Form
            onSubmit={(data: contractFormValuesType) => {
                const { provider, ...cleanData } = data
                onSubmit(cleanData)
            }}
            defaultValues={defaultContractFormValues}
        >
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
    const formData = useWatch<contractFormValuesType>({ defaultValue: defaultContractFormValues })
    const {
        reset,
        getValues,
        formState: { isSubmitting },
    } = useFormContext<contractFormValuesType>()
    const {
        contractTypeList,
        offerList,
        loadOffers,
        providerList,
        powerList,
        tariffTypeList,
        loadContractTypes,
        loadPowers,
        loadProviders,
        loadTariffTypes,
        isContractTypesLoading,
        isOffersLoading,
        isPowersLoading,
        isProvidersLoading,
        isTariffTypesLoading,
    } = useCommercialOffer()
    const { formatMessage } = useIntl()

    /**
     * Store the loadProviders in a useCalleback to pass it as a prop and avoid multiple re-rendering.
     * To avoid defining () => loadProviders as a prop inside the ContractFormSelect and thus multiple re-rendering cuz ()=>{} create a new function and thus re-ender and thus infinite re-render.
     */
    const loadProviderOptions = useCallback(() => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), ['contractType']),
        })
        loadProviders(Number(formData.contractType))
    }, [loadProviders, reset, getValues, formData.contractType])

    /**
     * LoadOfferOptions useCallback.
     */
    const loadOfferOptions = useCallback(() => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), ['provider', 'contractType']),
        })
        loadOffers(Number(formData.provider), Number(formData.contractType))
    }, [loadOffers, formData.provider, formData.contractType, getValues, reset])

    /**
     * LoadTariffTypeOptions useCallback.
     */
    const loadTariffTypeOptions = useCallback(() => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), ['provider', 'contractType', 'offer']),
        })
        loadTariffTypes(Number(formData.offer))
    }, [loadTariffTypes, getValues, formData.offer, reset])

    /**
     * LoadPowerOptions useCallback.
     */
    const loadPowerOptions = useCallback(() => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), ['provider', 'contractType', 'offer', 'tariffType']),
        })
        loadPowers(Number(formData.offer), Number(formData.tariffType))
    }, [loadPowers, getValues, reset, formData.offer, formData.tariffType])

    return (
        <>
            <ContractFormSelect<IContractType>
                formatOptionLabel={(option) => option.name}
                formatOptionValue={(option) => `${option.id}`}
                isOptionsInProgress={isContractTypesLoading}
                loadOptions={loadContractTypes}
                optionList={contractTypeList}
                name="contractType"
                selectLabel="Type"
                validateFunctions={[requiredBuilder()]}
            />
            {formData.contractType && (
                <ContractFormSelect<IProvider>
                    formatOptionLabel={(option) => option.name}
                    formatOptionValue={(option) => `${option.id}`}
                    isOptionsInProgress={isProvidersLoading}
                    loadOptions={loadProviderOptions}
                    optionList={providerList}
                    name="provider"
                    selectLabel="Fournisseur"
                    validateFunctions={[requiredBuilder()]}
                />
            )}
            {formData.provider && (
                <ContractFormSelect<IOffer>
                    formatOptionLabel={(option) => option.name}
                    formatOptionValue={(option) => `${option.id}`}
                    isOptionsInProgress={isOffersLoading}
                    loadOptions={loadOfferOptions}
                    optionList={offerList}
                    name="offer"
                    selectLabel="Offre"
                    validateFunctions={[requiredBuilder()]}
                />
            )}

            {formData.offer && (
                <ContractFormSelect<ITariffType>
                    formatOptionLabel={(option) => option.name}
                    formatOptionValue={(option) => `${option.id}`}
                    isOptionsInProgress={isTariffTypesLoading}
                    loadOptions={loadTariffTypeOptions}
                    optionList={tariffTypeList}
                    name="tariffType"
                    selectLabel="Type de contrat"
                    validateFunctions={[requiredBuilder()]}
                />
            )}

            {formData.tariffType && (
                <ContractFormSelect<IPower>
                    formatOptionLabel={(option) => `${option} kVA`}
                    formatOptionValue={(option) => `${option}`}
                    isOptionsInProgress={isPowersLoading}
                    loadOptions={loadPowerOptions}
                    optionList={powerList}
                    name="power"
                    selectLabel="Puissance"
                    validateFunctions={[requiredBuilder()]}
                />
            )}
            {/* When doing formData.power && there is a weird unexpected 0 showing in the UI, that's why doing formData.power !== 0 &&  */}
            {formData.power !== 0 && (
                <DatePicker
                    name="startSubscription"
                    label={formatMessage({
                        id: 'Date de début',
                        defaultMessage: 'Date de début',
                    })}
                    validateFunctions={[requiredBuilder()]}
                />
            )}
            {formData.startSubscription && (
                <DatePicker
                    name="endSubscription"
                    label={formatMessage({
                        id: 'Date de fin',
                        defaultMessage: 'Date de fin',
                    })}
                />
            )}
            <ButtonLoader
                variant="contained"
                color="primary"
                className="w-224 mx-auto"
                type="submit"
                inProgress={isSubmitting}
                disabled={
                    isContractTypesLoading ||
                    isProvidersLoading ||
                    isOffersLoading ||
                    isTariffTypesLoading ||
                    isPowersLoading ||
                    isNull(contractTypeList) ||
                    isNull(providerList) ||
                    isNull(offerList) ||
                    isNull(tariffTypeList) ||
                    isNull(powerList)
                }
            >
                {formatMessage({
                    id: 'Enregistrer',
                    defaultMessage: 'Enregistrer',
                })}
            </ButtonLoader>
        </>
    )
}
