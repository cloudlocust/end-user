import { Float } from 'type-fest'

/**
 * The types of intervals that exists for the consumption alerts.
 */
export type ConsumptionAlertIntervalsType = 'day' | 'week' | 'month'

/**
 * Consumption alert data.
 */
export interface ConsumptionAlertData {
    /**
     * Price.
     */
    price: Float | null
    /**
     * Consumption.
     */
    consumption: Float | null
}

/**
 * Consumption Alert.
 */
export interface IConsumptionAlert extends ConsumptionAlertData {
    /**
     * Interval of consumption.
     */
    interval: ConsumptionAlertIntervalsType
}
