import { useCallback, useEffect, useRef, useState } from 'react'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import {
    ConsumptionAlertData,
    ConsumptionAlertIntervalsType,
    IConsumptionAlert,
    IPricePerKwhDataType,
} from './consumptionAlert'
import { useSnackbar } from 'notistack'
import { useIntl } from 'src/common/react-platform-translation'
import { axios } from 'src/common/react-platform-components'

/**
 * Consumption alert url.
 *
 * @param housingId The housing id of the consumption alert.
 * @returns Consumption alerte base url.
 */
export const CONSUMPTION_ALERT_API = (housingId: number) => `${HOUSING_API}/${housingId}/consumption-alerts`

/**
 * Hooks for Consumption alerts.
 *
 * @param housingId HousingId.
 * @param disabledOnMunt Disable auto loading when on mount hook.
 * @returns UseAccomodation.
 */
export function useConsumptionAlerts(housingId: number | null, disabledOnMunt?: boolean) {
    const [consumptionAlerts, setConsumptionAlerts] = useState<ConsumptionAlertData[]>([])
    const { enqueueSnackbar } = useSnackbar()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)

    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const [isConsumptionAlertsListEmpty, setIsConsumptionAlertsListEmpty] = useState(true)

    const NO_HOUSING_MESSAGE = 'Aucun logement.'
    const DEFAULT_GET_ALERTS_ERROR_MESSAGE = 'Une erreur est survenue lors du chargement des alerts.'
    const DEFAULT_ASSERTION_ERROR_MESSAGE = "Une erreur est survenue lors de l'insertion des alerts."

    /**
     * Function hook responsible for fetching Consumption Alerts.
     *
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const getPricePerKwh = useCallback(async () => {
        setIsLoadingInProgress(true)
        if (housingId) {
            try {
                const { data: responseData } = await axios.get<IPricePerKwhDataType>(
                    `${CONSUMPTION_ALERT_API(housingId)}/price-per-kwh`,
                )
                setIsLoadingInProgress(false)
                return responseData.pricePerKwh
            } catch (error: any) {
                enqueueSnackbar(
                    formatMessage({
                        id: error.response?.data?.detail ?? DEFAULT_GET_ALERTS_ERROR_MESSAGE,
                        defaultMessage: error.response?.data?.detail ?? DEFAULT_GET_ALERTS_ERROR_MESSAGE,
                    }),
                    { variant: 'error' },
                )
                setIsLoadingInProgress(false)
            }
        } else {
            enqueueSnackbar(
                formatMessage({
                    id: NO_HOUSING_MESSAGE,
                    defaultMessage: NO_HOUSING_MESSAGE,
                }),
                { variant: 'error' },
            )
            setIsLoadingInProgress(false)
        }
    }, [enqueueSnackbar, formatMessage, housingId])

    /**
     * Function hook responsible for fetching Consumption Alerts.
     *
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const loadConsumptionAlerts = useCallback(async () => {
        setIsLoadingInProgress(true)
        setIsConsumptionAlertsListEmpty(false)
        if (housingId) {
            try {
                const { data: responseData } = await axios.get<IConsumptionAlert[]>(CONSUMPTION_ALERT_API(housingId))
                setConsumptionAlerts(responseData)
            } catch (error: any) {
                enqueueSnackbar(
                    formatMessage({
                        id: error.response?.data?.detail ?? DEFAULT_GET_ALERTS_ERROR_MESSAGE,
                        defaultMessage: error.response?.data?.detail ?? DEFAULT_GET_ALERTS_ERROR_MESSAGE,
                    }),
                    { variant: 'error' },
                )

                setIsConsumptionAlertsListEmpty(true)
                setIsLoadingInProgress(false)
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
        setIsLoadingInProgress(false)
    }, [enqueueSnackbar, formatMessage, housingId])

    /**
     * Add consumption alert if it does not exist, else it will update the current.
     *
     * @param body Consumption Alert data.
     * @param interval Interval of the consumption alert.
     */
    const saveConsumptionAlert = async (body: ConsumptionAlertData, interval: ConsumptionAlertIntervalsType) => {
        setIsLoadingInProgress(true)
        if (housingId) {
            try {
                await axios.post<ConsumptionAlertData>(`${CONSUMPTION_ALERT_API(housingId)}/${interval}`, body)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Vos modifications ont été sauvegardées',
                        defaultMessage: 'Vos modifications ont été sauvegardées',
                    }),
                    { variant: 'success' },
                )
            } catch (error: any) {
                enqueueSnackbar(
                    formatMessage({
                        id: error.response?.data?.detail ?? DEFAULT_ASSERTION_ERROR_MESSAGE,
                        defaultMessage: error.response?.data?.detail ?? DEFAULT_ASSERTION_ERROR_MESSAGE,
                    }),
                    { variant: 'error' },
                )
                setIsLoadingInProgress(false)
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

        setIsLoadingInProgress(false)
    }

    // UseEffect executes on initial intantiation of consumption alert.
    useEffect(() => {
        if (isInitialMount.current && housingId && !disabledOnMunt) {
            isInitialMount.current = false
            loadConsumptionAlerts()
        }
    }, [loadConsumptionAlerts, housingId, disabledOnMunt])

    return {
        isLoadingInProgress,
        consumptionAlerts,
        loadConsumptionAlerts,
        getPricePerKwh,
        saveConsumptionAlert,
        isConsumptionAlertsListEmpty,
    }
}
