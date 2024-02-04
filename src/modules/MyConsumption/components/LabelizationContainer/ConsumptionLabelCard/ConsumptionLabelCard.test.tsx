import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import ConsumptionLabelCard from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard'

jest.mock('src/modules/MyConsumption/utils/unitConversionFunction', () => ({
    ...jest.requireActual('src/modules/MyConsumption/utils/unitConversionFunction'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    consumptionWattUnitConversion: (value: number) => ({ value, unit: 'kWh' }),
}))

const mockConsumptionLabelCardProp: ConsumptionLabelCardProps = {
    equipmentName: 'Micro-onde',
    day: '2022-11-19',
    startTime: '02:50',
    endTime: '04:23',
    consumption: 54,
    consumptionPrice: 24,
    useType: 'Standard',
}

describe('ConsumptionLabelCard', () => {
    test('should render', () => {
        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionLabelCard {...mockConsumptionLabelCardProp} />
            </Router>,
        )

        expect(getByText(mockConsumptionLabelCardProp.equipmentName)).toBeInTheDocument()
        expect(getByText('Le')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.day)).toBeInTheDocument()
        expect(getByText('de')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.startTime)).toBeInTheDocument()
        expect(getByText('à')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.endTime)).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.consumption)).toBeInTheDocument()
        expect(getByText('kWh')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.consumptionPrice)).toBeInTheDocument()
        expect(getByText('€')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.useType!)).toBeInTheDocument()
    })
})
