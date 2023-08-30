import { useEffect, useRef } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Card, Divider, useTheme, Switch } from '@mui/material'
import { EcowattAlertsNovuPreferencesType } from 'src/modules/Ecowatt/ecowatt'
import { useToggle } from 'react-use'
import { Form } from 'src/common/react-platform-components'
import { NovuChannelsWithValueAndKey } from '../../Alerts'
import { LoadingButton } from '@mui/lab'
import { useIntl } from 'react-intl'

/**
 * Power max alerts component.
 *
 * @param props Props.
 * @param props.initialSwitchValues Is push notification state.
 * @param props.isNovuAlertPreferencesLoading Is Novu alert preferences loading.
 * @param props.updateNovuAlertPreferences Update novu alert notification preferences.
 * @param props.refetchData Refetch preferences to update initial values.
 * @returns JSX Element.
 */
const PowerMaxAlert = ({
    initialSwitchValues,
    isNovuAlertPreferencesLoading,
    updateNovuAlertPreferences,
    refetchData,
}: /**
 */
{
    /**
     * Initial values of switchs.
     */
    initialSwitchValues: NovuChannelsWithValueAndKey | undefined
    /**
     * Is novu Alert preferences loading.
     */
    isNovuAlertPreferencesLoading: boolean
    /**
     * Updat novu alert prefernces.
     */
    updateNovuAlertPreferences: (
        alerts: EcowattAlertsNovuPreferencesType,
        resetValues?: (() => void) | undefined,
    ) => void
    /**
     * Refretch data after succesful update.
     */
    refetchData?: () => void
}) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()

    const isSwitchSet = useRef(false)
    const [isPush, setIsPush] = useToggle(false)
    const [isEmail, setIsEmail] = useToggle(false)

    useEffect(() => {
        if (!isSwitchSet.current && initialSwitchValues) {
            setIsPush(initialSwitchValues.push?.value)
            setIsEmail(initialSwitchValues.email?.value)
            isSwitchSet.current = true
        }
    }, [initialSwitchValues, setIsEmail, setIsPush])

    /**
     * Handle submit.
     */
    const handleOnSubmit = async () => {
        // if user changed the switchs we send the modifications
        if (
            initialSwitchValues &&
            (isPush !== initialSwitchValues.push.value || isEmail !== initialSwitchValues.email.value)
        ) {
            await updateNovuAlertPreferences({
                [initialSwitchValues.push.key]: isPush,
                [initialSwitchValues.email.key]: isEmail,
            })
            if (refetchData) {
                await refetchData()
            }
        }
    }

    return (
        <div className="flex-col my-48">
            <TypographyFormatMessage
                color={theme.palette.primary.main}
                className="text-16 md:text-20 font-medium flex items-center"
            >
                Alertes de puissance
            </TypographyFormatMessage>
            <Form onSubmit={handleOnSubmit}>
                <div className="mb-8">
                    <Card className="w-full rounded-20 shadow sm:m-4 pb-8" variant="outlined">
                        <div className="flex-col justify-center mt-10">
                            <TypographyFormatMessage className="text-13 ml-8 md:text-16 font-medium flex items-center">
                                Cette Alerte vous serra envoyer lorsque votre puissance instantanée atteindra la
                                puissance souscrite dans le contrat
                            </TypographyFormatMessage>
                            <div className="flex justify-around content-center">
                                <div className="flex items-center justify-center">
                                    <Switch
                                        name={initialSwitchValues?.push?.key}
                                        checked={isPush}
                                        onChange={() => setIsPush(!isPush)}
                                        data-testid="pushPowerMax-switch"
                                    />
                                    <span>Push</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Switch
                                        name={initialSwitchValues?.email.key}
                                        checked={isEmail}
                                        onChange={() => setIsEmail(!isEmail)}
                                        data-testid="emailPowerMax-switch"
                                    />
                                    <span>Mail</span>
                                </div>
                            </div>
                            <Divider className="mx-20 mb-12" />
                            <div className="flex justify-center content-center">
                                <LoadingButton
                                    loading={isNovuAlertPreferencesLoading}
                                    type="submit"
                                    variant="contained"
                                >
                                    {formatMessage({
                                        id: 'Enregistrer',
                                        defaultMessage: 'Enregistrer',
                                    })}
                                </LoadingButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
        </div>
    )
}

export default PowerMaxAlert
