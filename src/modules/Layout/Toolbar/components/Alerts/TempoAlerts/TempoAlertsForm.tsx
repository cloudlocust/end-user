import { Card, Switch, Button } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import { useToggle } from 'react-use'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { INovuAlertPreferences } from 'src/modules/Layout/Toolbar/components/Alerts/Alerts'
import { TempoAlertPreferencesType } from 'src/modules/Layout/Toolbar/components/Alerts/TempoAlerts/TempoAlerts'
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
    const [isEdit, setIsEdit] = useToggle(false)
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

    /**
     * Handle reset form to initial values.
     */
    const onFormReset = () => {
        setIsPushTempoAlert(novuAlertPreferences.isPushTempo!)
        setIsEmailTempoAlert(novuAlertPreferences.isEmailTempo!)
        setIsEdit(false)
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
                                        disabled={!isEdit}
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
                                        disabled={!isEdit}
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
            {isEdit ? (
                <div className="flex justify-center mt-16">
                    <Button variant="outlined" onClick={onFormReset} className="mr-12" disabled={!isEdit}>
                        {formatMessage({
                            id: 'Annuler',
                            defaultMessage: 'Annuler',
                        })}
                    </Button>
                    <ButtonLoader variant="contained" disabled={!isEdit} onClick={handleSubmitTempoAlerts}>
                        {formatMessage({
                            id: 'Enregistrer',
                            defaultMessage: 'Enregistrer',
                        })}
                    </ButtonLoader>
                </div>
            ) : (
                <div className="flex justify-center mt-16">
                    <Button variant="contained" onClick={() => setIsEdit(true)}>
                        {formatMessage({
                            id: 'Modifier',
                            defaultMessage: 'Modifier',
                        })}
                    </Button>
                </div>
            )}
        </Form>
    )
}
