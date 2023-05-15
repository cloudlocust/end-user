import { IMetric } from 'src/modules/Metrics/Metrics.d'

/**
 * AnalysisIdleConsumption Props.
 */
export interface AnalysisIdleConsumptionProps {
    /**
     * Metrics data.
     */
    data: IMetric[]
    /**
     * Total consumption in month.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    totalConsumption: {
        /**
         * TotalConsumption value.
         */
        value: number
        /**
         * TotalConsumption unit.
         */
        unit: string
    }
}
