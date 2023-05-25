import { metricFiltersType } from 'src/modules/Metrics/Metrics.d'

/**
 * AnalysisIdleConsumption Props.
 */
export interface AnalysisIdleConsumptionProps {
    /**
     * Total consumption data.
     */
    totalConsumption: number
    /**
     * Metrics range.
     */
    range: metricRangeType
    /**
     * Metrics filters.
     */
    filters: metricFiltersType
}
