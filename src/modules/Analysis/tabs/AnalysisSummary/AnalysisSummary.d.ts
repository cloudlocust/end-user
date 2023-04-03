import { IEnedisSgeConsent, INrlinkConsent } from 'src/modules/Consents/Consents'
import { IMetric, metricFiltersType, metricRangeType } from 'src/modules/Metrics/Metrics'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

/**
 * AnalysisSummary component Props.
 */
export interface AnalysisSummaryProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetric[] | []
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
    // eslint-disable-next-line jsdoc/require-jsdoc
    filters: metricFiltersType
    // eslint-disable-next-line jsdoc/require-jsdoc
    currentHousing: IHousing | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    nrlinkConsent?: INrlinkConsent
    // eslint-disable-next-line jsdoc/require-jsdoc
    enedisSgeConsent?: IEnedisSgeConsent
    // eslint-disable-next-line jsdoc/require-jsdoc
    hasMissingHousingContracts: boolean | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMetricsLoading: boolean
}
