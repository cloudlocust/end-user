import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import { MOCK_PRICE_PER_KWH, MOCK_INTERNAL_ERROR_MESSAGE } from 'src/mocks/handlers/dashboard'
import { useInstantPricePerKwh, DEFAULT_GET_PRICE_ERROR_MESSAGE } from './statusWrapperHooks'

const mockEnqueueSnackbar = jest.fn()

const NO_HOUSING_MESSAGE = 'Aucun logement.'

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

describe('useInstantPricePerKwh test', () => {
    describe('Load essentials on load, controled with disableOnMount.', () => {
        test('Load price per kwh successfull when mount hook.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstantPricePerKwh(1), { initialState: {} })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isInstantPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            expect(result.current.instantPricePerKwh).toBe(MOCK_PRICE_PER_KWH)
        }, 10000)

        test('Price per kwh dont mount when disableOnMount.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useInstantPricePerKwh(1, true), { initialState: {} })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)

            expect(result.current.instantPricePerKwh).toBe(null)
        }, 10000)
    })
    describe('load price per kwh.', () => {
        test('Load price per kwh works when called.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstantPricePerKwh(1, true), { initialState: {} })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.loadInstantPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isInstantPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            expect(result.current.instantPricePerKwh).toBe(MOCK_PRICE_PER_KWH)
        }, 10000)

        test('Price per kwh does not load on mount when no housing', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useInstantPricePerKwh(null), { initialState: {} })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            expect(result.current.instantPricePerKwh).toBe(null)
        }, 10000)

        test('Error message when Load price per kwh with no housing.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useInstantPricePerKwh(null, true), { initialState: {} })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadInstantPricePerKwh()
            })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with no message on loading price per kwh.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstantPricePerKwh(-1, true), { initialState: {} })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadInstantPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isInstantPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DEFAULT_GET_PRICE_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with message on loading price per kwh.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstantPricePerKwh(-2, true), { initialState: {} })

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadInstantPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isInstantPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isInstantPricePerKwhLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MOCK_INTERNAL_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
    })
})
