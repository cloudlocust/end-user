import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { requiredBuilder } from 'src/common/react-platform-components'
import {
    addContractDataType,
    ContractFormFieldsProps,
    ContractFormProps,
    contractFormValuesType,
} from 'src/modules/Contracts/contractsTypes'
import { useFormContext, useWatch } from 'react-hook-form'
import { Form } from 'src/common/react-platform-components'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import ContractFormSelect from 'src/modules/Contracts/components/ContractFormSelect'
import { useCommercialOffer } from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { IContractType, IOffer, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'
import { ButtonLoader } from 'src/common/ui-kit'
import { isNull, pick } from 'lodash'

const defaultContractFormValues: contractFormValuesType = {
    contractTypeId: 0,
    endSubscription: '',
    offerId: 0,
    power: 0,
    providerId: 0,
    startSubscription: '',
    tariffTypeId: 0,
}

/**
 * Contract form component.
 *
 * @param props N/A.
 * @param props.onSubmit Callback when submitting form.
 * @param props.isContractsLoading Loading state when addContract request.
 * @returns Contract Form component.
 */
const ContractForm = ({ onSubmit, isContractsLoading }: ContractFormProps) => {
    return (
        <Form
            onSubmit={(data: contractFormValuesType) => {
                const { providerId, startSubscription, endSubscription, ...restData } = data
                // Format the start subscription to ISO Datetime.
                let cleanData: addContractDataType = {
                    ...restData,
                    startSubscription: new Date(startSubscription).toISOString(),
                }
                // Format the end subscription to ISO Datetime.
                if (endSubscription) cleanData.endSubscription = new Date(startSubscription).toISOString()
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
                    <ContractFormFields isContractsLoading={isContractsLoading} />
                </div>
            </div>
        </Form>
    )
}

export default ContractForm

/**
 * Contract Form Fields component.
 *
 * @param props N/A.
 * @param props.isContractsLoading Loading state when addContract request.
 * @returns Contract Form Fields component.
 */
const ContractFormFields = ({ isContractsLoading }: ContractFormFieldsProps) => {
    const formData = useWatch<contractFormValuesType>({})
    const { reset, getValues } = useFormContext<contractFormValuesType>()
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
            ...pick(getValues(), ['contractTypeId']),
        })
        loadProviders(formData.contractTypeId!)
    }, [loadProviders, reset, getValues, formData.contractTypeId])

    /**
     * LoadOfferOptions useCallback.
     */
    const loadOfferOptions = useCallback(() => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), ['providerId', 'contractTypeId']),
        })
        loadOffers(formData.providerId!, formData.contractTypeId!)
    }, [loadOffers, formData.providerId, formData.contractTypeId, getValues, reset])

    /**
     * LoadTariffTypeOptions useCallback.
     */
    const loadTariffTypeOptions = useCallback(() => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), ['providerId', 'contractTypeId', 'offerId']),
        })
        loadTariffTypes(formData.offerId!)
    }, [loadTariffTypes, getValues, formData.offerId, reset])

    /**
     * LoadPowerOptions useCallback.
     */
    const loadPowerOptions = useCallback(() => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), ['providerId', 'contractTypeId', 'offerId', 'tariffTypeId']),
        })
        loadPowers(formData.offerId!, formData.tariffTypeId!)
    }, [loadPowers, getValues, reset, formData.offerId, formData.tariffTypeId])

    return (
        <>
            <ContractFormSelect<IContractType>
                formatOptionLabel={(option) => option.name}
                formatOptionValue={(option) => option.id}
                isOptionsInProgress={isContractTypesLoading}
                loadOptions={loadContractTypes}
                optionList={contractTypeList}
                name="contractTypeId"
                selectLabel="Type"
                validateFunctions={[requiredBuilder()]}
            />
            {Boolean(formData.contractTypeId) && (
                <ContractFormSelect<IProvider>
                    formatOptionLabel={(option) => option.name}
                    formatOptionValue={(option) => option.id}
                    isOptionsInProgress={isProvidersLoading}
                    loadOptions={loadProviderOptions}
                    optionList={providerList}
                    name="providerId"
                    selectLabel="Fournisseur"
                    validateFunctions={[requiredBuilder()]}
                />
            )}
            {Boolean(formData.providerId) && (
                <ContractFormSelect<IOffer>
                    formatOptionLabel={(option) => option.name}
                    formatOptionValue={(option) => option.id}
                    isOptionsInProgress={isOffersLoading}
                    loadOptions={loadOfferOptions}
                    optionList={offerList}
                    name="offerId"
                    selectLabel="Offre"
                    validateFunctions={[requiredBuilder()]}
                />
            )}

            {Boolean(formData.offerId) && (
                <ContractFormSelect<ITariffType>
                    formatOptionLabel={(option) => option.name}
                    formatOptionValue={(option) => option.id}
                    isOptionsInProgress={isTariffTypesLoading}
                    loadOptions={loadTariffTypeOptions}
                    optionList={tariffTypeList}
                    name="tariffTypeId"
                    selectLabel="Type de contrat"
                    validateFunctions={[requiredBuilder()]}
                />
            )}

            {Boolean(formData.tariffTypeId) && (
                <ContractFormSelect<IPower>
                    formatOptionLabel={(option) => `${option} kVA`}
                    formatOptionValue={(option) => option}
                    isOptionsInProgress={isPowersLoading}
                    loadOptions={loadPowerOptions}
                    optionList={powerList}
                    name="power"
                    selectLabel="Puissance"
                    validateFunctions={[requiredBuilder()]}
                />
            )}
            {/* When doing formData.power && there is a weird unexpected 0 showing in the UI, that's why doing formData.power !== 0 &&  */}
            {Boolean(formData.power) && (
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
                inProgress={isContractsLoading}
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
