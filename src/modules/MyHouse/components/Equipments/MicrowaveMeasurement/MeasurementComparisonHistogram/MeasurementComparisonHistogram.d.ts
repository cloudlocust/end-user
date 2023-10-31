/**
 * Props for the HistogramBarIcon component.
 */
export interface HistogramBarIconProps {
    /**
     * The icon element to use.
     */
    icon: JSX.Element
}

/**
 * Props for the HistogramBar component.
 */
export interface HistogramBarProps {
    /**
     * Boolean indicate if the histogram bar is for the average consumption or not (for the user consumption).
     */
    isAverageConsumption?: boolean
    /**
     * The value of the consumption (in Watt).
     */
    consumptionValue: number
    /**
     * The other consumption value  (in Watt, if isAverageConsumption is true it's the user consumption, else it's the average consumption).
     */
    height: number
}

/**
 * Props for the MeasurementComparisonHistogram component.
 */
export interface MeasurementComparisonHistogramProps {
    /**
     * The value of the user consumption in Watt.
     */
    userConsumption: number
    /**
     * The value of the average consumption in Watt.
     */
    averageConsumption: number
}
