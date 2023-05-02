import { IEnedisSgeConsent } from 'src/modules/Consents/Consents'
import { IMetric, metricRangeType } from 'src/modules/Metrics/Metrics.d'

/**
 * Analysis comparison props.
 */
export interface AnalysisComparisonProps {
    /**
     * Metrics data.
     */
    data: IMetric[]
    /**
     * Enedis sge consent state.
     */
    enedisSgeConsent?: IEnedisSgeConsent
    /**
     * Metrics range.
     */
    range: metricRangeType
}
