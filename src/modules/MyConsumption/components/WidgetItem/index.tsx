import { Icon, Typography } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { getWidgetIndicatorColor } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { IWidgetItemProps } from 'src/modules/MyConsumption/components/WidgetItem/WidgetItem'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Widget Item Component.
 *
 * @param props N/A.
 * @param props.target Target type of the widget.
 * @param props.title Title of the widget.
 * @param props.infoIcon InfoIcon showed in top right of widget.
 * @param props.value Value of the widget.
 * @param props.unit Unit of the widget.
 * @param props.percentageChange Percentage change of the widget.
 * @param props.period Period of the Widget.
 * @param props.noValueMessage Message when no value exists.
 * @returns WidgetItem Component.
 */
export function WidgetItem({
    target,
    title,
    infoIcon,
    value,
    unit,
    percentageChange,
    period,
    noValueMessage,
}: IWidgetItemProps) {
    const isTrendingIndicatorShowing =
        percentageChange !== 0 &&
        target !== metricTargetsEnum.internalTemperature &&
        target !== metricTargetsEnum.externalTemperature

    return (
        <div className="p-16 flex flex-col flex-1 gap-3 justify-between">
            <div className="flex flex-row justify-between">
                {/* Widget title */}
                <TypographyFormatMessage className="sm:text-16 font-medium md:text-17">{title}</TypographyFormatMessage>
                {/* Widget infoIcon */}
                {infoIcon}
            </div>
            {!value || (target === metricTargetsEnum.injectedProduction && period === PeriodEnum.DAILY) ? (
                <div className="text-center flex flex-1 justify-center items-center py-4">{noValueMessage}</div>
            ) : (
                <div className="flex flex-row justify-between items-center gap-3">
                    <div className="flex flex-row items-end gap-3">
                        {/* Widget value */}
                        <Typography className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tighter">
                            {value}
                        </Typography>
                        {/* Widget unit */}
                        <Typography className="text-16 md:text-20 font-medium" color="textSecondary">
                            {unit}
                        </Typography>
                    </div>
                    {/* Widget arrow */}
                    {isTrendingIndicatorShowing && (
                        // Negative means decrease
                        <div className="h-full flex items-center">
                            {percentageChange < 0 ? (
                                <Icon
                                    color={getWidgetIndicatorColor(target, percentageChange)}
                                    sx={{ fontSize: { xs: '24px', md: '32px' } }}
                                >
                                    trending_down
                                </Icon>
                            ) : (
                                // Positive means increase
                                <Icon
                                    color={getWidgetIndicatorColor(target, percentageChange)}
                                    sx={{ fontSize: { xs: '24px', md: '32px' } }}
                                >
                                    trending_up
                                </Icon>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
