import { Card, CardContent, useTheme, IconButton, Box } from '@mui/material'
import { EnergyStatusWidgetProps } from 'src/modules/Dashboard/EnergyStatusWidget/energyStatusWidget'
import { ReactComponent as ElectricTowerIcon } from 'src/assets/images/dashboard/electric-tower.svg'
import { ReactComponent as BoltIcon } from 'src/assets/images/dashboard/bolt.svg'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useMemo } from 'react'
import { findLastNonNullableDatapoint } from 'src/modules/Dashboard/utils/utils'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

const iconStyle = {
    width: 25,
    height: 25,
}

/**
 * EnergyStatusWidget component.
 *
 * @param props N/A.
 * @returns EnergyStatusWidget JSX.
 */
export const EnergyStatusWidget = (props: EnergyStatusWidgetProps) => {
    const { data, nrlinkConsent, type } = props
    const theme = useTheme()
    // const mdDown = useMediaQuery(theme.breakpoints.down('md'))

    const widgetTitle = type === 'consumption' ? 'Dernière puissance remontée' : 'Dernière puissance injectée'
    const iconType =
        type === 'consumption' ? (
            <BoltIcon fill={theme.palette.secondary.main} {...iconStyle} />
        ) : (
            <ElectricTowerIcon fill={theme.palette.secondary.main} {...iconStyle} />
        )

    const lastData = useMemo(() => findLastNonNullableDatapoint(data), [data])
    const { value: lastDataValue, unit: lastDataUnit } = consumptionWattUnitConversion(lastData?.value ?? 0)

    return (
        <Card className="rounded-20 shadow" sx={{ bgcolor: theme.palette.primary.main, height: '155px' }}>
            <CardContent className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-5">
                    {nrlinkConsent !== 'NONEXISTENT' && (
                        <IconButton sx={{ background: theme.palette.primary.contrastText }} className="mr-10">
                            {iconType}
                        </IconButton>
                    )}

                    <TypographyFormatMessage
                        className="text-20 font-400"
                        sx={{ color: theme.palette.primary.contrastText }}
                    >
                        {widgetTitle}
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-col w-full flex-grow">
                    <div className="flex justify-end items-center text-14 mb-5">
                        <span className="mr-4" style={{ color: theme.palette.primary.contrastText }}>
                            à
                        </span>
                        <Box sx={{ color: theme.palette.primary.contrastText }} component={'span'}>
                            {dayjs(lastData?.timestamp).format('HH:mm:ss')}
                        </Box>
                    </div>
                    <div className="flex justify-between item-center flex-grow">
                        <Box
                            className="text-24 font-400 flex items-center"
                            sx={{ color: theme.palette.primary.contrastText }}
                            component={'span'}
                        >
                            {lastDataValue ?? '-'} {lastDataUnit}
                        </Box>
                        {type === 'consumption' && (
                            <Box
                                className="text-24 font-400 flex items-center"
                                sx={{ color: theme.palette.primary.contrastText }}
                                component={'span'}
                            >
                                €/h
                            </Box>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
