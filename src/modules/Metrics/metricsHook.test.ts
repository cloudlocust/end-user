import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
// import { act } from '@testing-library/react-hooks'
import { getMetricType, metricRangeType, metricTargetsType } from 'src/modules/Metrics/Metrics'

const mockEnqueueSnackbar = jest.fn()

/**
 * Mocking the useSnackbar used in CustomerDetails to load the customerDetails based on url /customers/:id {id} params.
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
        target: 'nrlink_consumption_metrics',
        type: 'timeseries',
    },
]

let mockHookArguments: getMetricType = {
    interval: '1min',
    range: FAKE_RANGE,
    targets: FAKE_TARGETS,
    filters: [],
}

// const FILTERS_TEST = [
//     {
//         key: 'meter_guid',
//         operator: '=',
//         value: '12345',
//     },
// ]

// const NonExistantState = 'NONEXISTENT'

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
    // test('When setFilters is triggered, filters state changes and returns', async () => {
    //     const {
    //         renderedHook: { result, waitForValueToChange },
    //     } = reduxedRenderHook(() => useMetrics(mockHookArguments))

    //     act(() => {
    //         result.current.setFilters(FILTERS_TEST)
    //     })
    //     await waitForValueToChange(
    //         () => {
    //             return result.current.isMetricsLoading
    //         },
    //         { timeout: 10000 },
    //     )
    //     expect(result.current.filters).toStrictEqual(FILTERS_TEST)
    //     expect(result.current.enedisConsent.enedisConsentState).toStrictEqual(NonExistantState)
    //     expect(result.current.nrlinkConsent.nrlinkConsentState).toStrictEqual(NonExistantState)
    // }, 30000)
    // test('When getting consents fail', async () => {
    //     const { store } = require('src/redux')
    //     await store.dispatch.userModel.setAuthenticationToken('error')

    //     const {
    //         renderedHook: { result, waitForValueToChange },
    //     } = reduxedRenderHook(() => useMetrics(mockHookArguments))

    //     act(() => {
    //         result.current.setFilters(FILTERS_TEST)
    //     })
    //     await waitForValueToChange(
    //         () => {
    //             return result.current.isMetricsLoading
    //         },
    //         { timeout: 10000 },
    //     )

    //     expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur lors de la récupération du consentement Nrlink', {
    //         autoHideDuration: 5000,
    //         variant: 'error',
    //     })

    //     expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur lors de la récupération du consentement Enedis', {
    //         autoHideDuration: 5000,
    //         variant: 'error',
    //     })
    // }, 20000)
})
