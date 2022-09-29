import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_INSTALLATION_REQUESTS } from 'src/mocks/handlers/installationRequests'
import {
    useInstallationRequests,
    useInstallationRequestsList,
} from 'src/modules/InstallationRequests/installationRequestsHooks'

const mockEnqueueSnackbar = jest.fn()

const ERROR_SNACKBAR_MESSAGE = 'Erreur lors du chargement des demandes'
const ERROR_UPDATE_INSTALLATION_REQUEST_MESSAGE = "Erreur lors de la mis à jour d'une demande"
const SUCCESS_UPDATE_INSTALLATION_REQUEST_MESSAGE = 'Demande a été mis à jour avec succès'
const ERROR_CREATE_INSTALLATION_REQUEST_MESSAGE = "Erreur lors de la création d'une demande"
const SUCCESS_CREATE_INSTALLATION_REQUEST_MESSAGE = 'Demande créé avec succès'
const ERROR_DELETE_INSTALLTION_REQUEST_MESSAGE = "Erreur lors de la suppression d'une demande"
const SUCCESS_DELETE_INSTALLTION_REQUEST_MESSAGE = 'Demande a été supprimée avec succès'

const { id, created_at, updated_at, ...rest } = TEST_INSTALLATION_REQUESTS[0]

const TEST_CREATE_INSTALLATION_REQUEST = rest

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
    describe('builder function', () => {
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
    describe('useInstallationRequests hook test', () => {
        test('when updateInstallationRequest rejects, an error snackbar is shown', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative size to fake an error in the msw.
            } = reduxedRenderHook(() => useInstallationRequests(), { initialState: {} })

            act(() => {
                result.current.updateInstallationRequest()
            })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_UPDATE_INSTALLATION_REQUEST_MESSAGE, {
                variant: 'error',
                autoHideDuration: 5000,
            })
        })
        test('when updateInstallationRequest resolves, a success snackbar is shown', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequests(), { initialState: {} })

            act(() => {
                result.current.updateInstallationRequest(
                    TEST_INSTALLATION_REQUESTS[0].id,
                    ...TEST_INSTALLATION_REQUESTS,
                )
            })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_UPDATE_INSTALLATION_REQUEST_MESSAGE, {
                variant: 'success',
                autoHideDuration: 5000,
            })
        })
        test('when createInstallationRequest rejects, an error snackbar is shown', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequests(), { initialState: {} })

            act(() => {
                result.current.createInstallationRequeest()
            })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_CREATE_INSTALLATION_REQUEST_MESSAGE, {
                variant: 'error',
                autoHideDuration: 5000,
            })
        })
        test('when createInstallationRequeest resolves, a success snackbar is shown', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequests(), { initialState: {} })

            act(() => {
                result.current.createInstallationRequeest(TEST_CREATE_INSTALLATION_REQUEST)
            })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_CREATE_INSTALLATION_REQUEST_MESSAGE, {
                variant: 'success',
                autoHideDuration: 5000,
            })
        })
        test('when deleteInstallationRequest rejects, a snackbar is shown', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useInstallationRequests(), { initialState: {} })

            act(() => {
                result.current.deleteInstallationRequest()
            })

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_DELETE_INSTALLTION_REQUEST_MESSAGE, {
                variant: 'error',
                autoHideDuration: 5000,
            })
        })
        test('when deleteInstallationRequest resolves, a success snackbar is shown', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequests(), { initialState: {} })

            act(() => {
                result.current.deleteInstallationRequest(TEST_INSTALLATION_REQUESTS[0].id)
            })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_DELETE_INSTALLTION_REQUEST_MESSAGE, {
                variant: 'success',
                autoHideDuration: 5000,
            })
        })
    })
})
