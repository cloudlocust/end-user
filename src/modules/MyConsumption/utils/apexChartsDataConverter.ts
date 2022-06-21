import { IMetric, IMetrics } from 'src/modules/Metrics/Metrics'

/**
 * Convert dataPoints array that has the format [Yaxis, Xaxis][] where Yaxis and Xaxis are numbers, to Object {yAxisValues, xAxisValues}.
 *
 * @param dataPoints Array of datapoints in format [Yaxis, Xaxis][].
 * @returns Object {yAxisValues, xAxisValues}, data is in format number[] supported by apexCharts series data, categories in format number[] for options.xaxis.categories, to have a more flexible, beautiful chart.
 */
const getAxisValuesFromDatapoints = (
    dataPoints: IMetric['datapoints'],
): // eslint-disable-next-line jsdoc/require-jsdoc
{ yAxisValues: number[]; xAxisValues: number[] } => {
    let xAxisValues: number[] = []

    const yAxisValues = dataPoints.map((dataPoint) => {
        xAxisValues.push(dataPoint[1])
        return dataPoint[0]
    })
    return { yAxisValues, xAxisValues }
}

/**
 * Pure Function to convertMetrics Data to ApexCharts Axis Values (which consists of yAxisSeries representing for list of yAxis for each target, and categories for the XAxis).
 *
 * @param data Data of format IMetrics that will be converted to IMetrics.
 * @returns ApexCharts Axis Values.
 */
export const convertMetricsDataToApexChartsAxisValues = (data: IMetrics) => {
    let xAxisValues: number[] = []
    // We can have multiple yAxisSeries, for each target it'll have its own yAxis Series.
    let yAxisSeries: ApexAxisChartSeries = []

    data.forEach((metric) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        let axisValues: { yAxisValues: number[]; xAxisValues: number[] } = {
            yAxisValues: [],
            xAxisValues: [],
        }
        if (metric.datapoints.length > 0) axisValues = getAxisValuesFromDatapoints(metric.datapoints)
        yAxisSeries!.push({
            name: metric.target,
            data: axisValues.yAxisValues,
        })
        // We'll have at the end of the loop the last xAxisValues as categories, because charts will have the same xAxis.
        xAxisValues = axisValues.xAxisValues
    })

    return { xAxisValues, yAxisSeries }
}
