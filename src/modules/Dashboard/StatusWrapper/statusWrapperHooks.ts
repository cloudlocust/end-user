import { useCallback, useEffect, useRef, useState } from 'react'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { IPricePerKwhDataType } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlert'
import { useSnackbar } from 'notistack'
import { useIntl } from 'src/common/react-platform-translation'
import { axios } from 'src/common/react-platform-components'

/**
 * Instant price url.
 *
 * @param housingId The housing id of the Instant price.
 * @returns Instant price base url.
 */
export const INSTANT_PRICE_API = (housingId: number) => `${HOUSING_API}/${housingId}/instant-price-per-kwh`

/**
 * Default error message for price loading.
 */
export const DEFAULT_GET_PRICE_ERROR_MESSAGE =
    'Une erreur est survenue lors du chargement du prix par kwh de votre contrat.'

/**
 * Hooks for Instant price per kwh.
 *
 * @param housingId HousingId.
 * @param disabledOnMunt Disable auto loading when on mount hook.
 * @returns UseAccomodation.
 */
export function useInstantPricePerKwh(housingId: number | null, disabledOnMunt?: boolean) {
    const [instantPricePerKwh, setInstantPricePerKwh] = useState<number | null>(null)

    const { enqueueSnackbar } = useSnackbar()

    const [isInstantPricePerKwhLoadingInProgress, setIsInstantPricePerKwhLoadingInProgress] = useState(false)

    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)

    const NO_HOUSING_MESSAGE = 'Aucun logement.'

    /**
     * Function hook responsible for fetching price per kwh.
     *
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const loadInstantPricePerKwh = useCallback(async () => {
        setIsInstantPricePerKwhLoadingInProgress(true)
        if (housingId) {
            try {
                const { data: responseData } = await axios.get<IPricePerKwhDataType>(INSTANT_PRICE_API(housingId))
                setInstantPricePerKwh(responseData.pricePerKwh)
            } catch (error: any) {
                enqueueSnackbar(
                    formatMessage({
                        id: error.response?.data?.detail ?? DEFAULT_GET_PRICE_ERROR_MESSAGE,
                        defaultMessage: error.response?.data?.detail ?? DEFAULT_GET_PRICE_ERROR_MESSAGE,
                    }),
                    { variant: 'error' },
                )
            }
        } else {
            enqueueSnackbar(
                formatMessage({
                    id: NO_HOUSING_MESSAGE,
                    defaultMessage: NO_HOUSING_MESSAGE,
                }),
                { variant: 'error' },
            )
        }
        setIsInstantPricePerKwhLoadingInProgress(false)
    }, [enqueueSnackbar, formatMessage, housingId])

    // UseEffect executes on initial intantiation.
    useEffect(() => {
        /**
         * Load what we need when component mounts.
         */
        const loadEssentials = async () => {
            await loadInstantPricePerKwh()
        }
        if (isInitialMount.current && housingId && !disabledOnMunt) {
            isInitialMount.current = false
            loadEssentials()
        }
    }, [housingId, disabledOnMunt, loadInstantPricePerKwh])

    return {
        instantPricePerKwh,
        isInstantPricePerKwhLoadingInProgress,
        loadInstantPricePerKwh,
    }
}
