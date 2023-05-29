import { reduxedRender } from 'src/common/react-platform-components/test'
import { AnalysisIdleConsumption } from 'src/modules/Analysis/components/AnalysisIdleConsumption'
import { AnalysisIdleConsumptionProps } from 'src/modules/Analysis/components/AnalysisIdleConsumption/analysisIdleConssumption'
import { IMetric, metricFiltersType } from 'src/modules/Metrics/Metrics.d'

// TODO: fix tests

describe('AnalysisIdleConsumption component test', () => {
    let mockFilters: metricFiltersType = [
        {
            key: 'meter_guid',
            operator: '=',
            value: '123456789',
        },
    ]

    let mockRange = {
        from: '2022-05-01T00:00:00.000Z',
        to: '2022-05-31T23:59:59.999Z',
    }

    let mockIsMetricsLoading = false

    let mocknAnalysisIdleConsumptionProps: AnalysisIdleConsumptionProps = {
        filters: mockFilters,
        range: mockRange,
        totalConsumption: 0,
    }

    let idleSvg = 'idle-svg'

    let mockData: IMetric[]

    jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
        // eslint-disable-next-line jsdoc/require-jsdoc
        useMetrics: () => ({
            data: mockData,
            filters: mockFilters,
            range: mockRange,
            interval: '1d',
            isMetricsLoading: mockIsMetricsLoading,
        }),
    }))

    const loadingMessage = 'En cours de calcule...'

    test('whhen isMetricsLoading is true, we show a loading message', () => {
        mockIsMetricsLoading = true
        const { getByTestId, getByText } = reduxedRender(
            <AnalysisIdleConsumption {...mocknAnalysisIdleConsumptionProps} />,
        )
        expect(getByTestId(idleSvg)).toBeInTheDocument()
        expect(getByText(loadingMessage)).toBeInTheDocument()
    })

    test.todo('when data is retrieved, we show the average per day and sum in the month')
})
