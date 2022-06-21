import { IMetrics } from 'src/modules/Metrics/Metrics'

/**
 * Convert dataPoints array that has the format [Yaxis, Xaxis][] where Yaxis and Xaxis are numbers, to Object {yAxisValues, xAxisValues}.
 *
 * @param dataPoints Array of datapoints in format [Yaxis, Xaxis][].
 * @returns Object {yAxisValues, xAxisValues}, data is in format number[] supported by apexCharts series data, categories in format number[] for options.xaxis.categories, to have a more flexible, beautiful chart.
 */
const getAxisValuesFromDatapoints = (
    dataPoints: IMetrics[0]['datapoints'],
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
 * Pure Function to convertMetrics Data to ApexCharts Axis Values (which consists of Series for the YAxis, and categories for the XAxis).
 *
 * @param data Data of format IMetrics that will be converted to IMetrics.
 * @returns ApexCharts Axis Values.
 */
export const convertMetricsDataToApexChartsAxisValues = (data: IMetrics) => {
    let categories: number[] = []
    let series: ApexAxisChartSeries = []

    data.forEach((metric: IMetrics[0]) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        let axisValues: { yAxisValues: number[]; xAxisValues: number[] } = {
            yAxisValues: [],
            xAxisValues: [],
        }
        if (metric.datapoints.length > 0) axisValues = getAxisValuesFromDatapoints(metric.datapoints)
        series!.push({
            name: metric.target,
            data: axisValues.yAxisValues,
        })
        // We'll have at the end of the loop the last xAxisValues as categories, because charts will have the same xAxis.
        categories = axisValues.xAxisValues
    })

    return { categories, series }
}
