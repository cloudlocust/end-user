import { CardContent, useTheme, IconButton, useMediaQuery } from '@mui/material'
import { ReactComponent as ElectricTowerIcon } from 'src/assets/images/dashboard/electric-tower.svg'
import { ReactComponent as BoltIcon } from 'src/assets/images/dashboard/bolt.svg'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { SVGAttributes, useMemo } from 'react'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { EnergyStatusWidgetProps } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/energyStatusWidget'

/**
 * Icon style.
 */
export const iconStyle: SVGAttributes<SVGSVGElement> = {
    width: 25,
    height: 25,
}

/**
 * Card width.
 */
export const CARD_HEIGHT = '170px'

/**
 * Nrlink out of range message.
 */
export const NRLINK_OUT_OF_RANGE_MESSAGE = 'nrLINK hors de portée wifi'

/**
 * Nrlink offline message.
 */
export const NRLINK_OFFLINE = 'Connectez votre nrLINK pour voir votre consommation à la minute'

/**
 * Background primary main.
 */
export const BG_PRIMARY_MAIN = 'primary.main'

/**
 * EnergyStatusWidget component.
 *
 * @param props N/A.
 * @returns EnergyStatusWidget JSX.
 */
export const EnergyStatusWidget = (props: EnergyStatusWidgetProps) => {
    const { isNrlinkPowerLoading, pricePerKwh, lastPowerData, nrlinkConsent } = props
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const themeContrastText = theme.palette.primary.contrastText

    const isLastPowerDataNegative = lastPowerData?.value! < 0

    const widgetTitle = isLastPowerDataNegative ? 'Dernière puissance injectée' : 'Dernière puissance remontée'
    const iconType = isLastPowerDataNegative ? (
        <ElectricTowerIcon fill={theme.palette.secondary.main} {...iconStyle} />
    ) : (
        <BoltIcon fill={theme.palette.secondary.main} {...iconStyle} />
    )

    const isNrlinkDisconnected = nrlinkConsent?.nrlinkConsentState === 'DISCONNECTED'
    const isNrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'

    const lastDataTimestamp = lastPowerData?.timestamp

    const computedLastPowerData = useMemo(() => {
        return lastPowerData?.value && lastPowerData.timestamp
            ? consumptionWattUnitConversion(Math.abs(lastPowerData?.value!))
            : { value: 0, unit: 'W' }
    }, [lastPowerData])

    const lastNrlinkPowerDate = lastDataTimestamp ? dayjs(lastDataTimestamp).utc().locale('fr').format('HH:mm:ss') : ''

    return (
        <FuseCard
            sx={{
                bgcolor: BG_PRIMARY_MAIN,
                height: mdDown ? CARD_HEIGHT : '60%',
                width: mdDown ? '70%' : '100%',
            }}
            isLoading={isNrlinkPowerLoading}
            loadingColor={theme.palette.common.white}
        >
            <CardContent
                className="flex flex-col h-full items-stretch"
                /**
                 * @see https://stackoverflow.com/a/60403040/14005627
                 */
                sx={{
                    padding: '1rem',
                    '&:last-child': {
                        paddingBottom: '1rem',
                    },
                }}
            >
                <div className="flex justify-between items-start mb-5 h-full">
                    <IconButton sx={{ bgcolor: themeContrastText }} className="mr-10 pointer-events-none">
                        {iconType}
                    </IconButton>

                    <TypographyFormatMessage
                        className="text-14 sm:text-18 lg:text-20 font-400"
                        sx={{ color: themeContrastText }}
                    >
                        {widgetTitle}
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-col w-full">
                    {(isNrlinkDisconnected || isNrlinkOff) && (
                        <div className="flex justify-end items-center text-13 mb-10">
                            <span style={{ color: themeContrastText }}>{NRLINK_OFFLINE}</span>
                        </div>
                    )}
                    <div className="flex justify-end items-center text-12 sm:text-16 mb-10">
                        <span style={{ color: themeContrastText }}>
                            {lastNrlinkPowerDate ? `à ${lastNrlinkPowerDate}` : null}
                        </span>
                    </div>
                    <div className="flex flex-row space-x-5 justify-end flex-1">
                        <div className="flex space-x-5 items-baseline">
                            <span className="text-28 leading-3 md:font-semibold" style={{ color: themeContrastText }}>
                                {computedLastPowerData?.value}
                            </span>
                            <span className="text-14 leading-3 md:font-medium" style={{ color: themeContrastText }}>
                                {computedLastPowerData?.unit}
                            </span>
                        </div>
                        {!isLastPowerDataNegative && (
                            <div className="flex space-x-5 items-baseline">
                                <span
                                    className="text-28 md:text-32 leading-3 md:font-semibold"
                                    style={{ color: themeContrastText }}
                                >
                                    {isNrlinkDisconnected ? '-' : pricePerKwh?.toFixed(2)}
                                </span>
                                <span className="text-14 leading-3 md:font-medium" style={{ color: themeContrastText }}>
                                    €/h
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
