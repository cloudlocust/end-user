import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { act } from '@testing-library/react-hooks'
import dayjs from 'dayjs'
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
    from: '2022-06-04T22:00:00.000Z',
    to: '2022-06-05T23:26:59.169Z',
}

const FAKE_TARGETS: metricTargetsType = [
    {
        target: 'consumption_metrics',
        type: 'timeseries',
    },
]

let mockHookArguments: getMetricType = {
    interval: '1min',
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
        expect(currentResult.metricsInterval).toStrictEqual('1min')
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
        mockHookArguments.range.to = mockHookArguments.range.from
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

    test('When add and remove target, targets should change and getMetrics should work', async () => {
        mockHookArguments.targets = []
        mockHookArguments.interval = '1d'
        mockHookArguments.range.to = dayjs(mockHookArguments.range.from).add(7, 'day').format()
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useMetrics(mockHookArguments))

        expect(result.current.isMetricsLoading).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isMetricsLoading
            },
            { timeout: 4000 },
        )
        expect(result.current.isMetricsLoading).toBeFalsy()
        expect(result.current.data.length).toBe(0)
        // Add Target
        act(() => {
            result.current.addTarget(FAKE_TARGETS[0].target)
        })
        await waitForValueToChange(
            () => {
                return result.current.data
            },
            { timeout: 8000 },
        )
        expect(result.current.data.length).toBeGreaterThan(0)
        expect(result.current.data[0].target).toBe(FAKE_TARGETS[0].target)
        // Remove target
        act(() => {
            result.current.removeTarget(FAKE_TARGETS[0].target)
        })
        await waitForValueToChange(
            () => {
                return result.current.data
            },
            { timeout: 8000 },
        )
        expect(result.current.data.length).toBe(0)
    }, 30000)
})
