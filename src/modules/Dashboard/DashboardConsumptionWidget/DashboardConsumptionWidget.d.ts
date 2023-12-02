import { getMetricsWithParamsType } from 'src/modules/Metrics/Metrics'
import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * DashboardConsumptionWidget props.
 */
export interface DashboardConsumptionWidgetProps {
    /**
     * Function to get Metrics.
     */
    getMetricsWithParams: (params: getMetricsWithParamsType) => Promise<any>
    /**
     * Is Metrics getting is in progress.
     */
    isMetricsLoading: boolean
    /**
     * Metrics intervals.
     */
    metricInterval: '1m' | '30m'
    /**
     * Price per kWh.
     */
    pricePerKwh: number | null
}

/**
 * The totalDailyConsumption state type.
 */
export interface totalDailyConsumptionType {
    /**
     * The total consumption value.
     */
    value: number
    /**
     * The consumption value unit.
     */
    unit: totalConsumptionUnits
}
