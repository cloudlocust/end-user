import { CardContent, useTheme, IconButton } from '@mui/material'
import {
    EnergyStatusWidgetProps,
    EnergyStatusWidgetTypeEnum,
} from 'src/modules/Dashboard/EnergyStatusWidget/energyStatusWidget.d'
import { ReactComponent as ElectricTowerIcon } from 'src/assets/images/dashboard/electric-tower.svg'
import { ReactComponent as BoltIcon } from 'src/assets/images/dashboard/bolt.svg'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { SVGAttributes, useMemo } from 'react'
import { findLastNonNullableDatapoint } from 'src/modules/Dashboard/utils/utils'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { LastDataStatus } from 'src/modules/Dashboard/utils/utils.d'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'

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
    const { data, nrlinkConsent, type, pricePerKwh, isLoading } = props
    const theme = useTheme()
    const themeContrastText = theme.palette.primary.contrastText

    const widgetTitle =
        type === EnergyStatusWidgetTypeEnum.CONSUMPTION ? 'Dernière puissance remontée' : 'Dernière puissance injectée'
    const iconType =
        type === EnergyStatusWidgetTypeEnum.CONSUMPTION ? (
            <BoltIcon fill={theme.palette.secondary.main} {...iconStyle} />
        ) : (
            <ElectricTowerIcon fill={theme.palette.secondary.main} {...iconStyle} />
        )

    const lastData = useMemo(() => findLastNonNullableDatapoint(data), [data])

    const { value: lastDataValue, unit: lastDataUnit } = consumptionWattUnitConversion(lastData?.value ?? 0)
    const isLastDateWithinSixMinutes = lastData?.message === LastDataStatus.UPDATED
    const isLastDataNull = !lastData

    return (
        <FuseCard
            sx={{ bgcolor: BG_PRIMARY_MAIN, height: CARD_HEIGHT }}
            isLoading={isLoading}
            loadingColor={theme.palette.common.white}
        >
            <CardContent className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-5">
                    {nrlinkConsent !== 'NONEXISTENT' && (
                        <IconButton sx={{ bgcolor: themeContrastText }} className="mr-10">
                            {iconType}
                        </IconButton>
                    )}
                    <TypographyFormatMessage className="text-20 font-400" sx={{ color: themeContrastText }}>
                        {widgetTitle}
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-col w-full flex-grow">
                    <div className="flex justify-end items-center text-14 mb-5">
                        <span style={{ color: themeContrastText }}>
                            {isLastDateWithinSixMinutes
                                ? `à ${dayjs(lastData?.timestamp).format('HH:mm:ss')}`
                                : isLastDataNull
                                ? NRLINK_OFFLINE
                                : NRLINK_OUT_OF_RANGE_MESSAGE}
                        </span>
                    </div>
                    <div className="flex flex-row ml-auto flex-grow">
                        <span
                            className={`text-28 font-400 flex items-center mr-20`}
                            style={{ color: themeContrastText }}
                        >
                            {!isLastDateWithinSixMinutes ? '- w' : `${lastDataValue} ${lastDataUnit}`}
                        </span>
                        {type === EnergyStatusWidgetTypeEnum.CONSUMPTION && (
                            <span className="text-28 font-400 flex items-center" style={{ color: themeContrastText }}>
                                {pricePerKwh ?? '-'} €/h
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
