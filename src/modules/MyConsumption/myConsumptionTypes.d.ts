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
export interface IMyConsumptionDatePicker {
    /**
     * Period range.
     */
    period: periodValueType
    /**
     * SetRange function.
     */
    setRange: (range: metricRange) => void
    /**
     * Period for range.
     */
    range: metricRange
}
/**
 * Type for views in MobileDatePicker.
 */
export type ViewsType = 'day' | 'month' | 'year'
/**
 * Represent the type return by apexChartsDataConverter.
 */
export type ApexChartsAxisValuesType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    { yAxisSeries: ApexAxisChartSerie['data']; xAxisValues: number[] }
