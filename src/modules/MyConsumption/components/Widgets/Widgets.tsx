import { Card, Typography, CircularProgress } from '@mui/material'
import { IWidgetAssets, IWidgetProps } from 'src/modules/MyConsumption/components/Widgets/Widget'
import { useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'

/**
 * Render widgetr function.
 *
 * @param title Title of widget.
 * @param unit Unit of widget.
 * @returns Widget component.
 */
const renderWidget = (title: string, unit: string) => {
    return (
        <div className="p-16 flex flex-col justify-between">
            <Typography className="sm:text-17 md:text-18 font-normal" style={{ minHeight: '65px' }}>
                {title}
            </Typography>
            <div className="flex flex-row flex-wrap mt-12 items-end">
                {/* Widget value */}
                <Typography className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tighter items-end mr-auto">
                    {/* {value} */}
                </Typography>
                <div className="flex flex-col">
                    {/* Widget unit */}
                    <Typography className="text-18 font-medium mb-24" color="textSecondary">
                        {unit}
                    </Typography>
                    {/* TODDO MYEM-2588*/}
                    {/* Widget arrow */}
                    {/* <Typography className="font-medium text-base" color="textSecondary">Arrow</Typography> */}
                </div>
            </div>
        </div>
    )
}

/**
 * Reusable widget component.
 *
 * @param root0 N/A.
 * @param root0.type Widget type.
 * @param root0.data Widget data.
 * @param root0.isMetricsLoading Widget loading indicator.
 * @returns Widget component.
 */
export const Widget = ({ type, data, isMetricsLoading }: IWidgetProps) => {
    const theme = useTheme()

    /**
     * Function that returns widget title and unit according to type.
     *
     * @param type Widget type.
     * @returns Title according to the widget type.
     */
    const renderWidgetAssets = (type: IWidgetProps['type']) => {
        let widgetTitle = ''
        let widgetUnit = ''

        // Render widget information according to the type from props.
        switch (type) {
            case 'consumption_metrics':
                widgetTitle = 'Consommation totale' as IWidgetAssets['title']
                widgetUnit = 'kWh' as IWidgetAssets['unit']
                return renderWidget(widgetTitle, widgetUnit)
            case 'enedis_max_power':
                widgetTitle = 'Puissance max' as IWidgetAssets['title']
                widgetUnit = 'kVa' as IWidgetAssets['unit']
                return renderWidget(widgetTitle, widgetUnit)
            case 'nrlink_internal_temperature_metrics':
                widgetTitle = 'Température intérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                return renderWidget(widgetTitle, widgetUnit)
            case 'external_temperature_metrics':
                widgetTitle = 'Température extérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                return renderWidget(widgetTitle, widgetUnit)
            default:
                break
        }
    }

    // If there is no data, the widget is not displayed.
    if (data.length === 0) return null

    return (
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
            <Card className="w-full rounded-20 shadow sm:m-4 " variant="outlined">
                {isMetricsLoading ? (
                    <div
                        className="flex flex-col justify-center items-center w-full h-full"
                        style={{ height: '170px' }}
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    renderWidgetAssets(type)
                )}
            </Card>
        </Grid>
    )
}
