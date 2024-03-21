import { useState, useCallback } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { API_RESOURCES_URL } from 'src/configs'
import { IContractType, IProvider, ITariffType, IPower, IOffer } from './CommercialOffers.d'
import { tariffContract } from 'src/modules/Contracts/contractsTypes'
import { isValidDate } from 'src/modules/Contracts/utils/contractsFunctions'

/**
 * Contract Type API.
 */
export const CONTRACT_TYPE_LIST_API = `${API_RESOURCES_URL}/contract_types`
/**
 * Providers API.
 */
export const PROVIDERS_API = `${API_RESOURCES_URL}/providers`
/**
 * Offers API.
 */
export const OFFERS_API = `${API_RESOURCES_URL}/offers`
/**
 * Tariff Types API.
 */
export const TARIFF_TYPES_API = `${API_RESOURCES_URL}/tariff_types`
/**
 * Powers API.
 */
export const POWERS_API = `${API_RESOURCES_URL}/powers`
/**
 * Tariffs Contract API.
 */
export const TARIFFS_CONTRACT_API = `${API_RESOURCES_URL}/tariffs_contracts`

/**
`* Hooks for commercialOffer different fetch requests (Providers, TariffType, Power, contractType).
 *
 * @returns Hook useCommercialOffer.
 */
export const useCommercialOffer = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isContractTypesLoading, setIsContractTypesLoading] = useState(false)
    const [isProvidersLoading, setIsProvidersLoading] = useState(false)
    const [isOffersLoading, setIsOffersLoading] = useState(false)
    const [isTariffTypesLoading, setIsTariffTypesLoading] = useState(false)
    const [isPowersLoading, setIsPowersLoading] = useState(false)
    const [isTariffsLoading, setIsTariffsLoading] = useState(false)
    const [providerList, setProviderList] = useState<IProvider[] | null>(null)
    const [offerList, setOfferList] = useState<IOffer[] | null>(null)
    const [contractTypeList, setContractTypeList] = useState<IContractType[] | null>(null)
    const [tariffTypeList, setTariffTypeList] = useState<ITariffType[] | null>(null)
    const [powerList, setPowerList] = useState<IPower[] | null>(null)
    const [tariffs, setTariffs] = useState<tariffContract[] | null>(null)

    /**
     * Fetching Contract Types function.
     */
    const loadContractTypes = useCallback(async () => {
        setIsContractTypesLoading(true)
        try {
            const { data: responseData } = await axios.get<IContractType[]>(CONTRACT_TYPE_LIST_API)
            setContractTypeList(responseData)
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors du chargement des types de contrat',
                    defaultMessage: 'Erreur lors du chargement des types de contrat',
                }),
                { variant: 'error' },
            )
        }
        setIsContractTypesLoading(false)
    }, [formatMessage, enqueueSnackbar])

    /**
     * Fetching Providers function.
     */
    const loadProviders = useCallback(
        async (contractTypeId: IContractType['id']) => {
            setIsProvidersLoading(true)
            try {
                const { data: responseData } = await axios.get<IProvider[]>(
                    `${PROVIDERS_API}?contract_type_id=${contractTypeId}`,
                )
                setProviderList(responseData)
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors du chargement des fournisseurs',
                        defaultMessage: 'Erreur lors du chargement des fournisseurs',
                    }),
                    { variant: 'error' },
                )
            }
            setIsProvidersLoading(false)
        },
        [formatMessage, enqueueSnackbar],
    )

    /**
     * Fetching Offers function.
     */
    const loadOffers = useCallback(
        async (providerId: IProvider['id'], contractTypeId: IContractType['id']) => {
            setIsOffersLoading(true)
            try {
                const { data: responseData } = await axios.get<ITariffType[]>(
                    `${OFFERS_API}?provider_id=${providerId}&contract_type_id=${contractTypeId}`,
                )
                setOfferList(responseData)
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors du chargement des offres',
                        defaultMessage: 'Erreur lors du chargement des offres',
                    }),
                    { variant: 'error' },
                )
            }
            setIsOffersLoading(false)
        },
        [formatMessage, enqueueSnackbar],
    )

    /**
     * Fetching Tariff Types function.
     */
    const loadTariffTypes = useCallback(
        async (offerId: IOffer['id']) => {
            setIsTariffTypesLoading(true)
            try {
                const { data: responseData } = await axios.get<ITariffType[]>(`${TARIFF_TYPES_API}?offer_id=${offerId}`)
                setTariffTypeList(responseData)
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors du chargement des types de tariff',
                        defaultMessage: 'Erreur lors du chargement des types de tariff',
                    }),
                    { variant: 'error' },
                )
            }
            setIsTariffTypesLoading(false)
        },
        [formatMessage, enqueueSnackbar],
    )

    /**
     * Fetching Powers function.
     */
    const loadPowers = useCallback(
        async (offerId: IOffer['id'], tariffTypeId: ITariffType['id']) => {
            setIsPowersLoading(true)
            try {
                const { data: responseData } = await axios.get<IPower[]>(
                    `${POWERS_API}?offer_id=${offerId}&tariff_type_id=${tariffTypeId}`,
                )
                setPowerList(responseData)
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors du chargement des puissances de contrat',
                        defaultMessage: 'Erreur lors du chargement des puissances de contrat',
                    }),
                    { variant: 'error' },
                )
            }
            setIsPowersLoading(false)
        },
        [formatMessage, enqueueSnackbar],
    )

    /**
     * Fetching tariffs function.
     */
    const loadTariffsHousingContract = useCallback(
        async (
            offerId: IOffer['id'],
            tariffTypeId: ITariffType['id'],
            contractTypeId: IContractType['id'],
            power: number,
            startSubscription: string,
            endSubscription?: string,
        ) => {
            const startSubscriptionDate = new Date(startSubscription!).toISOString()
            const endSubscriptionDate = isValidDate(endSubscription) ? new Date(endSubscription!).toISOString() : ''

            setIsTariffsLoading(true)
            try {
                let endpoint = `${TARIFFS_CONTRACT_API}?offer_id=${offerId}&tariff_type_id=${tariffTypeId}&contract_type_id=${contractTypeId}&power=${power}&start_subscription=${startSubscriptionDate}`
                if (endSubscriptionDate) {
                    endpoint += `&end_subscription=${endSubscriptionDate}`
                }
                const { data: responseData } = await axios.get<tariffContract[]>(endpoint)
                setTariffs(responseData)
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors du chargement des tariffs du contrat',
                        defaultMessage: 'Erreur lors du chargement des tariffs du contrat',
                    }),
                    { variant: 'error' },
                )
            }
            setIsTariffsLoading(false)
        },
        [enqueueSnackbar, formatMessage],
    )

    return {
        isProvidersLoading,
        isContractTypesLoading,
        isTariffTypesLoading,
        isOffersLoading,
        isPowersLoading,
        isTariffsLoading,
        loadContractTypes,
        contractTypeList,
        loadProviders,
        providerList,
        loadOffers,
        offerList,
        loadTariffTypes,
        tariffTypeList,
        loadPowers,
        powerList,
        loadTariffsHousingContract,
        setTariffs,
        tariffs,
    }
}
