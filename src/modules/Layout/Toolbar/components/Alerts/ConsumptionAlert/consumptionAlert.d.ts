/**
 * Response object when gitting price per kwh.
 */
export interface IPricePerKwhDataType {
    /**
     * Price per kwh.
     */
    pricePerKwh: number
}

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
    price: number | null
    /**
     * Consumption.
     */
    consumption: number | null
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
