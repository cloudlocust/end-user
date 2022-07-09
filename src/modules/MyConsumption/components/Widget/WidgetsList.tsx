import { Grid, useTheme } from '@mui/material'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetListProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'

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
                    return (
                        <Widget
                            key={target}
                            type={target}
                            isMetricsLoading={isMetricsLoading}
                            computeAssets={computeWidgetAssets(data, target)}
                        />
                    )
                })}
            </Grid>
        </div>
    )
}
