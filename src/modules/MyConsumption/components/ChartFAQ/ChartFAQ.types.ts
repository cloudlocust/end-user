import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * ChartFAQ Props.
 */
export type FAQProps =
    /**
     * ChartFAQ Props.
     */
    {
        /**
         * Period used to display the right FAQ.
         */
        period: PeriodEnum

        /**
         * Used to check if the user has tempo contract.
         */
        hasTempoContract: boolean
    }
