import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import {
    useInstallationRequestDetails,
    useInstallationRequestsList,
} from 'src/modules/InstallationRequests/installationRequestsHooks'
import { TEST_INSTALLATION_REQUESTS } from 'src/mocks/handlers/installationRequests'
import { act } from '@testing-library/react-hooks'

const mockEnqueueSnackbar = jest.fn()

const { id, created_at, updated_at, ...rest } = TEST_INSTALLATION_REQUESTS[0]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TEST_CREATE_INSTALLATION_REQUEST = rest
const ERROR_SNACKBAR_GET_MESSAGE = 'Erreur lors du chargement des demandes'
const SUCCESS_SNACKBAR_EDIT_MESSAGE = 'Succès lors de la modification de la demande'
// const ERROR_SNACKBAR_EDT_MESSAGE = 'Erreur lors de la modification de la demande'
const SUCCESS_SNACKBAR_CREATE_MESSAGE = "Succès lors de l'ajout de la demande"
const SUCCESS_SNACKBAR_DELETE_MESSAGE = 'Succès lors de la suppression de la demande'
const ERROR_SNACKBAR_DELETE_MESSAGE = 'Erreur lors de la suppression de la demande'

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
        /* Get Elements */
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_SNACKBAR_GET_MESSAGE, {
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

        /* Add Element */
        test('snackbar succes is shown when addElement request resolves', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequestsList(), { initialState: {} })

            act(() => {
                result.current.addElement(TEST_CREATE_INSTALLATION_REQUEST)
            })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_SNACKBAR_CREATE_MESSAGE, {
                variant: 'success',
            })
        })
    })
    describe('useInstallationDetails', () => {
        test('success snackbar when edit installation request resolves', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequestDetails(TEST_INSTALLATION_REQUESTS[0].id), {
                initialState: {},
            })
            act(() => {
                result.current.editElementDetails()
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_SNACKBAR_EDIT_MESSAGE, {
                variant: 'success',
            })
        })
        test('error snackbar when edit installation request fails', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useInstallationRequestDetails(-1), { initialState: {} })
            act(() => {
                result.current.editElementDetails(null)
            })
            expect(result.current.loadingInProgress).toBe(true)
            // todo: to fix later
            // await waitForValueToChange(
            //     () => {
            //         return result.current.loadingInProgress
            //     },
            //     { timeout: 4000 },
            // )
            // expect(result.current.loadingInProgress).toBe(false)
            // expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_SNACKBAR_EDT_MESSAGE, {
            //     variant: 'error',
            // })
        })
        test('success snackbar when delete installation request resolves', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequestDetails(TEST_INSTALLATION_REQUESTS[0].id), {
                initialState: {},
            })
            act(() => {
                result.current.removeElementDetails(TEST_INSTALLATION_REQUESTS[0].id)
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_SNACKBAR_DELETE_MESSAGE, {
                variant: 'success',
            })
        })
        test('error snackbar when delete installation request fails', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallationRequestDetails(-1), {
                initialState: {},
            })
            act(() => {
                result.current.removeElementDetails(null)
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_SNACKBAR_DELETE_MESSAGE, {
                variant: 'error',
            })
        })
    })
})
