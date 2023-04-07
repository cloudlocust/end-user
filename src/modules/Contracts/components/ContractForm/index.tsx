import React, { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { requiredBuilder } from 'src/common/react-platform-components'
import {
    addContractDataType,
    ContractFormFieldsProps,
    ContractFormProps,
    contractFormValuesType,
    contractsRouteParam,
    TariffContractItemProps,
    TariffsContractProps,
} from 'src/modules/Contracts/contractsTypes'
import { useFormContext, useWatch } from 'react-hook-form'
import { Form } from 'src/common/react-platform-components'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import ContractFormSelect from 'src/modules/Contracts/components/ContractFormSelect'
import { useCommercialOffer } from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { IContractType, IOffer, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'
import { ButtonLoader } from 'src/common/ui-kit'
import { isNull, orderBy, pick } from 'lodash'
import { SelectChangeEvent } from '@mui/material/Select'
import OffpeakHoursField from 'src/modules/Contracts/components/OffpeakHoursField'
import { useParams } from 'react-router-dom'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import { OtherProviderOfferOptionMessage } from 'src/modules/Contracts/components/ContractFormMessages'
import { isActivateOtherOffersAndProviders } from 'src/modules/Contracts/ContractsConfig'
import { getTariffContractUnit } from 'src/modules/Contracts/utils/contractsFunctions'
import CircularProgress from '@mui/material/CircularProgress'

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
 * Contract form component, for adding contract or editing an existing one (the existing contract will be sent as props defaultValues for the form).
 *
 * @param props N/A.
 * @param props.onSubmit Callback when submitting form.
 * @param props.isContractsLoading Loading state when addContract request.
 * @param props.defaultValues Indicate if contractForm has defaultValues and thus in edit mode.
 * @returns Contract Form component.
 */
const ContractForm = ({ onSubmit, isContractsLoading, defaultValues }: ContractFormProps) => {
    // HouseId extracted from params of the url :houseId/contracts
    const { houseId } = useParams<contractsRouteParam>()
    const { editMeter, loadingInProgress } = useMeterForHousing()

    return (
        <Form
            onSubmit={async (data: contractFormValuesType) => {
                const { providerId, startSubscription, endSubscription, meterFeatures, ...restData } = data
                // Format the start subscription to ISO Datetime.
                let cleanData: addContractDataType = {
                    ...restData,
                    startSubscription: new Date(startSubscription).toISOString(),
                }
                // Format the end subscription to ISO Datetime.
                if (endSubscription) cleanData.endSubscription = new Date(endSubscription).toISOString()
                // Update meterFeatures if offPeakhours have been set.
                if (meterFeatures && !meterFeatures.offpeak.readOnly) {
                    try {
                        await editMeter(parseInt(houseId), { features: meterFeatures })
                    } catch (error) {
                        // Stop the execution of onSubmit when editMeter fails, and prevent the stop of the app with try/catch block.
                        return
                    }
                }
                onSubmit(cleanData)
            }}
            defaultValues={defaultValues ?? defaultContractFormValues}
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
                    <ContractFormFields isContractsLoading={isContractsLoading || loadingInProgress} />
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
        providerList,
        powerList,
        tariffTypeList,
        tariffs,
        loadContractTypes,
        loadOffers,
        loadPowers,
        loadProviders,
        loadTariffTypes,
        loadTariffsHousingContract,
        setTariffs,
        isContractTypesLoading,
        isOffersLoading,
        isPowersLoading,
        isProvidersLoading,
        isTariffTypesLoading,
        isTariffsLoading,
    } = useCommercialOffer()
    const { formatMessage } = useIntl()

    // Check that offPeakHours tariff type is selected.
    const isOffpeakHoursSelected = useMemo(
        () =>
            tariffTypeList?.some(
                (tariffType) =>
                    tariffType.id === formData.tariffTypeId &&
                    ['Heures Pleines / Heures Creuses', 'Heures Creuses et Week-End'].includes(tariffType.name),
            ),
        [formData.tariffTypeId, tariffTypeList],
    )

    /**
     * Handler when the Select field change, it resets the fields that comes after the changed select.
     *
     * @param e Select Change Event.
     * @param keepFields Fields that are prior to the select and thus should not be ressetted.
     */
    const onSelectChange = (e: SelectChangeEvent<unknown>, keepFields: string[]) => {
        reset({
            ...defaultContractFormValues,
            ...pick(getValues(), keepFields),
            [e.target.name]: e.target.value,
        })
    }
    /**
     * Store the loadProviders in a useCalleback to pass it as a prop and avoid multiple re-rendering.
     * To avoid defining () => loadProviders as a prop inside the ContractFormSelect and thus multiple re-rendering cuz ()=>{} create a new function and thus re-ender and thus infinite re-render.
     */
    const loadProviderOptions = useCallback(() => {
        loadProviders(formData.contractTypeId!)
    }, [loadProviders, formData.contractTypeId])

    /**
     * LoadOfferOptions useCallback.
     */
    const loadOfferOptions = useCallback(() => {
        loadOffers(formData.providerId!, formData.contractTypeId!)
    }, [loadOffers, formData.providerId, formData.contractTypeId])

    /**
     * LoadTariffTypeOptions useCallback.
     */
    const loadTariffTypeOptions = useCallback(() => {
        loadTariffTypes(formData.offerId!)
    }, [loadTariffTypes, formData.offerId])

    /**
     * LoadPowerOptions useCallback.
     */
    const loadPowerOptions = useCallback(() => {
        loadPowers(formData.offerId!, formData.tariffTypeId!)
    }, [loadPowers, formData.offerId, formData.tariffTypeId])

    /**
     * LoadPowerOptions useCallback.
     */
    const loadTariffsContract = useCallback(() => {
        loadTariffsHousingContract(
            formData.offerId!,
            formData.tariffTypeId!,
            formData.contractTypeId!,
            formData.power!,
            new Date(formData.startSubscription!).toISOString(),
        )
    }, [
        formData.contractTypeId,
        formData.offerId,
        formData.power,
        formData.startSubscription,
        formData.tariffTypeId,
        loadTariffsHousingContract,
    ])

    useEffect(() => {
        /**
         * When the user set the start subscription date then we retrieve the tariffs from the back.
         * We check if the date is valid to avoid problem of invalid date,
         when the user set the date by the keyboard instead of using the picker.
        */
        if (!isNaN(new Date(formData.startSubscription!).getTime())) loadTariffsContract()
        else setTariffs(null)
    }, [formData.startSubscription, loadTariffsContract, setTariffs])

    return (
        <>
            <ContractFormSelect<IContractType>
                formatOptionLabel={(option) => option.name}
                formatOptionValue={(option) => option.id}
                isOptionsInProgress={isContractTypesLoading}
                loadOptions={loadContractTypes}
                optionList={contractTypeList}
                name="contractTypeId"
                label="Type"
                validateFunctions={[requiredBuilder()]}
                onChange={(e) => onSelectChange(e, [])}
            />
            {Boolean(formData.contractTypeId) && (
                <>
                    <ContractFormSelect<IProvider>
                        formatOptionLabel={(option) => option.name}
                        formatOptionValue={(option) => option.id}
                        isOptionsInProgress={isProvidersLoading}
                        loadOptions={loadProviderOptions}
                        optionList={orderBy(providerList, 'name', 'asc')}
                        otherOptionLabel={isActivateOtherOffersAndProviders ? 'Autre fournisseur' : undefined}
                        name="providerId"
                        label="Fournisseur"
                        validateFunctions={[requiredBuilder()]}
                        onChange={(e) => onSelectChange(e, ['contractTypeId'])}
                    />
                    <OtherProviderOfferOptionMessage isShowMessage={formData.providerId === -1} />
                </>
            )}
            {Number(formData.providerId) > 0 && (
                <>
                    <ContractFormSelect<IOffer>
                        formatOptionLabel={(option) => option.name}
                        formatOptionValue={(option) => option.id}
                        isOptionsInProgress={isOffersLoading}
                        loadOptions={loadOfferOptions}
                        otherOptionLabel={isActivateOtherOffersAndProviders ? 'Autre offre' : undefined}
                        optionList={orderBy(offerList, 'name', 'asc')}
                        name="offerId"
                        label="Offre"
                        validateFunctions={[requiredBuilder()]}
                        onChange={(e) => onSelectChange(e, ['providerId', 'contractTypeId'])}
                    />
                    <OtherProviderOfferOptionMessage isShowMessage={formData.offerId === -1} />
                </>
            )}

            {Number(formData.offerId) > 0 && (
                <ContractFormSelect<ITariffType>
                    formatOptionLabel={(option) => option.name}
                    formatOptionValue={(option) => option.id}
                    isOptionsInProgress={isTariffTypesLoading}
                    loadOptions={loadTariffTypeOptions}
                    optionList={tariffTypeList}
                    name="tariffTypeId"
                    label="Type de contrat"
                    validateFunctions={[requiredBuilder()]}
                    onChange={(e) => onSelectChange(e, ['providerId', 'contractTypeId', 'offerId'])}
                />
            )}

            {isOffpeakHoursSelected && <OffpeakHoursField name="meterFeatures" label="Plages heures creuses :" />}
            {isOffpeakHoursSelected
                ? Boolean(formData.meterFeatures) &&
                  // Before showing the power check that start and end has been filled
                  formData.meterFeatures!.offpeak!.offpeakHours!.some(
                      (offpeakHour) => offpeakHour.start && offpeakHour.end,
                  ) && (
                      <ContractFormSelect<IPower>
                          formatOptionLabel={(option) => `${option} kVA`}
                          formatOptionValue={(option) => option}
                          isOptionsInProgress={isPowersLoading}
                          loadOptions={loadPowerOptions}
                          optionList={powerList}
                          name="power"
                          label="Puissance"
                          validateFunctions={[requiredBuilder()]}
                          onChange={(e) =>
                              onSelectChange(e, [
                                  'providerId',
                                  'contractTypeId',
                                  'offerId',
                                  'tariffTypeId',
                                  'meterFeatures',
                              ])
                          }
                      />
                  )
                : Boolean(formData.tariffTypeId) && (
                      <ContractFormSelect<IPower>
                          formatOptionLabel={(option) => `${option} kVA`}
                          formatOptionValue={(option) => option}
                          isOptionsInProgress={isPowersLoading}
                          loadOptions={loadPowerOptions}
                          optionList={powerList}
                          name="power"
                          label="Puissance"
                          validateFunctions={[requiredBuilder()]}
                          onChange={(e) =>
                              onSelectChange(e, ['providerId', 'contractTypeId', 'offerId', 'tariffTypeId'])
                          }
                      />
                  )}

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
            {
                /**
                 * We check if the date is valid to avoid problem of invalid date,
                 * when the user set the date by the keyboard instead of using the picker.
                 */
                formData.startSubscription && !isNaN(new Date(formData.startSubscription!).getTime()) && (
                    <DatePicker
                        name="endSubscription"
                        label={formatMessage({
                            id: 'Date de fin (Si terminé)',
                            defaultMessage: 'Date de fin (Si terminé)',
                        })}
                    />
                )
            }
            <ButtonLoader
                variant="contained"
                color="primary"
                className="w-full mx-auto mt-20"
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
                    isNull(powerList) ||
                    !Boolean(formData.startSubscription)
                }
            >
                {formatMessage({
                    id: 'Enregistrer',
                    defaultMessage: 'Enregistrer',
                })}
            </ButtonLoader>
            <TariffsContract tariffs={tariffs} isTariffsLoading={isTariffsLoading} />
        </>
    )
}

/**
 * Tariff Item component.
 *
 * @param props N/A.
 * @param props.label Name of tariff.
 * @param props.price Price of tariff.
 * @param props.unit Unit.
 * @returns Tariff Item component.
 */
const TariffContractItem = ({ label, price, unit }: TariffContractItemProps) => (
    <div className="flex flex-col justify-center items-center w-full py-4">
        <TypographyFormatMessage className="text-13 font-medium text-center md:text-14" sx={{ color: 'grey.600' }}>
            {`${label}: ${price} ${unit}`}
        </TypographyFormatMessage>
    </div>
)

/**
 * Tariffs Contract Component.
 *
 * @param props N/A.
 * @param props.tariffs List of tariff contract.
 * @param props.isTariffsLoading Is tariffs request is loading from the backend.
 * @returns Tariffs Contract Component.
 */
export const TariffsContract = ({ tariffs, isTariffsLoading }: TariffsContractProps) => {
    const { formatMessage } = useIntl()

    if (!tariffs) return null

    return (
        <div className="flex flex-col justify-center w-full p-8 pt-16">
            {isTariffsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                    <CircularProgress size={32} />
                </div>
            ) : tariffs.length > 0 ? (
                tariffs
                    // Sort the tariffs to show it alphabetically by label.
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((tariff) => (
                        <TariffContractItem
                            key={tariff.label}
                            label={tariff.label}
                            price={tariff.price}
                            unit={getTariffContractUnit(tariff)}
                        />
                    ))
            ) : (
                <TypographyFormatMessage
                    className="text-13 font-medium text-center md:text-14"
                    sx={{ color: 'grey.600' }}
                >
                    {formatMessage({
                        id: 'Aucun tarif disponible',
                        defaultMessage: 'Aucun tarif disponible',
                    })}
                </TypographyFormatMessage>
            )}
        </div>
    )
}
