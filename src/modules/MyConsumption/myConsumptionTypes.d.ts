/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * SetPeriod function.
     */
    setPeriod: (interval: string) => void
    /**
     * SetRange function.
     */
    setRange: (range: IRange) => void
    /**
     * SetPeriodValue function.
     */
    setPeriodValue: (period: number) => void
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
