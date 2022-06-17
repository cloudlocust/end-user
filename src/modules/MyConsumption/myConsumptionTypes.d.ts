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
/**
 * Interface IMyConsumptionSelectMeters.
 */
interface IMyConsumptionSelectMeters {
    /**
     * List of meters.
     */
    metersList: IMeter[]
    /**
     * SetFilters function.
     */
    setFilters: (value: metricFilters) => void
}
/**
 * Interface for TargetButtonGroup.
 */
interface ITargetButtonGroup {
    /**
     * RemoveTarget.
     */
    removeTarget: (target: metricTarget) => void
    /**
     * AddTarget.
     */
    addTarget: (target: metricTarget) => void
    /**
     * If hidePmax exists Pmax button will be disabled.
     */
    hidePmax: boolean
}
