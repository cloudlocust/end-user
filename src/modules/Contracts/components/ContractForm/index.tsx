import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { dayjsUTC, requiredBuilder } from 'src/common/react-platform-components'
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
import { IContractType, IOffer, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers.d'
import { ButtonLoader } from 'src/common/ui-kit'
import { isNil, isNull, orderBy, pick } from 'lodash'
import { SelectChangeEvent } from '@mui/material/Select'
import OffpeakHoursField from 'src/modules/Contracts/components/OffpeakHoursField'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import { OtherProviderOfferOptionMessage } from 'src/modules/Contracts/components/ContractFormMessages'
import { isActivateOtherOffersAndProviders } from 'src/modules/Contracts/ContractsConfig'
import { isValidDate } from 'src/modules/Contracts/utils/contractsFunctions'
import TariffsContract from 'src/modules/Contracts/components/TariffsContract'
import { manualContractFillingIsEnabled } from 'src/modules/MyHouse/MyHouseConfig'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { ContractFormTypeEnum, useContractStore } from 'src/modules/Contracts/store/contractStore'

const defaultContractFormValues: contractFormValuesType = {
    contractTypeId: '' as unknown as number,
    endSubscription: '',
    offerId: '' as unknown as number,
    power: '' as unknown as number,
    providerId: '' as unknown as number,
    startSubscription: '',
    tariffTypeId: '' as unknown as number,
}

/**
 * Contract form component, for adding contract or editing an existing one (the existing contract will be sent as props defaultValues for the form).
 *
 * @param props N/A.
 * @param props.onSubmit Callback when submitting form.
 * @param props.isContractsLoading Loading state when addContract request.
 * @param props.defaultValues Indicate if contractForm has defaultValues and thus in edit mode.
 * @param props.isUpdateMode Indicate if the form is in update mode.
 * @param props.isFormDescriptionsVisible Indicate if the form descriptions is visible.
 * @param props.isUsingRemoteSubmit Indicate if the form is using remote submit.
 * @returns Contract Form component.
 */
const ContractForm = ({
    onSubmit,
    isContractsLoading,
    defaultValues,
    isUpdateMode = false,
    isFormDescriptionsVisible = true,
    isUsingRemoteSubmit = false,
}: ContractFormProps) => {
    const { editMeter, loadingInProgress } = useMeterForHousing()
    const currentHousing = useCurrentHousing()

    return (
        <Form
            onSubmit={async (data: contractFormValuesType) => {
                const { providerId, startSubscription, endSubscription, meterFeatures, ...restData } = data
                // Format the start subscription to ISO Datetime.
                let cleanData: addContractDataType = {
                    ...restData,
                    startSubscription: dayjsUTC(startSubscription).toISOString(),
                }
                // Format the end subscription to ISO Datetime.
                if (endSubscription) cleanData.endSubscription = dayjsUTC(endSubscription).toISOString()
                // Update meterFeatures if offPeakhours have been set.
                if (meterFeatures && !meterFeatures.offpeak.readOnly) {
                    try {
                        await editMeter(currentHousing!.id, { features: meterFeatures })
                    } catch (error) {
                        // Stop the execution of onSubmit when editMeter fails, and prevent the stop of the app with try/catch block.
                        return
                    }
                }
                onSubmit(cleanData)
            }}
            defaultValues={defaultValues ?? defaultContractFormValues}
            id="contract-form"
        >
            <div className="p-24">
                {isFormDescriptionsVisible && (
                    <>
                        <TypographyFormatMessage className="text-16 font-medium md:text-20">
                            Contrat de fourniture
                        </TypographyFormatMessage>
                        <TypographyFormatMessage
                            className="text-13 font-medium md:text-16"
                            sx={{ color: 'primary.main', marginBottom: '20px' }}
                        >
                            Toutes les informations demandées sont disponibles sur votre facture ou votre contrat
                            d'énergie
                        </TypographyFormatMessage>
                    </>
                )}
                <div className="flex flex-col justify-center w-full">
                    <ContractFormFields
                        isContractsLoading={isContractsLoading || loadingInProgress}
                        isUsingRemoteSubmit={isUsingRemoteSubmit}
                        houseId={currentHousing!.id}
                        isUpdateMode={isUpdateMode}
                    />
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
 * @param props.isUsingRemoteSubmit Indicate if the form is using remote submit.
 * @param props.houseId The house id which the contract is associated with.
 * @param props.isUpdateMode Tells if form is on update or create mode.
 * @returns Contract Form Fields component.
 */
export const ContractFormFields = ({
    isContractsLoading,
    isUsingRemoteSubmit = false,
    houseId,
    isUpdateMode,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
ContractFormFieldsProps) => {
    const formData = useWatch<contractFormValuesType>({})
    const { reset, getValues } = useFormContext<contractFormValuesType>()
    const {
        contractTypeList,
        offerList,
        providerList,
        powerList,
        tariffTypeList,
        loadContractTypes,
        loadOffers,
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
    // Track if the user originally had a deprecated offer.
    const [isUserHasDeprecatedOffer, setIsUserHasDeprecatedOffer] = useState(false)
    const currentHousing = useCurrentHousing()
    const setContractFormType = useContractStore((state) => state.setContractFormType)
    const setDefaultContractFormType = useContractStore((state) => state.setDefaultContractFormType)
    const setFormData = useContractStore((state) => state.setFormData)

    const isCustomFormEnabled = useMemo(
        () => Number(formData.providerId) === -1 || Number(formData.offerId) === -1,
        [formData.offerId, formData.providerId],
    )

    // Set the form type to custom if the user selects the other option.
    useEffect(() => {
        if (isCustomFormEnabled) {
            setContractFormType(ContractFormTypeEnum.Custom)
            setFormData({
                contractTypeId: formData.contractTypeId,
                providerId: formData.providerId,
                offerId: formData.offerId,
                tariffTypeId: formData.tariffTypeId,
            })
        } else {
            setDefaultContractFormType()
        }
    }, [
        formData,
        isCustomFormEnabled,
        setContractFormType,
        setDefaultContractFormType,
        setFormData,
        formData.providerId,
    ])

    // When loading the offers, check if the user's current offer is deprecated.
    useEffect(() => {
        if (!isNil(offerList)) {
            const userCurrentOffer = offerList.find((offer) => offer.id === formData.offerId)
            if (userCurrentOffer && userCurrentOffer.isDeprecated) {
                setIsUserHasDeprecatedOffer(true)
            }
        }
    }, [offerList, formData.offerId])

    const [isEDFOffer, setIsEDFOffer] = useState(false)
    const [isCustomOffer, setIsCustomOffer] = useState(false)

    const ALLOWED_OFFERS = useMemo(() => ['Tarif Bleu', 'Tempo'], [])

    useEffect(() => {
        if (formData.offerId && Boolean(offerList?.find((offer) => offer.id === formData.offerId)?.networkIdentifier)) {
            setIsCustomOffer(true)
        }
    }, [formData.offerId, offerList, setIsCustomOffer])

    useEffect(() => {
        if (ALLOWED_OFFERS.includes(offerList?.find((offer) => offer.id === formData.offerId)?.name!)) {
            setIsEDFOffer(true)
        }
    }, [formData.offerId, offerList, setIsEDFOffer, ALLOWED_OFFERS])

    // if the offer is selected and it's not one of the default offers, set the form type to custom.
    useEffect(() => {
        if (
            !isUpdateMode &&
            formData.offerId! > 0 &&
            !ALLOWED_OFFERS.includes(offerList?.find((offer) => offer.id === formData.offerId)?.name!)
        ) {
            setFormData({
                contractTypeId: formData.contractTypeId,
                providerId: formData.providerId,
                offerId: formData.offerId,
            })
            setContractFormType(ContractFormTypeEnum.Custom)
        }
    }, [formData, isUpdateMode, setFormData, setContractFormType, isEDFOffer, ALLOWED_OFFERS, offerList])

    const offersListWithoutDeprecated = useMemo(() => {
        return offerList?.filter((offer) => isUserHasDeprecatedOffer || !offer?.isDeprecated)
    }, [offerList, isUserHasDeprecatedOffer])

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
        loadProviders(formData.contractTypeId!, currentHousing?.id, isUpdateMode ? undefined : true)
    }, [loadProviders, formData.contractTypeId, currentHousing?.id, isUpdateMode])

    /**
     * LoadOfferOptions useCallback.
     */
    const loadOfferOptions = useCallback(() => {
        loadOffers(formData.providerId!, formData.contractTypeId!, houseId, isUpdateMode ? undefined : true)
    }, [loadOffers, formData.providerId, formData.contractTypeId, isUpdateMode, houseId])

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
    return (
        <>
            <ContractFormSelect<IContractType>
                formatOptionLabel={(option) => option.name}
                formatOptionValue={(option) => option.id}
                isOptionsInProgress={isContractTypesLoading}
                loadOptions={loadContractTypes}
                optionList={contractTypeList}
                name="contractTypeId"
                label="Contrat pro ou particulier"
                validateFunctions={[requiredBuilder()]}
                onChange={(e) => onSelectChange(e, [])}
                disabled={isUpdateMode}
            />
            {Boolean(formData.contractTypeId) && (
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
                    disabled={isUpdateMode}
                />
            )}

            {Number(formData.providerId) > 0 && (
                <>
                    <ContractFormSelect<IOffer>
                        formatOptionLabel={(option) => option.name}
                        formatOptionValue={(option) => option.id}
                        isOptionsInProgress={isOffersLoading}
                        loadOptions={loadOfferOptions}
                        optionList={orderBy(offersListWithoutDeprecated, 'name', 'asc')}
                        otherOptionLabel={isActivateOtherOffersAndProviders ? 'Autre offre' : undefined}
                        name="offerId"
                        label="Offre"
                        validateFunctions={[requiredBuilder()]}
                        onChange={(e) => onSelectChange(e, ['providerId', 'contractTypeId'])}
                        disabled={isUpdateMode}
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
                    disabled={isUpdateMode && !isEDFOffer}
                />
            )}

            {isOffpeakHoursSelected && (
                <OffpeakHoursField
                    name="meterFeatures"
                    label="Plages heures creuses :"
                    houseId={houseId}
                    disabled={isUpdateMode && !isEDFOffer}
                />
            )}
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
                          disabled={!isEDFOffer}
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
                          disabled={isUpdateMode && !isEDFOffer}
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
                    disabled={!manualContractFillingIsEnabled || (isUpdateMode && !isEDFOffer) || isCustomOffer}
                />
            )}
            {
                /**
                 * We check if the date is valid to avoid problem of invalid date,
                 * when the user set the date by the keyboard instead of using the picker.
                 */
                formData.startSubscription && isValidDate(formData.startSubscription!) && (
                    <DatePicker
                        name="endSubscription"
                        label={formatMessage({
                            id: `Date de fin ${isEDFOffer && '(Si terminé)'}`,
                            defaultMessage: `Date de fin ${isEDFOffer && '(Si terminé)'}`,
                        })}
                        validateFunctions={isEDFOffer ? [] : [requiredBuilder()]}
                        disabled={!manualContractFillingIsEnabled || (isUpdateMode && !isEDFOffer) || isCustomOffer}
                    />
                )
            }
            {/* DOUBLE CHECK CONDITION for isUsingRemoteSubmit */}
            {((isUpdateMode && isEDFOffer) || !isUpdateMode) &&
                !isCustomOffer &&
                manualContractFillingIsEnabled &&
                (!isCustomFormEnabled || !isUsingRemoteSubmit) && (
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
                )}

            <TariffsContract />
        </>
    )
}
