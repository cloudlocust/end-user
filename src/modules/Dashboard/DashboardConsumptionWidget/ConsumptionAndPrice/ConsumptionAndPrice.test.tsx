import { render } from '@testing-library/react'
import { ConsumptionAndPrice } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice'
import { ConsumptionAndPriceProps } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice/ConsumptionAndPrice'

const CONSUMPTION_VALUE = 5984
const PRICE_VALUE = 124
const DEFAULT_CONSUMPTION_UNIT = 'kWh'
const DEFAULT_PRICE_UNIT = '€'
const CUSTOM_CONSUMPTION_UNIT = 'Wh'
const CUSTOM_PRICE_UNIT = '$'

describe('ConsumptionAndPrice', () => {
    let mockConsumptionAndPriceProps: ConsumptionAndPriceProps

    beforeEach(() => {
        mockConsumptionAndPriceProps = {
            consumptionValue: CONSUMPTION_VALUE,
            priceValue: PRICE_VALUE,
        }
    })

    test('renders the component with values and default units', () => {
        const { getByText } = render(<ConsumptionAndPrice {...mockConsumptionAndPriceProps} />)

        expect(getByText(CONSUMPTION_VALUE)).toBeInTheDocument()
        expect(getByText(PRICE_VALUE)).toBeInTheDocument()
        expect(getByText(DEFAULT_CONSUMPTION_UNIT)).toBeInTheDocument()
        expect(getByText(DEFAULT_PRICE_UNIT)).toBeInTheDocument()
    })

    test('renders the component with custom units', () => {
        mockConsumptionAndPriceProps = {
            ...mockConsumptionAndPriceProps,
            consumptionUnit: CUSTOM_CONSUMPTION_UNIT,
            priceUnit: CUSTOM_PRICE_UNIT,
        }
        const { getByText } = render(<ConsumptionAndPrice {...mockConsumptionAndPriceProps} />)

        expect(getByText(CUSTOM_CONSUMPTION_UNIT)).toBeInTheDocument()
        expect(getByText(CUSTOM_PRICE_UNIT)).toBeInTheDocument()
    })
})
