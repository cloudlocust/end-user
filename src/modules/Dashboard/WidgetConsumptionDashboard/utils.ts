import { IMetric } from 'src/modules/Metrics/Metrics'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { getXAxisCategoriesData } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'

/**
 * Create the data for the consumption widget graph.
 *
 * @param data Metric data.
 * @returns The label and serieValues arrays.
 */
export const createDataForConsumptionWidgetGraph = (data: IMetric[]) => {
    const { values, timestamps } = formatMetricsDataToTimestampsValues(data)
    const xAxisTimestamps = Object.values(timestamps).length ? Object.values(timestamps)[0] : [0]
    const labels: string[] = getXAxisCategoriesData(xAxisTimestamps, 'daily')
    const serieValues: number[] = Object.values(values).length ? Object.values(values)[0] : [0]
    return { labels, serieValues }
}
