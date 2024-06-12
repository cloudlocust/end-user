import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

// eslint-disable-next-line jsdoc/require-jsdoc
const metricsData: IMetric[] = [
    {
        target: metricTargetsEnum.consumption,
        datapoints: [
            [10, 1640995200000],
            [30, 1643673600000],
            [20, 1646092800000],
            [45, 1648771200000],
            [60, 1651363200000],
            [15, 1654041600000],
        ],
    },
    {
        target: metricTargetsEnum.autoconsumption,
        datapoints: [
            [15, 1640995200000],
            [10, 1643673600000],
            [25, 1646092800000],
            [20, 1648771200000],
            [10, 1651363200000],
            [50, 1654041600000],
        ],
    },
    {
        target: metricTargetsEnum.eurosConsumption,
        datapoints: [
            [10, 1640995200000],
            [10, 1643673600000],
            [35, 1646092800000],
            [15, 1648771200000],
            [20, 1651363200000],
            [30, 1654041600000],
        ],
    },
]
let mockMetricsData: IMetric[] = JSON.parse(JSON.stringify(metricsData))
let mockIsMetricsLoading = false
let mockGetMetricsWithParams = jest.fn(() => ({ data: mockMetricsData }))

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockMetricsData,
        isMetricsLoading: mockIsMetricsLoading,
        getMetricsWithParams: mockGetMetricsWithParams,
    }),
}))

describe('useCurrentDayConsumption', () => {
    test('get the current day consumption', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useCurrentDayConsumption(1))
        act(() => {
            result.current.getCurrentDayTotalValues({
                [metricTargetsEnum.consumption]: true,
            })
        })
        expect(result.current.isGetCurrentDayTotalValuesLoading).toBe(true)
        await waitForValueToChange(() => result.current.isGetCurrentDayTotalValuesLoading, { timeout: 10000 })
        expect(result.current.currentDayConsumption).toEqual(consumptionWattUnitConversion(0))
    })

    test('get the current day autoConsumption', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useCurrentDayConsumption(1))
        act(() => {
            result.current.getCurrentDayTotalValues({
                [metricTargetsEnum.autoconsumption]: true,
            })
        })
        expect(result.current.isGetCurrentDayTotalValuesLoading).toBe(true)
        await waitForValueToChange(() => result.current.isGetCurrentDayTotalValuesLoading, { timeout: 10000 })
        expect(result.current.currentDayAutoConsumption).toEqual(consumptionWattUnitConversion(0))
    })

    test('get the current day euroConsumption', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useCurrentDayConsumption(1))
        act(() => {
            result.current.getCurrentDayTotalValues({
                [metricTargetsEnum.eurosConsumption]: true,
            })
        })
        expect(result.current.isGetCurrentDayTotalValuesLoading).toBe(true)
        await waitForValueToChange(() => result.current.isGetCurrentDayTotalValuesLoading, { timeout: 10000 })
        expect(result.current.currentDayEuroConsumption).toEqual({
            unit: '€',
            value: 0,
        })
    })
})
