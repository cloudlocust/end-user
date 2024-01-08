import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import ConsumptionLabelCard from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard'
import { ConsumptionLabelDataType } from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.d'

const mockLabelData: ConsumptionLabelDataType = {
    id: 1,
    name: 'label test',
    startTime: '12-12-2021T02:50:00.000Z',
    endTime: '12-12-2021T03:50:00.000Z',
    consumption: 10,
    price: 2,
}
describe('ConsumptionLabelCard', () => {
    test('should render', () => {
        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionLabelCard labelData={mockLabelData} />
            </Router>,
        )

        expect(getByText(mockLabelData.name)).toBeInTheDocument()
        expect(getByText('02:50')).toBeInTheDocument()
        expect(getByText('03:50')).toBeInTheDocument()
    })
})
