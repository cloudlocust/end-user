import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * ConsumptionAndPrice props.
 */
export interface ConsumptionAndPriceProps {
    /**
     * The consumption value.
     */
    consumptionValue: number
    /**
     * The consumption value unit.
     */
    consumptionUnit?: totalConsumptionUnits
    /**
     * The price value.
     */
    priceValue: number
    /**
     * The price value unit.
     */
    priceUnit?: string
}
