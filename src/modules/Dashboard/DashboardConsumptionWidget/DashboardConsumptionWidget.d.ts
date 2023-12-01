import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * DashboardConsumptionWidget props.
 */
export interface DashboardConsumptionWidgetProps {
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
