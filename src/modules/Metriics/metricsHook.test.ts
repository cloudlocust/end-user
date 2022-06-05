import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useConsumptionMetrics } from 'src/modules/Metriics/metricsHook'
import { getMetricType, metricRange, metricTargets } from 'src/modules/Metriics/Metrics'

const FAKE_RANGE: metricRange = {
    from: '2022-06-04T22:00:00.000Z',
    to: '2022-06-04T23:26:59.169Z',
}

const FAKE_TARGETS: metricTargets = [
    {
        target: 'nrlink_consumption_metrics',
        type: 'timeseries',
    },
]

const mockHookArguments: getMetricType = {
    interval: '1min',
    range: FAKE_RANGE,
    targets: FAKE_TARGETS,
}

describe('useConsumptionMetrics hook test', () => {
    test('When the hook is called with default values', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useConsumptionMetrics(mockHookArguments))

        const currentResult = result.current
        expect(currentResult.isMetricsLoading).toBe(true)
        expect(currentResult.interval).toBe('1min')
        expect(currentResult.range).toStrictEqual(FAKE_RANGE)
        expect(currentResult.targets).toStrictEqual(FAKE_TARGETS)
        expect(currentResult.filters).toBeFalsy()
    }, 10000)
    test('when the hook is called with different initial values', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useConsumptionMetrics({ ...mockHookArguments, interval: '1d' }))

        const currentResult = result.current
        expect(currentResult.isMetricsLoading).toBe(true)
        expect(currentResult.interval).toBe('1d')
        expect(currentResult.range).toStrictEqual(FAKE_RANGE)
        expect(currentResult.targets).toStrictEqual(FAKE_TARGETS)
        expect(currentResult.filters).toBeFalsy()
    }, 10000)
})
