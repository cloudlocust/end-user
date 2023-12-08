import { sum } from 'lodash'
import { IMetric } from 'src/modules/Metrics/Metrics'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { getXAxisCategoriesData } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

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
    const serieValues: number[] = Object.values(values).length
        ? Object.values(values)[0].map((value) => value ?? 0)
        : [0]
    return { labels, serieValues }
}

/**
 * Calculate the total daily consumption and price.
 *
 * @param serieValues Consumption values in Wh.
 * @param pricePerKwh Price per kWh.
 * @returns The total daily consumption and price.
 */
export const calculateTotalDailyConsumptionAndPrice = (serieValues: number[], pricePerKwh: number | null) => {
    const sumConsumptions = sum(serieValues)
    const { value: totalDailyConsumption, unit: consumptionUnit } = consumptionWattUnitConversion(sumConsumptions)
    const totalDailyPrice = pricePerKwh ? Number(((sumConsumptions * pricePerKwh) / 1000).toFixed(2)) : 0
    return { totalDailyConsumption, consumptionUnit, totalDailyPrice }
}
