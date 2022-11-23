import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useSolarEquipmentsList } from 'src/modules/SolarEquipments/solarEquipmentsHook'

const mockEnqueueSnackbar = jest.fn()

const ERROR_SNACKBAR_GET_MESSAGE = 'Erreur lors du chargement des équipements'

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

describe('EquipmentRequestsList hook test', () => {
    describe('useEquipmentRequestsList', () => {
        /* Get Elements */
        test('when snackbar is called with error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative size to fake an error in the msw.
            } = reduxedRenderHook(() => useSolarEquipmentsList(-1), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_SNACKBAR_GET_MESSAGE, {
                variant: 'error',
            })
        })
        test('when elementlist loads succesfully', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative size to fake an error in the msw.
            } = reduxedRenderHook(() => useSolarEquipmentsList(), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(result.current.elementList).toBeTruthy()
        })
    })
})
