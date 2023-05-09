import { metricFiltersType } from 'src/modules/Metrics/Metrics.d'

/**
 * Analysis comparison props.
 */
export interface AnalysisComparisonProps {
    /**
     * Monthly metrics raange.
     */
    monthlyRange: monthlyRange
    /**
     * Metrics filters.
     */
    filters: metricFiltersType
}
