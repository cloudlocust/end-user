import { act } from '@testing-library/react-hooks'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { TEST_NOVU_ALERTS_DATA } from 'src/mocks/handlers/novuAlertPreferences'
import { useNovuAlertPreferences } from 'src/modules/Layout/Toolbar/components/Alerts/NovuAlertPreferencesHook'

const mockEnqueueSnackbar = jest.fn()
const SNACKBAR_GET_NOVU_ALERTS_ERROR = 'Erreur lors de la récupération des alertes'
const SNACKBAR_UPDATE_NOVU_ALERTS_ERROR = 'Erreur lors de la modification des alertes'
const SNACKBAR_UPDATE_NOVU_ALERTS_SUCCESS = 'Les alertes ont été modifiés avec succès'

const novuAlertsData = applyCamelCase(TEST_NOVU_ALERTS_DATA)

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

describe('useNovuAlertPreferences hook', () => {
    test('when getNovuAlertPreferences resolves', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useNovuAlertPreferences())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.getNovuAlertPreferences(TEST_HOUSE_ID)
        })
        expect(result.current.isLoadingInProgress).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.novuAlertPreferences).toBeTruthy()
    }, 6000)
    test('when getNovuAlertPreferences fails', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useNovuAlertPreferences())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.getNovuAlertPreferences()
        })
        expect(result.current.isLoadingInProgress).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_GET_NOVU_ALERTS_ERROR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
    test('when updateNovuAlertPreferences resolves', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useNovuAlertPreferences())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.updateNovuAlertPreferences(TEST_HOUSE_ID, novuAlertsData)
        })
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 6000 },
        )
        expect(result.current.isLoadingInProgress).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_UPDATE_NOVU_ALERTS_SUCCESS, {
            autoHideDuration: 5000,
            variant: 'success',
        })
    })
    test('when updateNovuAlertPreferences fails', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useNovuAlertPreferences())
        expect(result.current.isLoadingInProgress).toBeFalsy()
        act(() => {
            result.current.updateNovuAlertPreferences()
        })
        expect(result.current.isLoadingInProgress).toBeFalsy()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SNACKBAR_UPDATE_NOVU_ALERTS_ERROR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
