/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * SetMetricInterval function.
     */
    setMetricsInterval: (interval: metricIntervals) => void
    /**
     * SetRange function.
     */
    setRange: (range: metricRangeType) => void
    /**
     * SetPeriodValue function.
     */
    setPeriod: (period: periodValue) => void
    /**
     * Period to range.
     */
    range: metricRangeType
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
    setRange: (range: metricRangeType) => void
    /**
     * Period for range.
     */
    range: metricRangeType
}
/**
 * Type for views in MobileDatePicker.
 */
export type ViewsType = 'day' | 'month' | 'year'
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

/**
 * Represent the type return by apexChartsDataConverter.
 */
export type ApexChartsAxisValuesType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Represent the yAxisValues for each target, as ApexChartSerie.
         */
        yAxisSeries: ApexAxisChartSeries
        /**
         * Represent the xAxisValues for each target.
         */
        xAxisSeries: number[][]
    }
