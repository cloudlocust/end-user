import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useTheme, CircularProgress } from '@mui/material'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { useNovuAlertPreferences } from 'src/modules/Layout/Toolbar/components/Alerts/NovuAlertPreferencesHook'
import { useEffect } from 'react'
import { TempoAlertsForm } from 'src/modules/Layout/Toolbar/components/Alerts/TempoAlerts/TempoAlertsForm'

/**
 *  Tempo Alerts component.
 *
 * @returns Tempo alerts JSX.
 */
export const TempoAlerts = () => {
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { isLoadingInProgress, getNovuAlertPreferences, novuAlertPreferences, updateNovuAlertPreferences } =
        useNovuAlertPreferences(currentHousing?.id ?? null)

    useEffect(() => {
        if (currentHousing?.id) {
            getNovuAlertPreferences()
        }
    }, [currentHousing?.id, getNovuAlertPreferences])

    if (isLoadingInProgress) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-192">
                <CircularProgress style={{ color: theme.palette.primary.main }} />
            </div>
        )
    }

    return (
        <div className="flex-col my-48">
            <div className="flex flex-row items-center">
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    className="text-16 md:text-20 font-medium flex items-center"
                >
                    Tempo :
                </TypographyFormatMessage>
            </div>
            {currentHousing?.id && novuAlertPreferences && (
                <TempoAlertsForm
                    houseId={currentHousing.id}
                    novuAlertPreferences={novuAlertPreferences}
                    updateTempoAlerts={updateNovuAlertPreferences}
                    reloadAlerts={getNovuAlertPreferences}
                />
            )}
        </div>
    )
}
