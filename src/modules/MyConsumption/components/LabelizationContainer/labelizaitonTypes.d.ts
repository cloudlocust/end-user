import { IEnedisSgeConsent } from 'src/modules/Consents/Consents.d'
import { metricFiltersType, metricIntervalType, metricRangeType } from 'src/modules/Metrics/Metrics'

/**
 * Consumption label data type.
 */
export type ConsumptionLabelDataType =
    /**
     *
     */
    {
        /**
         * Id of the label.
         */
        id: number
        /**
         * Label name.
         */
        name: string
        /**
         * Start time.
         */
        startTime: string
        /**
         * End time.
         */
        endTime: string
        /**
         * Consumption consumed in that time range.
         */
        consumption: number
        /**
         * Price consumed in that time range.
         */
        price: number
    }

/**
 * Type for consumption labelization container props.
 */
export type SimplifiedConsumptionChartContainerPropsType =
    /**
     *
     */
    {
        /**
         * Range.
         */
        range: metricRangeType
        /**
         * Metrics interval.
         */
        metricsInterval: metricIntervalType
        /**
         * Filters.
         */
        filters: metricFiltersType
        /**
         * Is production consent off.
         */
        isSolarProductionConsentOff: boolean
        /**
         * Enedis Sge consent.
         */
        enedisSgeConsent?: IEnedisSgeConsent
        /**
         * Set Range.
         */
        setRange: (range: metricRangeType) => void
    }
