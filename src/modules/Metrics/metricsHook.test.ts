import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { METRICS_API, useConsumptionMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, metricRange, metricTargets } from 'src/modules/Metrics/Metrics'
import { axios } from 'src/common/react-platform-components'
import { TEST_SUCCESS_DAY_METRICS } from 'src/mocks/handlers/metrics'
import { act } from '@testing-library/react-hooks'

jest.mock('axios')
const mockEnqueueSnackbar = jest.fn()
const mockedAxios = axios as jest.Mocked<typeof axios>

/**
 * Mocking the useSnackbar.
 */
jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    /**
     * Mock the notistack useSnackbar hooks.
     *
     * @returns The notistack useSnackbar hook.
     */
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
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

const FILTERS_TEST = [
    {
        key: 'meter_guid',
        operator: '=',
        value: '12345',
    },
]

describe('useConsumptionMetrics hook test', () => {
    test('When the hook is called with default values', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useConsumptionMetrics(mockHookArguments))

        const currentResult = result.current
        expect(currentResult.isMetricsLoading).toStrictEqual(true)
        expect(currentResult.interval).toStrictEqual('1min')
        expect(currentResult.range).toStrictEqual(FAKE_RANGE)
        expect(currentResult.targets).toStrictEqual(FAKE_TARGETS)
        expect(currentResult.filters).toStrictEqual([])
    }, 8000)
    test('When there is an HTTP request with the right body', async () => {
        const {
            renderedHook: { result, waitFor },
        } = reduxedRenderHook(() => useConsumptionMetrics(mockHookArguments))

        const AXIOS_POST_DATA = mockHookArguments

        expect(mockedAxios.post).toHaveBeenCalledWith(METRICS_API, AXIOS_POST_DATA)

        waitFor(() => {
            expect(result.current.data).toBe(TEST_SUCCESS_DAY_METRICS)
        })
    }, 8000)
    test('When there is a server issue and the data cannot be retrieved, a snackbar is shown', async () => {
        const {
            renderedHook: { waitFor },
        } = reduxedRenderHook(() => useConsumptionMetrics(mockHookArguments))

        mockedAxios.post.mockRejectedValue('Error')

        waitFor(() => {
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur de chargement de vos données de consommation', {
                variant: 'error',
            })
        })
    }, 8000)
    test('When setFilters is triggered, filters and consents state change', async () => {
        const {
            renderedHook: { result, waitFor },
        } = reduxedRenderHook(() => useConsumptionMetrics(mockHookArguments))

        act(() => {
            result.current.setFilters(FILTERS_TEST)
        })

        waitFor(() => {
            expect(result.current.filters).toStrictEqual(FILTERS_TEST)
        })
    }, 8000)
})
