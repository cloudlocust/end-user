import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useInstallationRequestsList } from 'src/modules/InstallationRequests/installationRequestsHooks'

const mockEnqueueSnackbar = jest.fn()

const ERROR_SNACKBAR_MESSAGE = 'Erreur lors du chargement des demandes'

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

describe('InstallationRequestList hook test', () => {
    describe('useInstallationRequestsList', () => {
        test('when snackbar is called with error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative size to fake an error in the msw.
            } = reduxedRenderHook(() => useInstallationRequestsList(-1), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_SNACKBAR_MESSAGE, {
                variant: 'error',
            })
        })
        test('when elementlist loads succesfully', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative size to fake an error in the msw.
            } = reduxedRenderHook(() => useInstallationRequestsList(), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(result.current.elementList).toBeTruthy()
        })
    })
})
