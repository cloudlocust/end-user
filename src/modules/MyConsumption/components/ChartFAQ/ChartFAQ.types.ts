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
         * House id used to get it contracts.
         */
        housingId: number
    }
