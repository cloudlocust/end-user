import { Card, Switch } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import { useToggle } from 'react-use'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { INovuAlertPreferences } from 'src/modules/Alerts/Alerts.d'
import { TempoAlertPreferencesType } from 'src/modules/Alerts/components/TempoAlerts/TempoAlerts'
import { ButtonLoader } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'

/**
 * Temppo Alerts Form.
 *
 * @param root0 N/A.
 * @param root0.houseId House id of current housing.
 * @param root0.novuAlertPreferences Novu alert preferences state data.
 * @param root0.updateTempoAlerts Callback function that update alerts.
 * @param root0.reloadAlerts Callback function that reloads alerts.
 * @returns TemplateAlertsForm JSX.
 */
export const TempoAlertsForm = ({
    houseId,
    novuAlertPreferences,
    updateTempoAlerts,
    reloadAlerts,
}: /**
 *
 */
{
    /**
     * House id of current housing.
     */
    houseId: number
    /**
     * Novu alerts state data.
     */
    novuAlertPreferences: INovuAlertPreferences
    /**
     * Callback function that update alerts.
     */
    updateTempoAlerts: (alerts: TempoAlertPreferencesType) => void
    /**
     * Refresh alerts callback.
     */
    reloadAlerts: (houseId: number) => void
}) => {
    const [isPushTempoAlert, setIsPushTempoAlert] = useToggle(novuAlertPreferences.isPushTempo!)
    const [isEmailTempoAlert, setIsEmailTempoAlert] = useToggle(novuAlertPreferences.isEmailTempo!)
    const { formatMessage } = useIntl()

    /**
     * Handle submit function for EcowaattAlerts.
     */
    const handleSubmitTempoAlerts = async () => {
        await updateTempoAlerts({
            isEmailTempo: isEmailTempoAlert,
            isPushTempo: isPushTempoAlert,
        })
        reloadAlerts(houseId)
    }

    return (
        <Form onSubmit={handleSubmitTempoAlerts}>
            <Card className="rounded-20 shadow m-6 p-12" variant="outlined">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <TypographyFormatMessage fontWeight={500} sx={{ flexBasis: '65%', pr: 2 }}>
                            Les alertes tempo jour blanc ou rouge
                        </TypographyFormatMessage>
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-evenly items-center" style={{ flexBasis: '35%' }}>
                                <div className="flex flex-row justify-evenly items-center w-full">
                                    <span>Push</span>
                                    <Switch
                                        name="isPushTempo"
                                        checked={isPushTempoAlert}
                                        onChange={() => setIsPushTempoAlert(!isPushTempoAlert)}
                                        data-testid="isPushTempoAlert-switch"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-evenly items-center" style={{ flexBasis: '35%' }}>
                                <div className="flex flex-row justify-evenly items-center w-full">
                                    <span>Mail</span>
                                    <Switch
                                        name="isMailTempo"
                                        checked={isEmailTempoAlert}
                                        onChange={() => setIsEmailTempoAlert(!isEmailTempoAlert)}
                                        data-testid="isMailTempoAlert-switch"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="flex justify-center mt-16">
                <ButtonLoader variant="contained" onClick={handleSubmitTempoAlerts}>
                    {formatMessage({
                        id: 'Enregistrer',
                        defaultMessage: 'Enregistrer',
                    })}
                </ButtonLoader>
            </div>
        </Form>
    )
}
