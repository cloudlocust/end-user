import { metricFiltersType, metricIntervalType, metricRangeType, IMetric } from 'src/modules/Metrics/Metrics'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Props for the EurosConsumptionButtonToggler component.
 */
export type EurosConsumptionButtonTogglerProps =
    /**
     * EurosConsumptionButtonToggler Props.
     */
    {
        /**
         * Callback function called when the value changes.
         *
         * @param value - The new value.
         */
        onChange: (value: boolean) => void
        /**
         * The current value.
         */
        value: boolean
        /**
         * The period for the consumption data.
         */
        period: PeriodEnum
        /**
         * The range for the consumption data.
         */
        range: metricRangeType
        /**
         * The filters for the consumption data.
         */
        filters: metricFiltersType
        /**
         * The interval for the metrics.
         */
        metricsInterval: metricIntervalType
        /**
         * The metrics data.
         */
        dataMetrics: IMetric[]
    }
