import { IMetric } from 'src/modules/Metrics/Metrics.d'

/**
 * AnalysisMaxPowerProps.
 */
export interface AnalysisMaxPowerProps {
    /**
     * Metric data.
     */
    data: IMetric[]
    /**
     * Housing id.
     */
    housingId: number
}
