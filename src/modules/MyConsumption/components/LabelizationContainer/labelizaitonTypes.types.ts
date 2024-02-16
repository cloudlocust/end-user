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
         * Total consumption in that time range (in kWh).
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
