/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * SetMetricInterval function.
     */
    setMetricsInterval: (interval: metricIntervals) => void
    /**
     * SetPeriodValue function.
     */
    setPeriod: (period: periodValue) => void
}
/**
 * Range value type.
 *
 */
export type periodType = 'daily' | 'weekly' | 'monthly' | 'yearly'
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
/**
 * Interface IMyConsumptionCalendar.
 */
export interface IMyConsumptionCalendar {
    /**
     * Period range.
     */
    period: periodValueType
    /**
     * SetRange function.
     */
    setRange: (range: metricRange) => void
}
/**
 * Type for views in MobileDatePicker.
 */
export type ViewsType = 'day' | 'month' | 'year'

/**
 * Interface for InputStyles.
 */
export interface IInputStyles {
    /**
     * Color.
     */
    color: string
    /**
     * Width.
     */
    width: string
}
