import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * The totalDailyConsumption state type.
 */
export interface ConsumptionStatisticsType {
    /**
     * The total consumption value.
     */
    value: number
    /**
     * The consumption value unit.
     */
    unit: totalConsumptionUnits
}
