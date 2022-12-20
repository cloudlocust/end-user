import { Card, useTheme, Switch } from '@mui/material'
import { useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EcowattTooltip } from 'src/modules/Ecowatt/components/EcowattTooltip/'
import { Controller, useForm } from 'react-hook-form'

// TODO: To be worked on in another PR when contract front/back is ready.
/**
 * Ecowatt Alerts component.
 *
 * @returns EcowattAlerts JSX.
 */
export const EcowattAlerts = () => {
    const theme = useTheme()
    const [openTooltip, setOpenTooltip] = useState<boolean>(false)
    const { control } = useForm()

    return (
        <div className="flex-col mt-48 px-14">
            <div className="flex flex-row items-center">
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    className="text-17 font-medium flex items-center"
                >
                    EcoWatt :
                </TypographyFormatMessage>
                <EcowattTooltip
                    openState={openTooltip}
                    onOpen={() => setOpenTooltip(true)}
                    onClose={() => setOpenTooltip(false)}
                />
            </div>
            <TypographyFormatMessage className="text-13 font-medium md:text-15 flex items-center">
                La météo de l'électricité
            </TypographyFormatMessage>

            <Card className="rounded-6 shadow m-6 p-12" variant="outlined">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <TypographyFormatMessage fontWeight={500} sx={{ flexBasis: '65%', pr: 2 }}>
                            Signal orange ou rouge prévu dans les 2 prochains jours
                        </TypographyFormatMessage>
                        <div className="flex flex-col justify-evenly items-center" style={{ flexBasis: '35%' }}>
                            <div className="flex flex-row justify-evenly items-center w-full">
                                <span>Push</span>
                                <Controller
                                    control={control}
                                    name="switch-form"
                                    defaultValue={false}
                                    render={() => {
                                        return <Switch />
                                    }}
                                />
                            </div>
                            <div className="flex flex-row justify-evenly items-center w-full">
                                <span>Mail</span>
                                <Controller
                                    control={control}
                                    name="switch-form"
                                    defaultValue={false}
                                    render={() => {
                                        return <Switch />
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="rounded-6 shadow m-6 p-12" variant="outlined">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <TypographyFormatMessage fontWeight={500} sx={{ flexBasis: '65%', pr: 2 }}>
                            A l'approche d'un créneau prange ou rouge dans la journée
                        </TypographyFormatMessage>
                        <div className="flex flex-col justify-evenly items-center" style={{ flexBasis: '35%' }}>
                            <div className="flex flex-row justify-evenly items-center w-full">
                                <span>Push</span>
                                <Controller
                                    control={control}
                                    name="switch-form"
                                    defaultValue={false}
                                    render={() => {
                                        return <Switch />
                                    }}
                                />
                            </div>
                            <div className="flex flex-row justify-evenly items-center w-full">
                                <span>Mail</span>
                                <Controller
                                    control={control}
                                    name="switch-form"
                                    defaultValue={false}
                                    render={() => {
                                        return <Switch />
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
