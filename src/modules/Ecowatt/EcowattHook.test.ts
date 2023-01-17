import { act } from '@testing-library/react-hooks'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { TEST_ECOWATT_ALERTS_DATA, TEST_ECOWATT_EROOR } from 'src/mocks/handlers/ecowatt'
import { useEcowatt } from 'src/modules/Ecowatt/EcowattHook'

const mockEnqueueSnackbar = jest.fn()
const SNACKBAR_ECOWATT_ERROR = 'Erreur lors de la récupération des données de Ecowatt'
const SNACKBAR_GET_ECOWATT_ALERTS_ERRPR = 'Erreur lors de la récupération des alertes Ecowatts'
const SNACKBAR_UPDATE_ECOWATT_ALERTS_ERRPR = "Erreur lors de la modification d'une alerte Ecowatts"
const SNACKBAR_UPDATE_ECOWATT_ALERTS_SUCCESS = 'Les alertes écowatt ont été modifié avec succès'

const ecowattAlertsData = applyCamelCase(TEST_ECOWATT_ALERTS_DATA)

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
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcowatt(true))

        expect(result.current.isLoadingInProgress).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.ecowattSignalsData.length).toBeGreaterThan(0)
    })
    test('when getEcowattSignals request fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_ECOWATT_EROOR)

        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcowatt(true))

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
    test('when getEcowattAlerts resolves', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcowatt())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.getEcowattAlerts(TEST_HOUSE_ID)
        })
        expect(result.current.isLoadingInProgress).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.ecowattAlerts).toBeTruthy()
    }, 6000)
    test('when getEcowattAlerts fails', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useEcowatt())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.getEcowattAlerts()
        })
        expect(result.current.isLoadingInProgress).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_GET_ECOWATT_ALERTS_ERRPR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
    test('when updateEcowattAlerts resolves', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcowatt())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.updateEcowattAlerts(TEST_HOUSE_ID, ecowattAlertsData)
        })
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.isLoadingInProgress).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_UPDATE_ECOWATT_ALERTS_SUCCESS, {
            autoHideDuration: 5000,
            variant: 'success',
        })
    })
    test('when updateEcowattAlerts fails', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useEcowatt())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.updateEcowattAlerts()
        })
        expect(result.current.isLoadingInProgress).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_UPDATE_ECOWATT_ALERTS_ERRPR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
