import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_ERROR_HOUSING_ID, TEST_SHELLY_CONNECTED_PLUG_URL } from 'src/mocks/handlers/connectedPlugs'
import { TEST_ERROR_METER_GUID } from 'src/mocks/handlers/meters'
import {
    useConnectedPlugList,
    useShellyConnectedPlugs,
} from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'

const TEST_METER_GUID = '23215654321'
const TEST_HOUSE_ID = 1

const ERROR_LOAD_MESSAGE = 'Erreur lors du chargement de vos prises'
const ERROR_SHELLY_WINDOW_OPENING_MESSAGE = `Nous ne pouvons pas afficher la fenêtre Shelly des prises connectées, veuillez autoriser les Pop-Ups dans les Paramètres du navigateur`
const ERROR_SHELLY_REQUESTING_URL_MESSAGE = "Erreur lors de la connexion avec l'interface shelly des prises connectées"
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

describe('useConnectedPlugList test', () => {
    /* Get Elements */
    test('when snackbar is called with error', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
            // Giving Empty GUID to fake an error.
        } = reduxedRenderHook(() => useConnectedPlugList(TEST_ERROR_METER_GUID), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.loadingInProgress).toBe(false)
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_LOAD_MESSAGE, {
            variant: 'error',
        })
    }, 8000)
    test('when elementlist loads succesfully', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
            // Giving negative size to fake an error in the msw.
        } = reduxedRenderHook(() => useConnectedPlugList(TEST_METER_GUID), { initialState: {} })
        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.loadingInProgress).toBe(false)
        expect(result.current.connectedPlugList).toBeTruthy()
    }, 8000)
})

describe('useShellyConnectedPlugs test', () => {
    describe('Opening shelly window', () => {
        /* Get Elements */
        test('when succes', async () => {
            // Mock Shelly Window open
            const originalWindowOpen = window.open
            const mockShellyWindowOpen = jest.fn().mockImplementation(() => ({}))
            window.open = mockShellyWindowOpen

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useShellyConnectedPlugs(TEST_HOUSE_ID), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)
            act(async () => {
                await result.current.openShellyConnectedPlugsWindow()
            })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            expect(mockShellyWindowOpen).toHaveBeenCalledWith(
                TEST_SHELLY_CONNECTED_PLUG_URL,
                expect.anything(),
                expect.anything(),
            )
            // Cleanup
            window.open = originalWindowOpen
        }, 8000)
        test('when Passing onCloseShelly call back, it should be called', async () => {
            // Fake the setInterval
            jest.useFakeTimers()

            // Mock Shelly Window open
            const originalWindowOpen = window.open
            const mockShellyWindowOpen = jest.fn().mockImplementation(() => ({
                closed: true,
            }))
            window.open = mockShellyWindowOpen

            const mockOnCloseShellyWindowCallback = jest.fn()
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useShellyConnectedPlugs(TEST_HOUSE_ID), { initialState: {} })

            act(async () => {
                await result.current.openShellyConnectedPlugsWindow(mockOnCloseShellyWindowCallback)
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            // Force setInterval to trigger the mockOnCloseShellyWindowCallback.
            jest.advanceTimersByTime(1000)
            expect(mockOnCloseShellyWindowCallback).toHaveBeenCalled()
            // Cleanup
            window.open = originalWindowOpen
        }, 15000)

        test('When opening a new shelly window while another one is still open, it should close the previous', async () => {
            // Mock Shelly Window open
            const originalWindowOpen = window.open
            const mockCloseOpenedShellyWindow = jest.fn()
            const mockShellyWindowOpen = jest.fn().mockImplementation(() => ({
                closed: true,
                close: mockCloseOpenedShellyWindow,
            }))
            window.open = mockShellyWindowOpen

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useShellyConnectedPlugs(TEST_HOUSE_ID), { initialState: {} })

            // Opening first shelly window.
            act(async () => {
                await result.current.openShellyConnectedPlugsWindow()
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            // Opening a new shelly window, should close the previous one.
            act(async () => {
                await result.current.openShellyConnectedPlugsWindow()
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            expect(mockCloseOpenedShellyWindow).toHaveBeenCalled()

            // Cleanup
            window.open = originalWindowOpen
        }, 15000)
    })

    describe('Shelly window error', () => {
        /* Get Elements */
        test('when request shelly url error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving Error Housing ID to fake an error.
            } = reduxedRenderHook(() => useShellyConnectedPlugs(TEST_ERROR_HOUSING_ID), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)
            act(async () => {
                await result.current.openShellyConnectedPlugsWindow()
            })
            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_SHELLY_REQUESTING_URL_MESSAGE, {
                variant: 'error',
            })
        }, 8000)
        test('when opening shelly window error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving Empty GUID to fake an error.
            } = reduxedRenderHook(() => useShellyConnectedPlugs(TEST_HOUSE_ID), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)
            act(async () => {
                await result.current.openShellyConnectedPlugsWindow()
            })
            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_SHELLY_WINDOW_OPENING_MESSAGE, {
                variant: 'error',
            })
        }, 8000)
    })
})
