import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useConsumptionAlerts } from './consumptionAlertHooks'
import { IConsumptionAlert } from './consumptionAlert'
import { act } from '@testing-library/react-hooks'
import { applyCamelCase } from 'src/common/react-platform-components'
import {
    MOCK_PRICE_PER_KWH,
    MOCK_INTERNAL_ERROR_MESSAGE,
    TEST_CONSUMPTION_ALERTS as CONSUMPTION_ALERTS,
} from 'src/mocks/handlers/consumptionAlerts'

const TEST_CONSUMPTION_ALERTS: IConsumptionAlert[] = applyCamelCase(CONSUMPTION_ALERTS)

const mockEnqueueSnackbar = jest.fn()

const NO_HOUSING_MESSAGE = 'Aucun logement.'
const MODIFICATION_DONE = 'Vos modifications ont été sauvegardées'
const DEFAULT_GET_ALERTS_ERROR_MESSAGE = 'Une erreur est survenue lors du chargement des alerts.'
const DEFAULT_ASSERTION_ALERTS_ERROR_MESSAGE = "Une erreur est survenue lors de l'insertion des alerts."

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

describe('useConsumptionAlerts test', () => {
    describe('Load Consumption alerts', () => {
        test('Load consumption-alerts successfull when mount hook.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(1), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(result.current.consumptionAlerts).toMatchObject(TEST_CONSUMPTION_ALERTS)
        }, 10000)

        test('Consumption-alerts does not load on mount when no housing', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(result.current.consumptionAlerts).toMatchObject([])
        }, 10000)

        test('Error message when Load consumption-alerts with no housing.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with no message on loading consumption alerts.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-1, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DEFAULT_GET_ALERTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with message on loading consumption alerts.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-2, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MOCK_INTERNAL_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
    })
    describe('Get price per kwh.', () => {
        test('get price per kwh successfull.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(1, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)

            let response_ppkwh: number | null = null
            act(async () => {
                response_ppkwh = await result.current.getPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(response_ppkwh).toBe(MOCK_PRICE_PER_KWH)
        }, 10000)

        test('get price per kwh no housing.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.getPricePerKwh()
            })

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Error with no message on get price per kwh.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-1, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.getPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DEFAULT_GET_ALERTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Error with message on get price per kwh.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-2, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.getPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MOCK_INTERNAL_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
    })
    describe('Save consumption alert.', () => {
        test('Create new consumption alert', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(1, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.saveConsumptionAlert({ price: 0.174, consumption: null }, 'month')
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MODIFICATION_DONE, { variant: 'success' })

            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(result.current.consumptionAlerts.length).toBe(3)
        }, 10000)

        test('Create new consumption alert no housing.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.saveConsumptionAlert({ price: null, consumption: null }, 'day')
            })

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Error with no message on save consumption alert.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-1, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.saveConsumptionAlert({ price: null, consumption: null }, 'day')
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DEFAULT_ASSERTION_ALERTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Error with message on save consumption alert.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-2, true), { initialState: {} })

            expect(result.current.isLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.saveConsumptionAlert({ price: null, consumption: null }, 'day')
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MOCK_INTERNAL_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
    })
})
