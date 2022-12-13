import { useCallback, useEffect, useRef, useState } from 'react'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { ConsumptionAlertData, ConsumptionAlertIntervalsType, IConsumptionAlert } from './consumptionAlert'
import { useSnackbar } from 'notistack'
import { useIntl } from 'src/common/react-platform-translation'
import { axios } from 'src/common/react-platform-components'
import { getMsgFromAxiosError } from 'src/modules/utils'

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
 * @returns UseAccomodation.
 */
export function useConsumptionAlerts(housingId: number | null) {
    const [consumptionAlerts, setConsumptionAlerts] = useState<ConsumptionAlertData[]>([])
    const { enqueueSnackbar } = useSnackbar()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)

    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const [isConsumptionAlertsListEmpty, setIsConsumptionAlertsListEmpty] = useState(false)

    const NO_HOUSING_MESSAGE = 'Aucun logement.'
    const DEFAULT_GET_ALERTS_ERROR_MESSAGE = 'Une erreur est survenue lors du chargement des alerts.'

    /**
     * Function hook responsible for fetching Consumption Alerts.
     *
     * @param housingId Represent the housingId of the consumption alert to be fetched.
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const loadConsumptionAlerts = useCallback(async () => {
        setIsLoadingInProgress(true)
        setIsConsumptionAlertsListEmpty(false)
        try {
            if (housingId) {
                const { data: responseData } = await axios.get<IConsumptionAlert[]>(CONSUMPTION_ALERT_API(housingId))
                setConsumptionAlerts(responseData)
                setIsLoadingInProgress(false)
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setIsConsumptionAlertsListEmpty(true)
                setIsLoadingInProgress(false)
                return
            }

            enqueueSnackbar(
                formatMessage({
                    id: error.response.data.detail ?? DEFAULT_GET_ALERTS_ERROR_MESSAGE,
                    defaultMessage: error.response.data.detail ?? DEFAULT_GET_ALERTS_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )
            setIsLoadingInProgress(false)
        }
    }, [enqueueSnackbar, formatMessage, housingId])

    /**
     * Add consumption alert if it does not exist, else it will update the current.
     *
     * @param body Consumption Alert data.
     * @param interval Interval of the consumption alert.
     */
    const saveConsumptionAlert = async (body: ConsumptionAlertData, interval: ConsumptionAlertIntervalsType) => {
        setIsLoadingInProgress(true)
        try {
            if (housingId) {
                await axios.post<ConsumptionAlertData>(`${CONSUMPTION_ALERT_API(housingId)}/${interval}`, body)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Vos modifications ont été sauvegardées',
                        defaultMessage: 'Vos modifications ont été sauvegardées',
                    }),
                    { variant: 'success' },
                )
                setIsLoadingInProgress(false)
            } else {
                enqueueSnackbar(
                    formatMessage({
                        id: NO_HOUSING_MESSAGE,
                        defaultMessage: NO_HOUSING_MESSAGE,
                    }),
                    { variant: 'error' },
                )
            }
        } catch (error) {
            const message = getMsgFromAxiosError(error)
            enqueueSnackbar(message, { variant: 'error' })
            setIsLoadingInProgress(false)
            throw message
        }
    }

    // UseEffect executes on initial intantiation of consumption alert.
    useEffect(() => {
        if (isInitialMount.current && housingId) {
            isInitialMount.current = false
            loadConsumptionAlerts()
        }
    }, [loadConsumptionAlerts, housingId])

    return {
        isLoadingInProgress,
        consumptionAlerts,
        loadConsumptionAlerts,
        saveConsumptionAlert,
        isConsumptionAlertsListEmpty,
    }
}
