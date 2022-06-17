/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * SetMetricInterval function.
     */
    setMetricInterval: (interval: metricIntervals) => void
    /**
     * SetRange function.
     */
    setRange: (range: metricRange) => void
    /**
     * SetPeriodValue function.
     */
    setPeriod: (period: periodValue) => void
}
/**
 * Range value type.
 *
 */
export type periodValue = 1 | 7 | 30 | 365
