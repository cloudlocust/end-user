import { useCallback, useEffect, useRef, useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'
import { INovuAlertPreferences } from 'src/modules/Layout/Toolbar/components/Alerts/Alerts'

/**
 * Function that returns endpoint for novu alert prefenrences with housing id.
 *
 * @param houseId House id of the current housing.
 * @returns Endpoint.
 */
export const NOVU_ALERT_PREFERENCES_ENDPOINT = (houseId: number) =>
    `${API_RESOURCES_URL}/housings/${houseId}/novu-alert-preferences`

/**.
 * UseNovuAlertPreferences hook.
 *
 * @param housingId HousingId.
 * @param disabledOnMunt Disable auto loading when on mount hook.
 * @returns useNovuAlertPreferences.
 */
export function useNovuAlertPreferences(housingId: number | null, disabledOnMunt?: boolean) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const [novuAlertPreferences, setNovuAlertPreferences] = useState<INovuAlertPreferences | null>(null)
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)

    const getNovuAlertPreferences = useCallback(async () => {
        try {
            if (!housingId) throw Error('No housing id privided')
            setIsLoadingInProgress(true)
            const { data: responseData } = await axios.get<Required<INovuAlertPreferences>>(
                NOVU_ALERT_PREFERENCES_ENDPOINT(housingId),
            )
            if (responseData) {
                setNovuAlertPreferences(responseData)
            }
            setIsLoadingInProgress(false)
        } catch (error) {
            setIsLoadingInProgress(false)
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la récupération des alertes',
                    defaultMessage: 'Erreur lors de la récupération des alertes',
                }),
                { variant: 'error', autoHideDuration: 5000 },
            )
        }
    }, [enqueueSnackbar, formatMessage, housingId])

    const updateNovuAlertPreferences = useCallback(
        async (alerts: INovuAlertPreferences) => {
            // we added return values that corresponde to weither the update have been successful or not
            try {
                if (!housingId) throw Error('No housing id privided')
                setIsLoadingInProgress(true)
                await axios.post<Required<INovuAlertPreferences>>(NOVU_ALERT_PREFERENCES_ENDPOINT(housingId), alerts)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Les alertes ont été modifiés avec succès',
                        defaultMessage: 'Les alertes ont été modifiés avec succès',
                    }),
                    { variant: 'success', autoHideDuration: 5000 },
                )
                setIsLoadingInProgress(false)
                return true
            } catch (error) {
                setIsLoadingInProgress(false)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la modification des alertes',
                        defaultMessage: 'Erreur lors de la modification des alertes',
                    }),
                    { variant: 'error', autoHideDuration: 5000 },
                )

                return false
            }
        },
        [enqueueSnackbar, formatMessage, housingId],
    )

    // UseEffect executes on initial intantiation of consumption alert.
    useEffect(() => {
        if (isInitialMount.current && housingId && !disabledOnMunt) {
            isInitialMount.current = false
            getNovuAlertPreferences()
        }
    }, [housingId, disabledOnMunt, getNovuAlertPreferences])

    return {
        isLoadingInProgress,
        novuAlertPreferences,
        getNovuAlertPreferences,
        updateNovuAlertPreferences,
    }
}
