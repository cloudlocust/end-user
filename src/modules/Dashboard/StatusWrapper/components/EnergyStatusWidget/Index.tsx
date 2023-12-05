import { CardContent, useTheme, IconButton } from '@mui/material'
import { ReactComponent as ElectricTowerIcon } from 'src/assets/images/dashboard/electric-tower.svg'
import { ReactComponent as BoltIcon } from 'src/assets/images/dashboard/bolt.svg'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { SVGAttributes, useMemo } from 'react'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { EnergyStatusWidgetProps } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/energyStatusWidget'

const iconStyle: SVGAttributes<SVGSVGElement> = {
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

    const computedLastPowerData = useMemo(
        () => (lastPowerData?.value ? consumptionWattUnitConversion(lastPowerData?.value!) : { value: 0, unit: 'W' }),
        [lastPowerData],
    )

    const lastNrlinkPowerDate = dayjs(lastDataTimestamp).format('HH:mm')

    return (
        <FuseCard
            sx={{ bgcolor: BG_PRIMARY_MAIN, height: CARD_HEIGHT }}
            isLoading={isNrlinkPowerLoading}
            loadingColor={theme.palette.common.white}
        >
            <CardContent className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-5">
                    {!isNrlinkDisconnected && (
                        <IconButton sx={{ bgcolor: themeContrastText }} className="mr-10">
                            {iconType}
                        </IconButton>
                    )}

                    <TypographyFormatMessage className="text-20 font-400" sx={{ color: themeContrastText }}>
                        {isNrlinkDisconnected ? ' ' : widgetTitle}
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-col w-full flex-grow">
                    <div className="flex justify-end items-center text-14 mb-5">
                        <span style={{ color: themeContrastText }}>
                            {isNrlinkDisconnected
                                ? NRLINK_OUT_OF_RANGE_MESSAGE
                                : isNrlinkOff && !lastPowerData?.value!
                                ? NRLINK_OFFLINE
                                : lastNrlinkPowerDate}
                        </span>
                    </div>
                    <div className="flex flex-row ml-auto flex-grow">
                        <span
                            className={`text-28 font-400 flex items-center mr-20`}
                            style={{ color: themeContrastText }}
                        >
                            {isNrlinkDisconnected
                                ? '-'
                                : `${computedLastPowerData?.value} ${computedLastPowerData?.unit}`}
                        </span>
                        {!isLastPowerDataNegative && (
                            <span className="text-28 font-400 flex items-center" style={{ color: themeContrastText }}>
                                {isNrlinkDisconnected ? '-' : pricePerKwh?.toFixed(2)} €/h
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
