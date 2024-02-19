import { IEnedisSgeConsent } from 'src/modules/Consents/Consents.d'
import { metricFiltersType, metricIntervalType, metricRangeType } from 'src/modules/Metrics/Metrics'
import { IEquipmentMeter } from 'src/modules/MyHouse/components/Installation/InstallationType'

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
         * The label start date.
         */
        startDate: string
        /**
         * The label end date.
         */
        endDate: string
        /**
         * Total consumption in that time range (in Wh).
         */
        consumption: number
        /**
         * Price of the total consumption in that time range.
         */
        consumptionPrice: number
        /**
         * The type of use for the equipment.
         */
        useType?: string | null
        /**
         * The equipment associated to the label.
         */
        housingEquipment: IEquipmentMeter
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
         * Enedis Sge consent.
         */
        enedisSgeConsent?: IEnedisSgeConsent
        /**
         * Set Range.
         */
        setRange: (range: metricRangeType) => void
    }

/**
 * Type for the fields of the add activity form.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type addActivityFormFieldsType = {
    /**
     * The label start date.
     */
    startDate: string
    /**
     * The label end date.
     */
    endDate: string
    /**
     * The type of use for the equipment.
     */
    useType?: string | null
    /**
     * The id of the housing equipment associated to the label.
     */
    housingEquipmentId: number
}

/**
 * Type of the body object to be passed with the post request to add an activity.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type addActivityRequestBodyType = addActivityFormFieldsType & {
    /**
     * Total consumption in that time range (in Wh).
     */
    consumption: number
    /**
     * Price of the total consumption in that time range.
     */
    consumptionPrice: number
}
