/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * OnChange function.
     */
    onChange: (interval: string, range: IRange) => void
}
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
