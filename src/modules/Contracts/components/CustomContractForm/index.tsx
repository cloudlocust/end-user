import { Form, dayjsUTC, requiredBuilder } from 'src/common/react-platform-components'
import { useSnackbar } from 'notistack'

import {
    useCommercialOffer,
    useCreateCustomOffer,
    useCreateCustomProvider,
    useCreateCustomTariffType,
} from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import {
    ICreateCustomOffer,
    ICreateCustomProvider,
    IOffer,
    IProvider,
} from 'src/hooks/CommercialOffer/CommercialOffers'
import ContractOtherField from 'src/modules/Contracts/components/ContractOtherField'
import { BASE, ContractSelectTariffTypes } from 'src/modules/Contracts/components/ContractSelectTariffTypes'
import { CustomContractFormProps } from 'src/modules/Contracts/components/CustomContractForm/CustomContractForm.types'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useContractStore } from 'src/modules/Contracts/store/contractStore'
import { TextField } from 'src/common/ui-kit'
import { useEffect, useRef, useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader } from 'src/common/ui-kit'
import { addContractDataType } from '../../contractsTypes'
import { primaryMainColor } from 'src/modules/utils/muiThemeVariables'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import OffpeakHoursField from '../OffpeakHoursField'

/**
 * Custom contract form.
 *
 * @param root0 N/A.
 * @param root0.onSubmit On submit handler.
 * @param root0.isContractsLoading Loading state.
 * @returns Custom contract form.
 */
