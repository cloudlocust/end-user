import { useMemo } from 'react'
import { useTheme } from '@mui/material'
import { useIntl } from 'react-intl'
import IconButton from '@mui/material/IconButton'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import GaugeChart from 'react-gauge-chart'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import {
    calculateGaugeChartPercent,
    getAlertPeriodText,
    getFormatedAlertThreshold,
} from 'src/modules/Dashboard/AlertWidget/utils'
import { AlertWidgetProps } from 'src/modules/Dashboard/AlertWidget/AlertWidget'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * AlertWidget component.
 *
 * @param root0 N/A.
 * @param root0.alertType The alert type.
 * @param root0.alertPeriod The alert period.
 * @param root0.alertThreshold The alert threshold (seuil) value for consumption or price.
 * @param root0.currentValue The current value of the consumption or price.
 * @param root0.isLoading The content of the alert widget is loading.
 * @returns AlertWidget Jsx.
 */
export const AlertWidget = ({ alertType, alertPeriod, alertThreshold, currentValue, isLoading }: AlertWidgetProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()

    const gaugeChartPercent = useMemo(
        () => (alertThreshold !== undefined ? calculateGaugeChartPercent(alertThreshold, currentValue) : 0),
        [alertThreshold, currentValue],
    )

    const alertPeriodText = useMemo(() => {
        const alertPeriodText = getAlertPeriodText(alertPeriod)
        return formatMessage({ id: alertPeriodText, defaultMessage: alertPeriodText })
    }, [alertPeriod, formatMessage])

    const formatedAlertThreshold = useMemo(
        () => (alertThreshold !== undefined ? getFormatedAlertThreshold(alertThreshold, alertType) : ''),
        [alertThreshold, alertType],
    )

    return (
        <FuseCard
            isLoading={isLoading}
            loadingColor={theme.palette.primary.main}
            className="flex flex-col justify-between p-20"
        >
            <div className="flex items-center gap-10">
                <IconButton className="pointer-events-none" size="small" sx={{ bgcolor: theme.palette.primary.main }}>
                    <NotificationsActiveIcon sx={{ color: theme.palette.primary.contrastText }} />
                </IconButton>
                <div>
                    <TypographyFormatMessage className="inline text-16">Mon seuil d'alerte</TypographyFormatMessage>{' '}
                    <span className="text-16 font-700">{alertPeriodText}</span>
                </div>
            </div>
            <div className="relative w-full mt-14">
                {alertThreshold !== undefined ? (
                    <>
                        <span className="absolute right-5 top-0 underline font-700 text-14">
                            {formatedAlertThreshold}
                        </span>
                        <GaugeChart
                            id={`gauge-chart-alert-${alertPeriod}`}
                            nrOfLevels={6}
                            colors={[`${theme.palette.primary.main}22`, `${theme.palette.primary.main}ff`]}
                            arcWidth={0.3}
                            percent={gaugeChartPercent}
                            hideText
                            className="mt-14 max-w-400 mx-auto"
                        />
                    </>
                ) : null}
            </div>
        </FuseCard>
    )
}
