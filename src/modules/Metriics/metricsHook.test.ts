import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { METRICS_API, useConsumptionMetrics } from 'src/modules/Metriics/metricsHook'
import { getMetricType, metricRange, metricTargets } from 'src/modules/Metriics/Metrics'

import axios from 'axios'

jest.mock('axios', () => ({
    ...jest.requireActual('axios'),
    post: jest.fn(),
}))

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

let mockHookArguments: getMetricType = {
    interval: '1min',
    range: FAKE_RANGE,
    targets: FAKE_TARGETS,
    addHookFilters: [],
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

        const AXIOS_POST_DATA = mockHookArguments

        expect(axios.post).toHaveBeenCalledWith(METRICS_API, AXIOS_POST_DATA)
    }, 8000)
})