export default function CustonContractForm({ onSubmit, isContractsLoading }: CustomContractFormProps) {
    const { formatMessage } = useIntl()
    const contractTypeId = useContractStore((state) => state.formData)?.contractTypeId
    const storedProviderId = useContractStore((state) => state.formData)?.providerId
    const storedOfferId = useContractStore((state) => state.formData)?.offerId

    const currentHousing = useCurrentHousing()
    const setDefaultContractFormType = useContractStore((state) => state.setDefaultContractFormType)
    const { enqueueSnackbar } = useSnackbar()
    const { editMeter, loadingInProgress } = useMeterForHousing()

    const onMount = useRef(false)

    const { providerList, offerList, loadProviders, loadOffers } = useCommercialOffer()
    const { createCustomProvider, isCreateCustomProviderLoading, customProvderData } = useCreateCustomProvider()
    const { createCustomOffer, isCreateCustomOfferLoading, customOfferData } = useCreateCustomOffer()
    const { createCustomTariffType, isCreateCustomTariffTypeLoading, isCustomTariffTypeCreated, customTariffTypeData } =
        useCreateCustomTariffType()

    const [providerId, setProviderId] = useState(
        !storedProviderId || storedProviderId !== -1 ? storedProviderId : customProvderData?.id,
    )
    const [offerId, setOfferId] = useState(
        !storedProviderId || storedOfferId !== -1 ? storedOfferId : customOfferData?.id,
    )

    useEffect(() => {
        if (!storedProviderId || storedProviderId === -1) onMount.current = true
        else if (!onMount.current && contractTypeId && currentHousing?.id) {
            loadProviders(contractTypeId, currentHousing?.id)
            providerId && providerId !== -1 && loadOffers(providerId, contractTypeId, currentHousing?.id)
            onMount.current = true
        }
    }, [loadProviders, loadOffers, currentHousing?.id, contractTypeId, storedProviderId, providerId])

    useEffect(() => {
        return () => setDefaultContractFormType()
    }, [setDefaultContractFormType])

    useEffect(() => {
        if (customProvderData) {
            setProviderId(customProvderData.id)
        }
    }, [customProvderData])

    useEffect(() => {
        if (customOfferData) {
            setOfferId(customOfferData.id)
        }
    }, [customOfferData])

    const tariffTypeId = customTariffTypeData?.id

    return (
        <>
            <div className="p-24">
                <TypographyFormatMessage className="text-16 font-medium md:text-20">
                    Contrat de fourniture
                </TypographyFormatMessage>
                <TypographyFormatMessage
                    className="text-13 font-medium md:text-16"
                    sx={{ color: primaryMainColor, marginBottom: '20px' }}
                >
                    Toutes les informations demandées sont disponibles sur votre facture ou votre contrat d'énergie
                </TypographyFormatMessage>
                <div className="flex flex-col justify-center w-full">
                    <ContractOtherField<ICreateCustomProvider, IProvider>
                        name="name"
                        label={
                            providerList?.find((provider) => provider.id === providerId)?.name
                                ? ''
                                : 'Votre fournisseur'
                        }
                        onButtonClick={
                            createCustomProvider as unknown as (data: ICreateCustomProvider) => Promise<IProvider>
                        }
                        isButtonLoading={isCreateCustomProviderLoading}
                        buttonLabel="Créer le fournisseur"
                        validateFunctions={[requiredBuilder()]}
                        value={providerList?.find((provider) => provider.id === providerId)?.name ?? undefined}
                        isOtherFieldSubmitted={providerId !== undefined}
                        disabled={providerId !== undefined}
                    />
                    {providerId && (
                        <ContractOtherField<ICreateCustomOffer, IOffer>
                            name="name"
                            label={offerList?.find((offer) => offer.id === offerId)?.name ? '' : 'Votre offre'}
                            onButtonClick={
                                createCustomOffer as unknown as (data: ICreateCustomOffer) => Promise<IOffer>
                            }
                            isButtonLoading={isCreateCustomOfferLoading}
                            buttonLabel="Créer l'offre"
                            validateFunctions={[requiredBuilder()]}
                            value={offerList?.find((offer) => offer.id === offerId)?.name ?? undefined}
                            isOtherFieldSubmitted={Boolean(offerId)}
                            onButtonClickParams={{
                                providerId: providerId,
                            }}
                            disabled={Boolean(offerId)}
                        />
                    )}
                    {offerId && (
                        <ContractSelectTariffTypes
                            label="Votre type de facturation"
                            onButtonClick={createCustomTariffType}
                            isButtonLoading={isCreateCustomTariffTypeLoading}
                            isOtherFieldSubmitted={isCustomTariffTypeCreated}
                            disabled={isCustomTariffTypeCreated}
                        />
                    )}
                    {isCustomTariffTypeCreated && (
                        <Form
                            style={{ marginTop: '20px' }}
                            onSubmit={async (data: any) => {
                                if (offerId && tariffTypeId && contractTypeId) {
                                    // Format the start subscription to ISO Datetime.
                                    let cleanData: addContractDataType = {
                                        offerId: offerId,
                                        tariffTypeId: tariffTypeId,
                                        contractTypeId: contractTypeId,
                                        power: data.power,
                                        startSubscription: dayjsUTC(data?.startSubscription).toISOString(),
                                        endSubscription: data?.endSubscription
                                            ? dayjsUTC(data?.endSubscription).toISOString()
                                            : undefined,
                                        monthlyPrice: data.monthlyPrice,
                                        basePrice: data?.basePrice,
                                        hpPrice: data?.hpPrice,
                                        hcPrice: data?.hcPrice,
                                        isContractCustom: true,
                                    }
                                    // Update meterFeatures if offPeakhours have been set.
                                    if (data.meterFeatures && !data.meterFeatures.offpeak.readOnly) {
                                        try {
                                            await editMeter(currentHousing!.id, { features: data.meterFeatures })
                                        } catch (error) {
                                            // Stop the execution of onSubmit when editMeter fails, and prevent the stop of the app with try/catch block.
                                            return
                                        }
                                    }
                                    onSubmit(cleanData)
                                } else {
                                    enqueueSnackbar(
                                        formatMessage({
                                            id: 'Veuillez remplir tous les champs obligatoires',
                                            defaultMessage: 'Veuillez remplir tous les champs obligatoires',
                                        }),
                                        { variant: 'error' },
                                    )
                                }
                            }}
                        >
                            <TypographyFormatMessage
                                className="text-13 font-medium md:text-16"
                                sx={{ color: primaryMainColor, marginBottom: '20px', marginTop: '20px' }}
                            >
                                Détails de mon contrat :
                            </TypographyFormatMessage>
                            <TextField
                                label="Puissance"
                                name="power"
                                variant="outlined"
                                type="number"
                                validateFunctions={[requiredBuilder()]}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">kVA</InputAdornment>,
                                }}
                            />
                            <DatePicker
                                name="startSubscription"
                                label={formatMessage({
                                    id: 'Date de début',
                                    defaultMessage: 'Date de début',
                                })}
                                validateFunctions={[requiredBuilder()]}
                            />
                            <DatePicker
                                name="endSubscription"
                                label={formatMessage({
                                    id: 'Date de Fin',
                                    defaultMessage: 'Date de Fin',
                                })}
                                className="mb-5"
                                validateFunctions={[requiredBuilder()]}
                            />
                            <TypographyFormatMessage
                                className="text-11 font-medium"
                                sx={{ color: 'primary.grey', marginBottom: '20px' }}
                            >
                                * Si votre abonnement n'a pas de date de fin, mettez une date lointaine.
                            </TypographyFormatMessage>
                            <TypographyFormatMessage
                                className="text-13 font-medium md:text-16"
                                sx={{ color: primaryMainColor, marginBottom: '20px', marginTop: '20px' }}
                            >
                                Ma mensualité :
                            </TypographyFormatMessage>
                            <TextField
                                label="Prix de l'abonnement (€)"
                                name="monthlyPrice"
                                className="mb-5"
                                variant="outlined"
                                type="number"
                                validateFunctions={[requiredBuilder()]}
                            />
                            <TypographyFormatMessage
                                className="text-11 font-medium"
                                sx={{ color: 'primary.grey', marginBottom: '20px' }}
                            >
                                * Si votre abonnement est annuelle, divisez ce dernier par 12 pour avoir votre
                                mensualité
                            </TypographyFormatMessage>
                            <TypographyFormatMessage
                                className="text-13 font-medium md:text-16"
                                sx={{ color: primaryMainColor, marginBottom: '20px', marginTop: '20px' }}
                            >
                                Mes tarifs au Kwh:
                            </TypographyFormatMessage>
                            {customTariffTypeData?.name !== BASE && (
                                <OffpeakHoursField
                                    name="meterFeatures"
                                    label="Plages heures creuses :"
                                    houseId={currentHousing!.id}
                                />
                            )}
                            {customTariffTypeData?.name === BASE ? (
                                <TextField
                                    label="Prix du kWh (€)"
                                    name="basePrice"
                                    variant="outlined"
                                    type="number"
                                    validateFunctions={[requiredBuilder()]}
                                    className="mt-20 mb-10"
                                />
                            ) : (
                                <>
                                    <TextField
                                        label="Prix kWh des heures pleines (€)"
                                        variant="outlined"
                                        type="number"
                                        name="hpPrice"
                                        className="mb-20 mt-20"
                                        validateFunctions={[requiredBuilder()]}
                                    />
                                    <TextField
                                        label="Prix kWh des heures creuses (€)"
                                        variant="outlined"
                                        name="hcPrice"
                                        type="number"
                                        validateFunctions={[requiredBuilder()]}
                                        className="mb-10"
                                    />
                                </>
                            )}
                            <ButtonLoader
                                variant="contained"
                                color="primary"
                                className="w-full mx-auto mt-20"
                                type="submit"
                                inProgress={isContractsLoading || loadingInProgress}
                            >
                                {formatMessage({
                                    id: 'Enregistrer',
                                    defaultMessage: 'Enregistrer',
                                })}
                            </ButtonLoader>
                        </Form>
                    )}
                </div>
            </div>
        </>
    )
}
