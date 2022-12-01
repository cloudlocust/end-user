import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_ECOWATT_EROOR } from 'src/mocks/handlers/ecowatt'
import { useEcowatt } from 'src/modules/Ecowatt/EcowattHook'

const mockEnqueueSnackbar = jest.fn()
const SNACKBAR_ECOWATT_ERROR = 'Erreur lors de la récupération des données de Ecowatt'

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

describe('useEcowatt hook', () => {
    test('when getEcowattSignals request passes  succesfully', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcowatt())
        expect(result.current.isLoadingInProgress).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.ecowattData).toBeTruthy()
    })
    test('when getEcowattSignals request fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_ECOWATT_EROOR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcowatt(), { store })
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 6000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_ECOWATT_ERROR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
