/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * SetPeriod function.
     */
    setPeriod: (interval: metricIntervals) => void
    /**
     * SetRange function.
     */
    setRange: (range: metricRange) => void
    /**
     * SetPeriodValue function.
     */
    setPeriodValue: (period: periodValue) => void
}
/**
 * Range value type.
 *
 */
export type periodValue = 1 | 7 | 30 | 365
