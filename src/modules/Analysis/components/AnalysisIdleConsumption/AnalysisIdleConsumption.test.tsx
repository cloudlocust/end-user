import { reduxedRender } from 'src/common/react-platform-components/test'
import { AnalysisIdleConsumption } from 'src/modules/Analysis/components/AnalysisIdleConsumption'
import { AnalysisIdleConsumptionProps } from 'src/modules/Analysis/components/AnalysisIdleConsumption/analysisIdleConssumption'
import { IMetric, metricFiltersType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

let mockFilters: metricFiltersType = [
    {
        key: 'housing_id',
        operator: '=',
        value: '123456789',
    },
]

let mockRange = {
    from: '2022-05-01T00:00:00.000Z',
    to: '2022-05-31T23:59:59.999Z',
}

let mockIsMetricsLoading = false

let mockTotalConsumption: number = 0

let mocknAnalysisIdleConsumptionProps: AnalysisIdleConsumptionProps = {
    filters: mockFilters,
    range: mockRange,
    totalConsumption: mockTotalConsumption,
}

let idleSvg = 'idle-svg'

let mockData: IMetric[] = [
    {
        target: metricTargetsEnum.idleConsumption,
        datapoints: [
            [500, 1682899200000],
            [500, 1682985600000],
        ],
    },
]

const loadingMessage = 'En cours de calcule...'

jest.mock('src/modules/Metrics/metricsHook', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        filters: mockFilters,
        range: mockRange,
        interval: '1d',
        isMetricsLoading: mockIsMetricsLoading,
    }),
}))

describe('AnalysisIdleConsumption component test', () => {
    test('whhen isMetricsLoading is true, we show a loading message', () => {
        mockIsMetricsLoading = true
        mockTotalConsumption = 0
        const { getByTestId, getByText } = reduxedRender(
            <AnalysisIdleConsumption {...mocknAnalysisIdleConsumptionProps} />,
        )
        expect(getByTestId(idleSvg)).toBeInTheDocument()
        expect(getByText(loadingMessage)).toBeInTheDocument()
    })

    test('when data is retrieved, we show the average per day and sum in the month', async () => {
        mockIsMetricsLoading = false

        mocknAnalysisIdleConsumptionProps.totalConsumption = 10000

        const { getByText } = reduxedRender(<AnalysisIdleConsumption {...mocknAnalysisIdleConsumptionProps} />)

        const averageValue = getByText('0.50 kWh') // Update this with the expected average idle consumption value
        const totalValue = getByText('1.00 kWh') // Update this with the expected sum of idle consumption value
        const percentageValue = getByText('10 %') // Update this with the expected percentage of idle consumption value

        expect(averageValue).toBeInTheDocument()
        expect(totalValue).toBeInTheDocument()
        expect(percentageValue).toBeInTheDocument()
    })
    test('when idleConsumption is 0', async () => {
        mockIsMetricsLoading = false

        mocknAnalysisIdleConsumptionProps.totalConsumption = 0

        const { getByText } = reduxedRender(<AnalysisIdleConsumption {...mocknAnalysisIdleConsumptionProps} />)

        const percentageValue = getByText('0 %')

        expect(percentageValue).toBeInTheDocument()
    })
})
