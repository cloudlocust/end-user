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
/**
 * Interface ISelectMeters.
 */
interface ISelectMeters {
    /**
     * List of meters.
     */
    metersList: IMeter[]
    /**
     * Handling function when we change values.
     */
    handleOnChange: (event: SelectChangeEvent, setSelectedMeter: (value: string) => void) => void
    /**
     * Color for input: borders and svg.
     */
    inputColor?: string
    /**
     * Text color.
     */
    inputTextColor?: string
}
