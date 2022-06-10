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
