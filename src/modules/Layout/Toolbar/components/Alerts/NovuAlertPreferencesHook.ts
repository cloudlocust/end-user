import { useCallback, useState } from 'react'
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
 * @returns useNovuAlertPreferences.
 */
export function useNovuAlertPreferences() {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [novuAlertPreferences, setNovuAlertPreferences] = useState<INovuAlertPreferences | null>(null)
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)

    const getNovuAlertPreferences = useCallback(
        async (houseId: number) => {
            try {
                if (!houseId) throw Error('No housing id privided')
                setIsLoadingInProgress(true)
                const { data: responseData } = await axios.get<INovuAlertPreferences>(
                    NOVU_ALERT_PREFERENCES_ENDPOINT(houseId),
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
        },
        [enqueueSnackbar, formatMessage],
    )

    const updateNovuAlertPreferences = useCallback(
        async (houseId: number, alerts: INovuAlertPreferences) => {
            try {
                if (!houseId) throw Error('No housing id privided')
                setIsLoadingInProgress(true)
                await axios.post<INovuAlertPreferences>(NOVU_ALERT_PREFERENCES_ENDPOINT(houseId), alerts)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Les alertes ont été modifiés avec succès',
                        defaultMessage: 'Les alertes ont été modifiés avec succès',
                    }),
                    { variant: 'success', autoHideDuration: 5000 },
                )
                setIsLoadingInProgress(false)
            } catch (error) {
                setIsLoadingInProgress(false)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la modification des alertes',
                        defaultMessage: 'Erreur lors de la modification des alertes',
                    }),
                    { variant: 'error', autoHideDuration: 5000 },
                )
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    return {
        isLoadingInProgress,
        novuAlertPreferences,
        getNovuAlertPreferences,
        updateNovuAlertPreferences,
    }
}
