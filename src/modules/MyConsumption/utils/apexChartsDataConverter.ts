import { ApexAxisChartSerie, IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ApexChartsAxisValuesType, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { isEmptyMetricsData } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

/**
 * Convert dataPoints array that has the format [Yaxis, Xaxis][] where Yaxis and Xaxis are numbers, to Object {yAxisValues, xAxisValues}.
 *
 * @param dataPoints Array of datapoints in format [Yaxis, Xaxis][].
 * @returns Object {yAxisValues, xAxisValues}, data is in format number[] supported by apexCharts series data, categories in format number[] for options.xaxis.categories, to have a more flexible, beautiful chart.
 */
const getAxisValuesFromDatapoints = (
    dataPoints: IMetric['datapoints'],
): // eslint-disable-next-line jsdoc/require-jsdoc
{ yAxisValues: ApexAxisChartSerie['data']; xAxisValues: number[] } => {
    let xAxisValues: number[] = []

    const yAxisValues = dataPoints.map((dataPoint) => {
        xAxisValues.push(Math.ceil(dataPoint[1]))
        return dataPoint[0]
    })
    return { yAxisValues, xAxisValues }
}

/**
 * Pure Function to convertMetrics Data to ApexCharts Axis Values (which consists of yAxisSeries representing for list of yAxis for each target, and categories for the XAxis).
 *
 * @param data Data of format IMetric[] that will be converted to IMetric[].
 * @returns ApexCharts Axis Values.
 */
export const convertMetricsDataToApexChartsAxisValues = (data: IMetric[]): ApexChartsAxisValuesType => {
    let xAxisSeries: number[][] = []
    // We can have multiple yAxisSeries, for each target it'll have its own yAxis Series.
    let yAxisSeries: ApexAxisChartSeries = []

    data.forEach((metric) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        let axisValues: { yAxisValues: ApexAxisChartSerie['data']; xAxisValues: number[] } = {
            yAxisValues: [],
            xAxisValues: [],
        }
        if (metric.datapoints.length > 0) axisValues = getAxisValuesFromDatapoints(metric.datapoints)
        yAxisSeries!.push({
            name: metric.target,
            // Choosing to send data as yAxisValues of format number[], and xAxisValues in option.xaxis of ApexCharts Options, let us take more control of the chart and have a more structured chart, (For example, in bar chart by giving options.xaxis.categories as xAxisValues and series.data as yAxisValues, will show each bar directly below its x value, when gave data as [number, number][] it shifted the bar from its x value).
            data: axisValues.yAxisValues,
        })
        /*
         * We'll save the xAxisValues for each target in xAxisSeries.
         */
        xAxisSeries.push(axisValues.xAxisValues)
    })

    return { xAxisSeries, yAxisSeries }
}

/**
 * Pure Function to convert metrics datapoints format to ApexCharts datapoints format (adapted for datetime xAxis).
 *
 * Doc here: https://apexcharts.com/react-chart-demos/area-charts/datetime-x-axis .
 *
 * ApexCharts Performance is much faster when using datetime xAxis.
 *
 * @example Metric datapoints (input) [[val1, timestamp1], [val2, timestamp2], ...] => ApexCharts datapoints (output) [[timestamp1, val1], [timestamp2, val2], ...].
 * @param data Data of format IMetric[] that will be converted .
 * @param period Period.
 * @returns ApexCharts datapoints format (adapted for datetime xAxis).
 */
export const convertMetricsDataToApexChartsDateTimeAxisValues = (
    data: IMetric[],
    period?: periodType,
): ApexAxisChartSeries => {
    // We can have multiple yAxisSeries (datapoints), for each target it'll have its own yAxis Series (datapoints).
    let apexChartsSeries: ApexAxisChartSeries = []

    // TODO: move this to a better place.
    // Filter apexChartsSeries accprding to base consumption.
    // If base consumption has data, then we filter HP HC targets.
    // If base doesn't have data then we assiume that user has HP HC contract.
    const isBaseConsumptionDataEmpty = isEmptyMetricsData(data, [metricTargetsEnum.baseConsumption])

    for (const metric of data) {
        let metricApexChartsDatapoints: ApexAxisChartSerie['data'] = metric.datapoints.map((datapoint) => {
            // Typing [number, number], because typescript infer [datapoint[1], datapoint[0]] as number[].
            // Thus typescript will infer metricApexChartsDatapoints as number[][], but we typed metricApexChartsDatapoints: ApexAxisChartSerie['data'].
            // And ApexAxisChartSerie['data'] type is [number, number][].
            // We force the typing in order not to let typescript infer and cause typing conflict between ApexAxisChartSerie['data'] which is of type [number, number][], and metricApexChartsDatapoints that'll be infered as number[][] which to typescript number[][] and [number, number][] are conflicting types.
            return [datapoint[1], datapoint[0]] as [number, number]
        })

        apexChartsSeries!.push({
            name: metric.target,
            data: metricApexChartsDatapoints,
        })
    }

    // Check if data has subscriptionPrices target in it, then we reverse the data array so that we see subscriptionPrices at the bottom of the stacked bar chart.
    if (data.some((target) => target.target === metricTargetsEnum.subscriptionPrices)) {
        return apexChartsSeries.reverse()
    }

    // TODO: move this to a better place.
    if (isBaseConsumptionDataEmpty && period === 'daily') {
        return apexChartsSeries.filter(
            (serie) =>
                serie.name === metricTargetsEnum.consumption ||
                serie.name === metricTargetsEnum.autoconsumption ||
                serie.name === metricTargetsEnum.peakHourConsumption ||
                serie.name === metricTargetsEnum.offPeakHourConsumption ||
                serie.name === metricTargetsEnum.externalTemperature ||
                serie.name === metricTargetsEnum.internalTemperature,
        )
    }

    if (!isBaseConsumptionDataEmpty && period === 'daily') {
        return apexChartsSeries.filter(
            (serie) =>
                serie.name === metricTargetsEnum.baseConsumption ||
                serie.name === metricTargetsEnum.autoconsumption ||
                serie.name === metricTargetsEnum.consumption ||
                serie.name === metricTargetsEnum.externalTemperature ||
                serie.name === metricTargetsEnum.internalTemperature,
        )
    }

    return apexChartsSeries
}
