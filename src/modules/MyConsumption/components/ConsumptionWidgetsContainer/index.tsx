import React, { useEffect } from 'react'
import { Grid } from '@mui/material'
import { useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { WidgetTargets } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { ConsumptionWidgetsContainerProps } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/WidgetContainer'
import { getWidgetInfoIcon } from 'src/modules/MyConsumption/components/WidgetInfoIcons'
import { useWidgetsMetricsContext } from 'src/modules/MyConsumption/Context/ConsumptionWidgetsMetricsContext/useWidgetsMetricsContext'

/**
 * MyConsumptionWidgets Component (it's Wrapper of the list of Widgets).
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.filters Metrics Filters.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly.
 * @param props.hasMissingHousingContracts Flag HasMissingContracts.
 * @param props.enphaseOff Enphase Consent is inactive.
 * @param props.enedisOff EnedisSge Consent is not Connected.
 * @returns Consumption Widgets List Component.
 */
const ConsumptionWidgetsContainer = ({
    range,
    filters,
    metricsInterval,
    period,
    hasMissingHousingContracts,
    enphaseOff,
    enedisOff,
}: ConsumptionWidgetsContainerProps) => {
    const theme = useTheme()
    const { resetMetrics } = useWidgetsMetricsContext()

    // We should reset the metrics context when the range, filters, metricsInterval or period changes.
    useEffect(() => {
        resetMetrics()
    }, [range, filters, metricsInterval, period, resetMetrics])

    return (
        <div className="p-12 sm:p-24 ">
            <div className="flex justify-center items-center md:justify-start">
                <TypographyFormatMessage variant="h5" className="sm:mr-8 text-black font-medium">
                    Chiffres clés
                </TypographyFormatMessage>
            </div>
            <div style={{ background: theme.palette.grey[100] }} className="w-full my-8">
                <Grid container spacing={{ xs: 1, md: 2 }}>
                    {WidgetTargets.map((target) => {
                        return (
                            <Widget
                                key={target}
                                target={target}
                                range={range}
                                filters={filters}
                                metricsInterval={metricsInterval}
                                period={period}
                                infoIcon={getWidgetInfoIcon({
                                    widgetTarget: target,
                                    hasMissingContracts: hasMissingHousingContracts,
                                    enphaseOff,
                                    enedisSgeOff: enedisOff,
                                })}
                            />
                        )
                    })}
                </Grid>
            </div>
        </div>
    )
}

export default ConsumptionWidgetsContainer
