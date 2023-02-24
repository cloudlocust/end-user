import { Card, Switch, Button } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcowattAlertsNovuPreferencesType } from 'src/modules/Ecowatt/ecowatt'
import { useToggle } from 'react-use'
import { ButtonLoader } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { INovuAlertPreferences } from 'src/modules/Layout/Toolbar/components/Alerts/Alerts'

/**
 * Ecowatt Alerts Form.
 *
 * @param root0 N/A.
 * @param root0.houseId House id of current housing.
 * @param root0.novuAlertPreferences Novu alert preferences state data.
 * @param root0.updateEcowattAlerts Callback function that update alerts.
 * @param root0.reloadAlerts Callback function that reloads alerts.
 * @returns Ecowatt alerts form JSX.
 */
export const EcowattAlertsForm = ({
    houseId,
    novuAlertPreferences,
    updateEcowattAlerts,
    reloadAlerts,
}: /**
 */
{
    /**
     * House id of current housing.
     */
    houseId: number
    /**
     * Ecowatt alerts state data.
     */
    novuAlertPreferences: INovuAlertPreferences
    /**
     * Callback function that update alerts.
     */
    updateEcowattAlerts: (alerts: EcowattAlertsNovuPreferencesType) => void
    /**
     * Refresh callback.
     */
    reloadAlerts: (houseId: number) => void
}) => {
    const [isPushSignalThreeDaysState, setIsPushSignalThreeDaysState] = useToggle(
        novuAlertPreferences.isPushSignalThreeDays!,
    )
    const [isPushSignalOneDayState, setIsPushSignalOneDayState] = useToggle(novuAlertPreferences.isPushSignalOneDay!)
    const [isEdit, setIsEdit] = useToggle(false)
    const { formatMessage } = useIntl()

    /**
     * Handle submit function for EcowaattAlerts.
     */
    const handleSubmitEcowattAlerts = async () => {
        await updateEcowattAlerts({
            isPushSignalThreeDays: isPushSignalThreeDaysState,
            isPushSignalOneDay: isPushSignalOneDayState,
        })
        reloadAlerts(houseId)
    }

    /**
     * Handle reset form to initial values.
     */
    const onFormReset = () => {
        setIsPushSignalThreeDaysState(novuAlertPreferences.isPushSignalThreeDays!)
        setIsPushSignalOneDayState(novuAlertPreferences.isPushSignalOneDay!)
        setIsEdit(false)
    }

    return (
        <Form onSubmit={handleSubmitEcowattAlerts}>
            <Card className="rounded-20 shadow m-6 p-12" variant="outlined">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <TypographyFormatMessage fontWeight={500} sx={{ flexBasis: '65%', pr: 2 }}>
                            Signal orange ou rouge prévu dans les 2 prochains jours
                        </TypographyFormatMessage>
                        <div className="flex flex-col justify-evenly items-center" style={{ flexBasis: '35%' }}>
                            <div className="flex flex-row justify-evenly items-center w-full">
                                <span>Push</span>
                                <Switch
                                    disabled={!isEdit}
                                    name="isPushSignalThreeDays"
                                    checked={isPushSignalThreeDaysState}
                                    onChange={(e) => setIsPushSignalThreeDaysState(!isPushSignalThreeDaysState)}
                                    data-testid="isPushSignalThreeDays-switch"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="rounded-20 shadow m-6 p-12" variant="outlined">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <TypographyFormatMessage fontWeight={500} sx={{ flexBasis: '65%', pr: 2 }}>
                            A l'approche d'un créneau orange ou rouge dans la journée
                        </TypographyFormatMessage>
                        <div className="flex flex-col justify-evenly items-center" style={{ flexBasis: '35%' }}>
                            <div className="flex flex-row justify-evenly items-center w-full">
                                <span>Push</span>
                                <Switch
                                    disabled={!isEdit}
                                    name="isPushSignalOneDay"
                                    checked={isPushSignalOneDayState}
                                    onChange={(e) => setIsPushSignalOneDayState(!isPushSignalOneDayState)}
                                    data-testid="isPushSignalOneDay-switch"
                                />
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
                    <ButtonLoader variant="contained" disabled={!isEdit} onClick={handleSubmitEcowattAlerts}>
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
