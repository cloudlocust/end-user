import { IEnedisSgeConsent, INrlinkConsent } from 'src/modules/Consents/Consents'
import { IMetric, metricFiltersType, metricRangeType } from 'src/modules/Metrics/Metrics'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

/**
 * AnalysisSummary component Props.
 */
export interface AnalysisSummaryProps {
    /**
     * Metrics data.
     */
    data: IMetric[] | []
    /**
     * Metrics range.
     */
    range: metricRangeType
    /**
     * Metrics filters.
     */
    filters: metricFiltersType
    /**
     * Current housing from redux state.
     */
    currentHousing: IHousing | null
    /**
     * Nrlink consent state.
     */
    nrlinkConsent?: INrlinkConsent
    /**
     * Enedis consent state.
     */
    enedisSgeConsent?: IEnedisSgeConsent
    /**
     * MissingHousingContracts state.
     */
    hasMissingHousingContracts: boolean | null
    /**
     * Metrics loading state.
     */
    isMetricsLoading: boolean
}
