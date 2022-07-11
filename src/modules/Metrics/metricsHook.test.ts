import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, metricRangeType, metricTargetsType } from 'src/modules/Metrics/Metrics'

const mockEnqueueSnackbar = jest.fn()

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

const FAKE_RANGE: metricRangeType = {
    from: '2022-06-04T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}

const FAKE_TARGETS: metricTargetsType = [
    {
        target: 'consumption_metrics',
        type: 'timeserie',
    },
]

let mockHookArguments: getMetricType = {
    interval: '2min',
    range: FAKE_RANGE,
    targets: FAKE_TARGETS,
    filters: [],
}

describe('useMetrics hook test', () => {
    test('When the hook is called with default values', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useMetrics(mockHookArguments))

        const currentResult = result.current
        expect(currentResult.isMetricsLoading).toStrictEqual(true)
        expect(currentResult.metricsInterval).toStrictEqual('2min')
        expect(currentResult.range).toStrictEqual(FAKE_RANGE)
        expect(currentResult.targets).toStrictEqual(FAKE_TARGETS)
        expect(currentResult.filters).toStrictEqual([])
    }, 8000)
    test('When there is an HTTP request with the right body', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useMetrics(mockHookArguments))
        expect(result.current.isMetricsLoading).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isMetricsLoading
            },
            { timeout: 10000 },
        )
        expect(result.current.isMetricsLoading).toBeFalsy()
        expect(result.current.data.length).toBeGreaterThan(0)
    }, 20000)
    test('When there is a server issue and the data cannot be retrieved, a snackbar is shown', async () => {
        mockHookArguments.range.to = '2022-06-06T23:59:59.999Z'
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useMetrics(mockHookArguments))

        expect(result.current.isMetricsLoading).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isMetricsLoading
            },
            { timeout: 10000 },
        )
        expect(result.current.isMetricsLoading).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur de chargement de vos données de consommation', {
            variant: 'error',
            autoHideDuration: 5000,
        })
    }, 8000)
})
