import { sum } from 'lodash'
import { IMetric } from 'src/modules/Metrics/Metrics'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { getXAxisCategoriesData } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { ApexOptions } from 'apexcharts'
import { convertConsumptionToWatt } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

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
    const serieValues: number[] = Object.values(values).length
        ? Object.values(values)[0].map((value) => value ?? 0)
        : [0]
    return { labels, serieValues }
}

/**
 * Calculate the total consumption and price for a consumption serie values.
 *
 * @param serieValues Consumption values in Wh.
 * @param pricePerKwh Price per kWh.
 * @returns The total daily consumption and price.
 */
export const calculateTotalConsumptionAndPrice = (serieValues: number[], pricePerKwh: number | null) => {
    const sumConsumptions = sum(serieValues)
    const { value: totalDailyConsumption, unit: consumptionUnit } = consumptionWattUnitConversion(sumConsumptions)
    const totalDailyPrice = pricePerKwh ? Number(((sumConsumptions * pricePerKwh) / 1000).toFixed(2)) : 0
    return { totalDailyConsumption, consumptionUnit, totalDailyPrice }
}

/**
 * Create the ApexChart options object.
 *
 * @param lineColor Color of the chart line.
 * @param fillColor Background color of the chart.
 * @param categories Categories of the chart x axis.
 * @param metricInterval The interval of the metric data.
 * @returns The ApexChart options object.
 */
export const getApexChartOptions = (
    lineColor: string,
    fillColor: string,
    categories: string[],
    metricInterval: '1m' | '30m',
): ApexOptions => ({
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
    yaxis: {
        show: false,
        labels: {
            /**
             * Function to converts consumption from Wh to Watt.
             *
             * @param serieValue Consumption value in Wh.
             * @returns Consumption value in Watt.
             */
            formatter: (serieValue: number): string => convertConsumptionToWatt(serieValue, false, metricInterval),
        },
    },
})
