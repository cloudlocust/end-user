import { Card, Typography, CircularProgress } from '@mui/material'
import { IWidgetAssets, IWidgetProps } from 'src/modules/MyConsumption/components/Widgets/Widget'
import { useTheme } from '@mui/material'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { IMetric } from 'src/modules/Metrics/Metrics'
import { calculateSum } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

const WIDGET_MAX_WIDTH = '170px'
const WIDGET_MAX_HEIGHT = '180px'

/**
 * Function to get the values from data.
 *
 * @param data Data.
 * @returns Array of values.
 */
const getValuesFromData = (data: IMetric[]) => {
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
        let totalConsumption: number = 0
        let maxPower: number = 0
        let averageInteranalTemp: number = 0
        let averageExternalTemp: number = 0

        if (type === 'consumption_metrics' && data.find((el) => el.target === type)) {
            const values = getValuesFromData(data)
            totalConsumption = calculateSum(values)
        }

        switch (type) {
            case 'consumption_metrics':
                return totalConsumption
            case 'enedis_max_power':
                return maxPower
            case 'external_temperature_metrics':
                return averageExternalTemp
            case 'nrlink_internal_temperature_metrics':
                return averageInteranalTemp
        }
    }

    /**
     * Function that returns widget title and unit according to type.
     *
     * @param type Widget type.
     * @param element Widget elements like title, unit.
     * @returns Title according to the widget type.
     */
    const renderWidgetAssets = (type: IWidgetProps['type'], element: 'title' | 'unit' | 'value') => {
        let widgetTitle: string = ''
        let widgetUnit: string = ''
        let widgetValue: number = 0
        // Render widget information according to the type from props.
        switch (type) {
            case 'consumption_metrics':
                widgetTitle = 'Consommation totale' as IWidgetAssets['title']
                widgetUnit = 'kWh' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('consumption_metrics', data)
                break
            case 'enedis_max_power':
                widgetTitle = 'Puissance max' as IWidgetAssets['title']
                widgetUnit = 'kVa' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('enedis_max_power', data)
                break
            case 'nrlink_internal_temperature_metrics':
                widgetTitle = 'Température intérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('nrlink_internal_temperature_metrics', data)
                break
            case 'external_temperature_metrics':
                widgetTitle = 'Température extérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('external_temperature_metrics', data)
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

    if (data.length === 0) return null

    return (
        <Card
            className="w-full rounded-20 shadow my-8 mx-6 sm:m-4"
            style={{ maxWidth: WIDGET_MAX_WIDTH, maxHeight: WIDGET_MAX_HEIGHT }}
        >
            {isMetricsLoading && (
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <CircularProgress style={{ color: theme.palette.primary.main }} />
                </div>
            )}
            <div className="p-16">
                <Typography className="h4 font-medium" style={{ minHeight: '65px' }}>
                    {renderWidgetAssets(type, 'title')}
                </Typography>
                <div className="flex flex-row flex-wrap mt-12">
                    {/* Widget value */}
                    <Typography className="text-6xl font-normal leading-none tracking-tighter items-center mx-auto">
                        {renderWidgetAssets(type, 'value')}
                    </Typography>
                    <div className="flex flex-col mx-8 ml-auto">
                        {/* Widget unit */}
                        <Typography className="font-medium text-base mb-8" color="textSecondary">
                            {renderWidgetAssets(type, 'unit')}
                        </Typography>
                        {/* Widget arrow */}
                    </div>
                </div>
            </div>
        </Card>
    )
}
