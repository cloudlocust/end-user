import { useEffect, useRef, useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Card, Divider, useTheme, Switch, Tooltip, AppBar, Toolbar as MuiToolbar } from '@mui/material'
import { EcowattAlertsNovuPreferencesType } from 'src/modules/Ecowatt/ecowatt'
import { useToggle } from 'react-use'
import { Form } from 'src/common/react-platform-components'
import { InfoOutlined, Close } from '@mui/icons-material'
import { NovuChannelsWithValueAndKey } from '../../Alerts'
import { LoadingButton } from '@mui/lab'
import { linksColor } from 'src/modules/utils/muiThemeVariables'

/**
 * Tooltip content text.
 */
export const TOOLTIP_TEXT_CONTENT = `Cette alerte sera déclanché lorsque votre puissance instantanée atteint la puissance souscrite, vous serai notifier régulièrement jusqu'à ce que la puissance repasse en état normal`

/**
 * Tooltip content title.
 */
export const TOOLTIP_TEXT_TITLE = 'Que Signifie cette alerte ?'
/**
 * Power max alerts component.
 *
 * @param props Props.
 * @param props.initialSwitchValues Is push notification state.
 * @param props.isNovuAlertPreferencesLoading Is Novu alert preferences loading.
 * @param props.updateNovuAlertPreferences Update novu alert notification preferences.
 * @param props.onAfterUpdate Refetch preferences to update initial values.
 * @returns JSX Element.
 */
const PowerMaxAlert = ({
    initialSwitchValues,
    isNovuAlertPreferencesLoading,
    updateNovuAlertPreferences,
    onAfterUpdate,
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
    onAfterUpdate?: () => void
}) => {
    const theme = useTheme()

    const isSwitchSet = useRef(false) // to know if the switch are set after loading the component or not
    const [isPush, setIsPush] = useToggle(false)
    const [isEmail, setIsEmail] = useToggle(false)
    const [openTooltip, setOpenTooltip] = useState<boolean>(false)

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
            if (onAfterUpdate) {
                await onAfterUpdate()
            }
        }
    }

    return (
        <div className="flex-col my-48">
            <div className="flex flex-row items-center">
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    className="text-16 md:text-20 font-medium flex items-center"
                >
                    Alertes de puissance
                </TypographyFormatMessage>
                <PowerMaxTooltip
                    openState={openTooltip}
                    onOpen={() => setOpenTooltip(true)}
                    onClose={() => setOpenTooltip(false)}
                />
            </div>
            <Form onSubmit={handleOnSubmit}>
                <div className="mb-8">
                    <Card className="w-full rounded-20 shadow sm:m-4 pb-8" variant="outlined">
                        <div className="flex-col justify-center mt-10">
                            <TypographyFormatMessage className="text-13 ml-16 md:text-16 font-small flex items-center">
                                Choisissez votre mode de notification :
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
                                    <TypographyFormatMessage>Enregistrer</TypographyFormatMessage>
                                </LoadingButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
        </div>
    )
}

/**
 * Power Max tooltip.
 *
 * @param props N/A.
 * @param props.onOpen Open state of tooltip.
 * @param props.onClose Callback function that close tooltip.
 * @param props.openState Open state of tooltip.
 * @returns JSX Element.
 */
const PowerMaxTooltip = ({
    openState,
    onOpen,
    onClose,
}: /**
 *
 */
{
    /**
     * Open state.
     */
    openState: boolean
    /**
     * On open.
     */
    onOpen: () => void
    /**
     * On close.
     */
    onClose: () => void
}) => {
    return (
        <Tooltip
            open={openState}
            disableHoverListener
            title={
                <div className="p-6">
                    <div className="flex-grow mb-64">
                        <AppBar elevation={0} color="secondary">
                            <MuiToolbar className="flex justify-between">
                                <TypographyFormatMessage>{TOOLTIP_TEXT_TITLE}</TypographyFormatMessage>
                                <Close className="cursor-pointer" onClick={() => onClose()} />
                            </MuiToolbar>
                        </AppBar>
                    </div>
                    <TypographyFormatMessage>{TOOLTIP_TEXT_CONTENT}</TypographyFormatMessage>
                </div>
            }
            placement="top-start"
            arrow
        >
            <InfoOutlined
                sx={(theme) => ({
                    color: linksColor || theme.palette.primary.main,
                    marginLeft: 'auto',
                    cursor: 'pointer',
                })}
                fontSize="large"
                onClick={() => onOpen()}
            />
        </Tooltip>
    )
}
export default PowerMaxAlert
