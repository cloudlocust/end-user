import { requiredBuilder } from 'src/common/react-platform-components'
import {
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
import { ContractSelectTariffTypes } from 'src/modules/Contracts/components/ContractSelectTariffTypes'
import { CustomContractFormProps } from 'src/modules/Contracts/components/CustomContractForm/CustomContractForm.types'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useContractStore } from 'src/modules/Contracts/store/contractStore'
import TextField from '@mui/material/TextField'
import { useEffect, useRef } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader } from 'src/common/ui-kit'

/**
 * Custom contract form.
 *
 * @param root0 N/A.
 * @param root0.onSubmit On submit handler.
 * @returns Custom contract form.
 */
export default function CustonContractForm({ onSubmit }: CustomContractFormProps) {
    const { formatMessage } = useIntl()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const contractTypeId = useContractStore((state) => state.formData)?.contractTypeId
    const setDefaultContractFormType = useContractStore((state) => state.setDefaultContractFormType)
    const powerRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        return () => setDefaultContractFormType()
    }, [setDefaultContractFormType])

    const { createCustomProvider, isCreateCustomProviderLoading, isCustomProviderCreated, customProvderData } =
        useCreateCustomProvider()
    const { createCustomOffer, isCreateCustomOfferLoading, isCustomOfferCreated, customOfferData } =
        useCreateCustomOffer()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createCustomTariffType, isCreateCustomTariffTypeLoading, isCustomTariffTypeCreated, customTariffTypeData } =
        useCreateCustomTariffType()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const offerId = customOfferData?.id

    return (
        <>
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
                    <ContractOtherField<ICreateCustomProvider, IProvider>
                        name="name"
                        label="Votre fournisseur"
                        onButtonClick={
                            createCustomProvider as unknown as (data: ICreateCustomProvider) => Promise<IProvider>
                        }
                        isButtonLoading={isCreateCustomProviderLoading}
                        buttonLabel="Créer le fournisseur"
                        validateFunctions={[requiredBuilder()]}
                        isOtherFieldSubmitted={isCustomProviderCreated}
                    />
                    {isCustomProviderCreated && (
                        <ContractOtherField<ICreateCustomOffer, IOffer>
                            name="name"
                            label="Votre offre"
                            onButtonClick={
                                createCustomOffer as unknown as (data: ICreateCustomOffer) => Promise<IOffer>
                            }
                            isButtonLoading={isCreateCustomOfferLoading}
                            buttonLabel="Créer l'offre"
                            validateFunctions={[requiredBuilder()]}
                            isOtherFieldSubmitted={isCustomOfferCreated}
                            onButtonClickParams={{
                                providerId: customProvderData?.id,
                            }}
                        />
                    )}
                    {isCustomOfferCreated && (
                        <ContractSelectTariffTypes
                            label="Votre type de facturation"
                            onButtonClick={createCustomTariffType}
                            isButtonLoading={isCreateCustomTariffTypeLoading}
                            isOtherFieldSubmitted={isCustomTariffTypeCreated}
                        />
                    )}
                    {isCustomTariffTypeCreated && (
                        <>
                            <TextField
                                label="Puissance"
                                variant="outlined"
                                inputRef={powerRef}
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
                            <ButtonLoader
                                variant="contained"
                                color="primary"
                                className="w-full mx-auto mt-20"
                                type="submit"
                                // inProgress={isContractsLoading}
                            >
                                {formatMessage({
                                    id: 'Enregistrer',
                                    defaultMessage: 'Enregistrer',
                                })}
                            </ButtonLoader>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
