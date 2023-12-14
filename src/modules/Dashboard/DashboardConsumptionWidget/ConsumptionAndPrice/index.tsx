import { ConsumptionAndPriceProps } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice/ConsumptionAndPrice'

/**
 * Component to show consumption and price values to use in the DashboardConsumptionWidget Component.
 *
 * @param root0 N/A.
 * @param root0.consumptionValue The consumption value.
 * @param root0.consumptionUnit The consumption value unit.
 * @param root0.priceValue The price value.
 * @param root0.priceUnit The price value unit.
 * @returns ConsumptionAndPrice Component.
 */
export const ConsumptionAndPrice = ({
    consumptionValue,
    consumptionUnit = 'kWh',
    priceValue,
    priceUnit = '€',
}: ConsumptionAndPriceProps) => {
    return (
        <div className="flex items-baseline gap-8 font-500 text-grey-800" data-testid="consumption-and-price">
            {/* The consumption */}
            <div>
                <span className="text-28">{consumptionValue}</span>
                <span className="text-12 ml-2">{consumptionUnit}</span>
            </div>
            {/* The price */}
            <div>
                <span className="text-36 font-400">{priceValue}</span>
                <span className="text-12 ml-2">{priceUnit}</span>
            </div>
        </div>
    )
}
