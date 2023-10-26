import { IMetric } from 'src/modules/Metrics/Metrics.d'
import { ChartsAxisValuesType, YAxisChartSerie } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Convert dataPoints array that has the format [Yaxis, Xaxis][] where Yaxis and Xaxis are numbers, to Object {yAxisValues, xAxisValues}.
 *
 * @param dataPoints Array of datapoints in format [Yaxis, Xaxis][].
 * @returns Object {yAxisValues, xAxisValues}, data is in format number[] supported by Charts series data, categories in format number[] for options.xaxis.categories, to have a more flexible, beautiful chart.
 */
const getAxisValuesFromDatapoints = (
    dataPoints: IMetric['datapoints'],
): // eslint-disable-next-line jsdoc/require-jsdoc
{ yAxisValues: YAxisChartSerie['data']; xAxisValues: number[] } => {
    let xAxisValues: number[] = []

    const yAxisValues = dataPoints.map((dataPoint) => {
        xAxisValues.push(Math.ceil(dataPoint[1]))
        return dataPoint[0]
    })
    return { yAxisValues, xAxisValues }
}

/**
 * Pure Function to convertMetrics Data to Charts Axis Values (which consists of yAxisSeries representing for list of yAxis for each target, and categories for the XAxis).
 *
 * @param data Data of format IMetric[] that will be converted to IMetric[].
 * @returns Charts Axis Values.
 */
export const convertMetricsDataToChartsAxisValues = (data: IMetric[]): ChartsAxisValuesType => {
    let xAxisSeries: number[][] = []
    // We can have multiple yAxisSeries, for each target it'll have its own yAxis Series.
    let yAxisSeries: YAxisChartSerie[] = []

    data.forEach((metric) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        let axisValues: { yAxisValues: YAxisChartSerie['data']; xAxisValues: number[] } = {
            yAxisValues: [],
            xAxisValues: [],
        }
        if (metric.datapoints.length > 0) axisValues = getAxisValuesFromDatapoints(metric.datapoints)
        yAxisSeries!.push({
            name: metric.target,
            // Choosing to send data as yAxisValues of format number[], and xAxisValues in option.xaxis of Charts Options, let us take more control of the chart and have a more structured chart, (For example, in bar chart by giving options.xaxis.categories as xAxisValues and series.data as yAxisValues, will show each bar directly below its x value, when gave data as [number, number][] it shifted the bar from its x value).
            data: axisValues.yAxisValues,
        })
        /*
         * We'll save the xAxisValues for each target in xAxisSeries.
         */
        xAxisSeries.push(axisValues.xAxisValues)
    })

    return { xAxisSeries, yAxisSeries }
}
