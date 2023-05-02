import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_SUCCESS_MONTH_METRICS } from 'src/mocks/handlers/metrics'
import { AnalysisIdleConsumption } from 'src/modules/Analysis/components/AnalysisIdleConsumption'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

let mockData: IMetric[] = TEST_SUCCESS_MONTH_METRICS([metricTargetsEnum.consumption, metricTargetsEnum.pMax])

describe('AnalysisIdleConsumption component test', () => {
    mockData = [
        ...mockData,
        {
            datapoints: [
                [2000, 0],
                [2000, 0],
            ],
            target: metricTargetsEnum.idleConsumption,
        },
        {
            datapoints: [],
            target: metricTargetsEnum.eurosConsumption,
        },
    ]

    test('when component has data props and it renders the average idle consumption', () => {
        const { getByText } = reduxedRender(<AnalysisIdleConsumption data={mockData} />)
        expect(getByText('2.00 kWh')).toBeInTheDocument()
    })

    test('when component has data props and it renders the sum of the idle consumption', () => {
        const { getByText } = reduxedRender(<AnalysisIdleConsumption data={mockData} />)
        expect(getByText('4.00 kWh & 0 €')).toBeTruthy()
    })
})
