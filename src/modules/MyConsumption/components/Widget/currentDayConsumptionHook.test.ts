import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import {
    CURRENT_DAY_AUTO_CONSUMPTION_TEST_VALUE,
    CURRENT_DAY_CONSUMPTION_TEST_VALUE,
    CURRENT_DAY_EURO_CONSUMPTION_TEST_VALUE,
} from 'src/mocks/handlers/currentDayConsumption'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'

describe('useCurrentDayConsumption', () => {
    test('get the current day consumption and auto consumption', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useCurrentDayConsumption(1))
        act(() => {
            result.current.getCurrentDayConsumption()
        })
        expect(result.current.isGetCurrentDayConsumptionLoading).toBe(true)
        await waitForValueToChange(() => result.current.isGetCurrentDayConsumptionLoading, { timeout: 2000 })
        expect(result.current.currentDayConsumption).toEqual(CURRENT_DAY_CONSUMPTION_TEST_VALUE)
        expect(result.current.currentDayAutoConsumption).toEqual(CURRENT_DAY_AUTO_CONSUMPTION_TEST_VALUE)
    })

    test('get the current day euro consumption', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useCurrentDayConsumption(1))
        act(() => {
            result.current.getCurrentDayEuroConsumption()
        })
        expect(result.current.isGetCurrentDayEuroConsumptionLoading).toBe(true)
        await waitForValueToChange(() => result.current.isGetCurrentDayEuroConsumptionLoading, { timeout: 2000 })
        expect(result.current.currentDayEuroConsumption).toEqual(CURRENT_DAY_EURO_CONSUMPTION_TEST_VALUE)
    })
})
