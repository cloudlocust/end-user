import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { ELIGIBILITY_ERROR_MESSAGE, useAlpiqProvider } from 'src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'

const mockEnqueueSnackbar = jest.fn()
const TEST_SNACKBAR_ERROR = 'snackbar_error'
const mockOnAfterValidation = jest.fn()

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

describe('Test Verify alpiq eligibility', () => {
    test('when verification request is performed succesfully, returns true value', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useAlpiqProvider())
        result.current.verifyMeterEligibility(TEST_HOUSES[0].id, mockOnAfterValidation)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 6000 },
        )
        expect(mockOnAfterValidation).toHaveBeenCalledTimes(1)
    }, 8000)
    test('when verifyMater request is performed succesfully, returns false value', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useAlpiqProvider())
        result.current.verifyMeterEligibility(TEST_HOUSES[1].id, mockOnAfterValidation)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 6000 },
        )
        expect(mockOnAfterValidation).not.toHaveBeenCalled()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Votre PDL/PRM n'est pas éligible", {
            variant: 'error',
        })
    }, 8000)
    test('when verification request fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_SNACKBAR_ERROR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useAlpiqProvider())
        result.current.verifyMeterEligibility(TEST_HOUSES[0].id)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 6000 },
        )
        expect(mockOnAfterValidation).not.toHaveBeenCalled()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ELIGIBILITY_ERROR_MESSAGE, {
            variant: 'error',
        })
    }, 8000)
})
