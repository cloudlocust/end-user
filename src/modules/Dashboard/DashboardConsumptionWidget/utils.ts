import { IMetric } from 'src/modules/Metrics/Metrics'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { getXAxisCategoriesData } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { ApexOptions } from 'apexcharts'

/**
 * Generate labels and serieValues from the IMetric data to be passed to the ApexChart in the consumption widget.
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

/**
 * Create the ApexChart options object.
 *
 * @param lineColor Color of the chart line.
 * @param fillColor Background color of the chart.
 * @param categories Categories of the chart x axis.
 * @returns The ApexChart options object.
 */
export const getApexChartOptions = (lineColor: string, fillColor: string, categories: string[]): ApexOptions => ({
    chart: {
        animations: {
            enabled: false,
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'area',
        sparkline: {
            enabled: true,
        },
    },
    colors: [lineColor],
    fill: {
        colors: [fillColor],
        opacity: 0.5,
    },
    stroke: {
        curve: 'smooth',
    },
    tooltip: {
        followCursor: true,
        theme: 'dark',
    },
    xaxis: {
        type: 'category',
        categories,
    },
})
