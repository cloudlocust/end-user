/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * OnHandleMetricsChange function.
     */
    onHandleMetricsChange: (interval: string, range: IRange) => void
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
