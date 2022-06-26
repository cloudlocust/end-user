import { Card, Typography, CircularProgress } from '@mui/material'
import { IWidgetAssets, IWidgetProps } from 'src/modules/MyConsumption/components/Widgets/Widget'
import { useTheme } from '@mui/material'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { IMetric } from 'src/modules/Metrics/Metrics'
import {
    calculateAverage,
    calculateMaxNumber,
    calculateSum,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import Grid from '@mui/material/Grid'

/**
 * Function to get the values from data.
 *
 * @param data Data.
 * @returns Array of values.
 */
const getValuesFromData = (data: IMetric[]): number[] => {
    // The values to be used in the widget are the values of the Y axis in the chart.
    const { yAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)
    let values: number[] = []
    yAxisSeries.forEach((el) => el.data.forEach((number) => values.push(number as number)))

    return values
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
     * Function that return value according to the type of widget.
     *
     * @param type Type from props.
     * @param data Data from props.
     * @returns Data according to widget type.
     */
    const getValueAccordingToWidgetType = (type: IWidgetProps['type'], data: IWidgetProps['data']) => {
        let values: number[]
        let totalConsumption: number
        let maxPower: number
        let averageInteranalTemp: number
        let averageExternalTemp: number

        switch (type) {
            case 'consumption_metrics':
                values = getValuesFromData(data)
                totalConsumption = calculateSum(values)
                return totalConsumption
            case 'enedis_max_power':
                values = getValuesFromData(data)
                maxPower = calculateMaxNumber(values)
                return maxPower
            case 'external_temperature_metrics':
                values = getValuesFromData(data)
                averageExternalTemp = calculateAverage(values)
                return averageExternalTemp
            case 'nrlink_internal_temperature_metrics':
                values = getValuesFromData(data)
                averageInteranalTemp = calculateAverage(values)
                return averageInteranalTemp
            default:
                return
        }
    }

    /**
     * Function that returns widget title, unit, and value according to type.
     *
     * @param type Widget type.
     * @param element Widget elements like title, unit.
     * @returns Title according to the widget type.
     */
    const renderWidgetAssets = (type: IWidgetProps['type'], element: 'title' | 'unit' | 'value') => {
        let widgetTitle!: string
        let widgetUnit!: string
        let widgetValue!: number
        // Render widget information according to the type from props.
        switch (type) {
            case 'consumption_metrics':
                widgetTitle = 'Consommation totale' as IWidgetAssets['title']
                widgetUnit = 'kWh' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('consumption_metrics', data) as number
                break
            case 'enedis_max_power':
                widgetTitle = 'Puissance max' as IWidgetAssets['title']
                widgetUnit = 'kVa' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('enedis_max_power', data) as number
                break
            case 'nrlink_internal_temperature_metrics':
                widgetTitle = 'Température intérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('nrlink_internal_temperature_metrics', data) as number
                break
            case 'external_temperature_metrics':
                widgetTitle = 'Température extérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('external_temperature_metrics', data) as number
                break
            default:
                break
        }

        // Render asset according to the element.
        switch (element) {
            case 'title':
                return widgetTitle
            case 'unit':
                return widgetUnit
            case 'value':
                return widgetValue
            default:
                break
        }
    }

    // If there is no data, the widget is not displayed.
    if (data.length === 0) return null

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Card className="w-full rounded-20 shadow my-8 mx-6 sm:m-4">
                {isMetricsLoading ? (
                    <div
                        className="flex flex-col justify-center items-center w-full h-full"
                        style={{ minHeight: '200px' }}
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <div className="p-12">
                        <Typography className="h4 font-medium" style={{ minHeight: '65px' }}>
                            {renderWidgetAssets(type, 'title')}
                        </Typography>
                        <div className="flex flex-row flex-wrap mt-12">
                            {/* Widget value */}
                            <Typography className="text-5xl font-normal leading-none tracking-tighter items-center mr-auto">
                                {renderWidgetAssets(type, 'value')}
                            </Typography>
                            <div className="flex flex-col mx-8 ml-auto">
                                {/* Widget unit */}
                                <Typography className="font-medium text-base mb-8" color="textSecondary">
                                    {renderWidgetAssets(type, 'unit')}
                                </Typography>
                                {/* TODDO MYEM-2588*/}
                                {/* Widget arrow */}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </Grid>
    )
}
