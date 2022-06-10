/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * SetPeriod function.
     */
    setPeriod: any
    /**
     * SetRange function.
     */
    setRange: (range: IRange) => void
    /**
     * SetPeriodValue function.
     */
    setPeriodValue: any
}
//TODO to remove
/**
 * Range selection interface.
 */
interface IRange {
    /**
     * Date from which the range is selected.
     */
    from: string
    /**
     * Date to which the range is selected.
     */
    to: string
}

/**
 * Range value type.
 *
 */
export type periodValue = 1 | 7 | 30 | 365
