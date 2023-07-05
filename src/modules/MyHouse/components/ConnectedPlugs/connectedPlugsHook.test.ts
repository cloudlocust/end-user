import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_ERROR_METER_GUID } from 'src/mocks/handlers/meters'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'

const TEST_METER_GUID = '23215654321'

const ERROR_LOAD_MESSAGE = 'Erreur lors du chargement de vos prises'

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

describe('Load Connected Plugs Consent test', () => {
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
        expect(result.current.elementList).toBeTruthy()
    }, 8000)
})
