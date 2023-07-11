import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 *
 */
export interface ConsumptionWidgetsContainerProps {
    /**
     * Metrics filters.
     */
    filters: metricFiltersType
    /**
     * Metrics interval.
     */
    metricsInterval: metricIntervalType
    /**
     * Metrics range.
     */
    range: metricRangeType
    /**
     * Period type.
     */
    period: periodType
    /**
     * Boolean for Missing Housing Contracts.
     */
    hasMissingHousingContracts: boolean | null
    /**
     * Boolean for Enphase Consent is inactive.
     */
    enphaseOff: boolean
    /**
     * Boolean for EnedisSge Consent is not Connected.
     */
    enedisOff: boolean
}
