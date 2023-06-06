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
const DEFAULT_GET_ALERTS_ERROR_MESSAGE = 'Une erreur est survenue lors du chargement des alertes.'
const DEFAULT_ASSERTION_ALERTS_ERROR_MESSAGE = "Une erreur est survenue lors de l'insertion des alertes."

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
    describe('Load essentials on load, controled with disableOnMount.', () => {
        test('Load consumption-alerts and price per kwh successfull when mount hook.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(1), { initialState: {} })

            // auto load consumption alerts
            expect(result.current.isAlertsLoadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.isAlertsLoadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.consumptionAlerts).toMatchObject(TEST_CONSUMPTION_ALERTS)
            expect(result.current.isAlertsLoadingInProgress).toBe(false)

            // auto load price per kwh
            expect(result.current.isPricePerKwhLoadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            expect(result.current.pricePerKwh).toBe(MOCK_PRICE_PER_KWH)
        }, 10000)

        test('Consumption-alerts and price per kwh dont mount when disableOnMount.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(1, true), { initialState: {} })

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)

            expect(result.current.consumptionAlerts).toMatchObject([])
            expect(result.current.pricePerKwh).toBe(null)
        }, 10000)
    })
    describe('Load Consumption alerts', () => {
        test('Load consumption-alerts works when called.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(1, true), { initialState: {} })

            expect(result.current.isAlertsLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isAlertsLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            expect(result.current.consumptionAlerts).toMatchObject(TEST_CONSUMPTION_ALERTS)
        }, 10000)

        test('Consumption-alerts does not load on mount when no housing', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null), { initialState: {} })

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            expect(result.current.consumptionAlerts).toMatchObject([])
        }, 10000)

        test('Error message when Load consumption-alerts with no housing.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null, true), { initialState: {} })

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with no message on loading consumption alerts.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-1, true), { initialState: {} })

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isAlertsLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DEFAULT_GET_ALERTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with message on loading consumption alerts.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-2, true), { initialState: {} })

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isAlertsLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MOCK_INTERNAL_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
    })
    describe('load price per kwh.', () => {
        test('Load price per kwh works when called.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(1, true), { initialState: {} })

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.loadPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            expect(result.current.pricePerKwh).toBe(MOCK_PRICE_PER_KWH)
        }, 10000)

        test('Price per kwh does not load on mount when no housing', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null), { initialState: {} })

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            expect(result.current.pricePerKwh).toBe(null)
        }, 10000)

        test('Error message when Load price per kwh with no housing.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null, true), { initialState: {} })

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadPricePerKwh()
            })

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with no message on loading price per kwh.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-1, true), { initialState: {} })

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DEFAULT_GET_ALERTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Internal server Error with message on loading price per kwh.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-2, true), { initialState: {} })

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
            act(async () => {
                await result.current.loadPricePerKwh()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isPricePerKwhLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isPricePerKwhLoadingInProgress).toBe(false)
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

            expect(result.current.isSavingInProgress).toBe(false)
            expect(result.current.isAlertsLoadingInProgress).toBe(false)

            act(async () => {
                await result.current.saveConsumptionAlert({ price: 0.174, consumption: null }, 'month')
            })

            await waitForValueToChange(
                () => {
                    return result.current.isSavingInProgress
                },
                { timeout: 6000 },
            )

            expect(result.current.isSavingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MODIFICATION_DONE, { variant: 'success' })

            act(async () => {
                await result.current.loadConsumptionAlerts()
            })

            await waitForValueToChange(
                () => {
                    return result.current.isAlertsLoadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isAlertsLoadingInProgress).toBe(false)
            expect(result.current.consumptionAlerts.length).toBe(3)
        }, 10000)

        test('Create new consumption alert no housing.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useConsumptionAlerts(null, true), { initialState: {} })

            expect(result.current.isSavingInProgress).toBe(false)

            act(async () => {
                await result.current.saveConsumptionAlert({ price: null, consumption: null }, 'day')
            })

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Error with no error message on save consumption alert.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-1, true), { initialState: {} })

            expect(result.current.isSavingInProgress).toBe(false)

            act(async () => {
                await result.current.saveConsumptionAlert({ price: null, consumption: null }, 'day')
            })

            await waitForValueToChange(
                () => {
                    return result.current.isSavingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isSavingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DEFAULT_ASSERTION_ALERTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)

        test('Error with message on save consumption alert.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useConsumptionAlerts(-2, true), { initialState: {} })

            expect(result.current.isSavingInProgress).toBe(false)
            act(async () => {
                await result.current.saveConsumptionAlert({ price: null, consumption: null }, 'day')
            })

            await waitForValueToChange(
                () => {
                    return result.current.isSavingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.isSavingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MOCK_INTERNAL_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
    })
})
