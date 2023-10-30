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
     * The value of the consumption.
     */
    consumptionValue: number
    /**
     * The other consumption value (if isAverageConsumption is true it's the user consumption, else it's the average consumption).
     */
    otherConsumptionValue: number
}
