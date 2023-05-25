import { reduxedRender } from 'src/common/react-platform-components/test'
import { AnalysisIdleConsumption } from 'src/modules/Analysis/components/AnalysisIdleConsumption'
import { AnalysisIdleConsumptionProps } from 'src/modules/Analysis/components/AnalysisIdleConsumption/analysisIdleConssumption'
import { metricFiltersType } from 'src/modules/Metrics/Metrics.d'

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
        isMetricsLoading: mockIsMetricsLoading,
    }

    let idleSvg = 'idle-svg'

    jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
        // eslint-disable-next-line jsdoc/require-jsdoc
        useMetrics: () => ({
            data: [[4000, 1677628800000]],
            filters: mocknAnalysisIdleConsumptionProps.filters,
            range: mocknAnalysisIdleConsumptionProps.range,
            interval: '1d',
        }),
    }))

    test('when component has data props and it renders the average and sum of idle consumption', () => {
        const { getByTestId } = reduxedRender(<AnalysisIdleConsumption {...mocknAnalysisIdleConsumptionProps} />)
        expect(getByTestId(idleSvg)).toBeInTheDocument()
    })

    test.todo('When total consumption from analysisStore, percentage of Idle consumption is shown')
})
