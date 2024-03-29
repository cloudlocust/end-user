import { CardContent, useTheme, IconButton, useMediaQuery } from '@mui/material'
import { ReactComponent as BoltIcon } from 'src/assets/images/dashboard/bolt.svg'
import { ReactComponent as SunIcon } from 'src/assets/images/dashboard/sun.svg'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { SVGAttributes, useMemo } from 'react'
import { FuseCard } from 'src/modules/shared/FuseCard'
import { EnergyStatusWidgetProps } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/energyStatusWidget'
import convert from 'convert-units'

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
    const themeGrey700 = theme.palette.grey[700]

    const isLastPowerDataNegative = lastPowerData?.value! < 0

    const { widgetTitle, iconType, iconBackgroundColor, backgroundColor, loadingColor, textColor, dateTextColor } =
        isLastPowerDataNegative
            ? {
                  widgetTitle: 'Dernière puissance injectée',
                  iconType: <SunIcon fill={theme.palette.secondary.main} {...iconStyle} />,
                  iconBackgroundColor: themeGrey700,
                  backgroundColor: 'secondary.main',
                  loadingColor: themeGrey700,
                  textColor: themeGrey700,
                  dateTextColor: theme.palette.grey[600],
              }
            : {
                  widgetTitle: 'Dernière puissance consommée',
                  iconType: <BoltIcon fill={theme.palette.secondary.main} {...iconStyle} />,
                  iconBackgroundColor: themeContrastText,
                  backgroundColor: 'primary.main',
                  loadingColor: theme.palette.common.white,
                  textColor: themeContrastText,
                  dateTextColor: themeContrastText,
              }

    const isNrlinkDisconnected = nrlinkConsent?.nrlinkConsentState === 'DISCONNECTED'
    const isNrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'

    // const lastDataTimestamp = lastPowerData?.timestamp

    const computedLastPowerData = useMemo(() => {
        return lastPowerData?.value && lastPowerData.timestamp
            ? { value: Math.abs(lastPowerData.value), unit: 'W' }
            : { value: 0, unit: 'W' }
    }, [lastPowerData])

    let lastNrlinkPowerDate = ''
    if (lastPowerData?.timestamp) {
        const lastDataDate = dayjs(lastPowerData?.timestamp).utc().locale('fr')
        const currentDate = dayjs().utc().locale('fr')

        if (lastDataDate.isSame(currentDate, 'day')) {
            // If lastDataTimestamp is from the current day, display only the time
            lastNrlinkPowerDate = lastDataDate.format('HH:mm:ss')
        } else {
            // If lastDataTimestamp is from a different day, display the full date and time
            lastNrlinkPowerDate = lastDataDate
                .format('dddd D MMMM HH:mm')
                // this to capitalize the first letter of the day
                .replace(/^[a-zA-Z]/, (c) => c.toUpperCase())
        }
    }

    const lastNrlinkPowerDataInEuro = useMemo(
        () => (pricePerKwh ? convert(computedLastPowerData.value).from('Wh').to('kWh') * pricePerKwh : 0),
        [computedLastPowerData.value, pricePerKwh],
    )

    return (
        <FuseCard
            sx={{
                bgcolor: backgroundColor,
                height: mdDown ? CARD_HEIGHT : '75%',
                width: mdDown ? '70%' : '100%',
                color: textColor,
            }}
            isLoading={isNrlinkPowerLoading}
            loadingColor={loadingColor}
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
                    <IconButton sx={{ bgcolor: iconBackgroundColor }} className="mr-10 pointer-events-none">
                        {iconType}
                    </IconButton>

                    <TypographyFormatMessage className="text-14 sm:text-18 lg:text-20 font-400">
                        {widgetTitle}
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-col w-full">
                    {(isNrlinkDisconnected || isNrlinkOff) && (
                        <div className="flex justify-end items-center text-13 mb-10">
                            <span>{NRLINK_OFFLINE}</span>
                        </div>
                    )}
                    <div className="flex justify-end items-center text-12 sm:text-16 mb-10">
                        <span style={{ color: dateTextColor }}>
                            {lastNrlinkPowerDate ? `${lastNrlinkPowerDate}` : null}
                        </span>
                    </div>
                    <div className="flex flex-row space-x-5 justify-end flex-1">
                        <div className="flex space-x-5 items-baseline">
                            <span className="text-28 leading-3 md:font-semibold">{computedLastPowerData?.value}</span>
                            <span className="text-14 leading-3 md:font-medium">{computedLastPowerData.unit}</span>
                        </div>
                        {!isLastPowerDataNegative && (
                            <div className="flex space-x-5 items-baseline">
                                <span className="text-28 md:text-32 leading-3 md:font-semibold">
                                    {isNrlinkDisconnected ? '-' : lastNrlinkPowerDataInEuro.toFixed(2)}
                                </span>
                                <span className="text-14 leading-3 md:font-medium">€/h</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
