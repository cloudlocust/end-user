import { useTheme, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcowattTooltip } from 'src/modules/Ecowatt/components/EcowattTooltip/'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { EcowattAlertsForm } from 'src/modules/Alerts/components/EcowattAlerts/EcowattAlertsForm'
import { useNovuAlertPreferences } from 'src/modules/Alerts/NovuAlertPreferencesHook'

/**
 * Ecowatt Alerts component.
 *
 * @returns EcowattAlerts JSX.
 */
export const EcowattAlerts = () => {
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { isLoadingInProgress, getNovuAlertPreferences, novuAlertPreferences, updateNovuAlertPreferences } =
        useNovuAlertPreferences(currentHousing?.id ?? null)
    const [openTooltip, setOpenTooltip] = useState<boolean>(false)

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
                    EcoWatt :
                </TypographyFormatMessage>
                <EcowattTooltip
                    openState={openTooltip}
                    onOpen={() => setOpenTooltip(true)}
                    onClose={() => setOpenTooltip(false)}
                />
            </div>
            <TypographyFormatMessage className="text-13 md:text-16 font-medium flex items-center">
                La météo de l'électricité
            </TypographyFormatMessage>

            {currentHousing?.id && novuAlertPreferences && (
                <EcowattAlertsForm
                    houseId={currentHousing?.id}
                    novuAlertPreferences={novuAlertPreferences}
                    updateEcowattAlerts={updateNovuAlertPreferences}
                    reloadAlerts={getNovuAlertPreferences}
                />
            )}
        </div>
    )
}
