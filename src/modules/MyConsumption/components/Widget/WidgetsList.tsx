import { Grid, useTheme } from '@mui/material'
import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetListProps, widgetTitleType } from 'src/modules/MyConsumption/components/Widget/Widget'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'

/**
 * Function that returns title according to metric target.
 *
 * @param target Metric Target.
 * @returns Widget title.
 */
const renderWidgetTitle = (target: metricTargetType): widgetTitleType => {
    switch (target) {
        case metricTargetsEnum.consumption:
            return 'Consommation Totale'
        case metricTargetsEnum.pMax:
            return 'Puissance Maximale'
        case metricTargetsEnum.externalTemperature:
            return 'Température Extérieure'
        case metricTargetsEnum.internalTemperature:
            return 'Température Intérieure'
        default:
            throw Error('Wrong target')
    }
}

/**
 * Widget List component that contains every widget.
 *
 * @param props N/A.
 * @param props.data Metrics data.
 * @param props.isMetricsLoading Loading state from useMetrics.
 * @returns WidgetsList component.
 */
export const WidgetList = ({ data, isMetricsLoading }: IWidgetListProps) => {
    const theme = useTheme()

    return (
        <div style={{ background: theme.palette.grey[100] }} className="w-full my-8">
            <Grid container spacing={{ xs: 1, md: 2 }}>
                {data.map(({ target }) => {
                    const widgetAsset = computeWidgetAssets(data, target)
                    return (
                        <Widget
                            key={target}
                            isMetricsLoading={isMetricsLoading}
                            unit={widgetAsset.unit}
                            title={renderWidgetTitle(target)}
                            value={widgetAsset.value}
                        />
                    )
                })}
            </Grid>
        </div>
    )
}
