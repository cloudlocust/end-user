import { Card, Switch, Button } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IEcowattAlerts } from 'src/modules/Ecowatt/ecowatt'
import { useToggle } from 'react-use'
import { ButtonLoader } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'

/**
 * Ecowatt Alerts Form.
 *
 * @param root0 N/A.
 * @param root0.houseId House id of current housing.
 * @param root0.ecowattAlerts Ecowatt alerts state data.
 * @param root0.updateEcowattAlert Callback function that update alerts.
 * @param root0.reloadAlerts Callback to reload alerts.
 * @returns Ecowatt alerts form JSX.
 */
export const EcowattAlertsForm = ({
    houseId,
    ecowattAlerts,
    updateEcowattAlert,
    reloadAlerts,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    /**
     * House id of current housing.
     */
    houseId: number
    /**
     * Ecowatt alerts state data.
     */
    ecowattAlerts: IEcowattAlerts
    /**
     * Callback function that update alerts.
     */
    updateEcowattAlert: (houseId: number, alerts: IEcowattAlerts) => void
    /**
     * Loading state.
     */
    reloadAlerts: (houseId: number) => void
}) => {
    const [isPushSignalThreeDaysState, setIsPushSignalThreeDaysState] = useToggle(ecowattAlerts.isPushSignalThreeDays!)
    const [isPushSignalOneDayState, setIsPushSignalOneDayState] = useToggle(ecowattAlerts.isPushSignalOneDay!)
    const [isEdit, setIsEdit] = useToggle(false)
    const { formatMessage } = useIntl()

    /**
     * Handle submit function for EcowaattAlerts.
     */
    const handleSubmitEcowattAlerts = async () => {
        await updateEcowattAlert(houseId, {
            isPushSignalThreeDays: isPushSignalThreeDaysState,
            isPushSignalOneDay: isPushSignalOneDayState,
        })
        reloadAlerts(houseId)
    }

    /**
     * Handle reset form to initial values.
     */
    const onFormReset = () => {
        setIsPushSignalThreeDaysState(ecowattAlerts.isPushSignalThreeDays!)
        setIsPushSignalOneDayState(ecowattAlerts.isPushSignalOneDay!)
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
                    <ButtonLoader type="submit" variant="contained" disabled={!isEdit}>
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
