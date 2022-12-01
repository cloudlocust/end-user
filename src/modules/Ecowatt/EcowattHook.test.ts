import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_ECOWATT_DATA } from 'src/mocks/handlers/ecowatt'
import { ECOWATT_ENDPOINT, useEcowatt } from 'src/modules/Ecowatt/EcowattHook'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

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
    test('when getEcowattSignals request passes succesfully', async () => {
        const mock = new MockAdapter(axios)

        mock.onGet(ECOWATT_ENDPOINT).reply(200, TEST_ECOWATT_DATA)

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
        expect(result.current.ecowattData.length).toBeGreaterThan(0)
    })
    test('when getEcowattSignals request fails', async () => {
        const mock = new MockAdapter(axios)
        mock.onGet(ECOWATT_ENDPOINT).reply(400)

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
        expect(result.current.isLoadingInProgress).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_ECOWATT_ERROR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
