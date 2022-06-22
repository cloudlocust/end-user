import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useConsents } from 'src/modules/Consents/consentsHook'

const mockEnqueueSnackbar = jest.fn()

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

const TEST_METER_GUID = '123456'
const NonExistantState = 'NONEXISTENT'
const TEST_NRLINK_ERROR = 'Erreur lors de la récupération du consentement Nrlink'
const TEST_ENEDIS_ERROR = 'Erreur lors de la récupération du consentement Enedis'
const TEST_LOAD_CONSENTS = 'error'

describe('useConsents test', () => {
    test('when getConsents is called, state changes', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        act(() => {
            result.current.getConsents(TEST_METER_GUID)
        })
        await waitForValueToChange(
            () => {
                return result.current.consentsLoading
            },
            { timeout: 6000 },
        )
        expect(result.current.nrlinkConsent.nrlinkConsentState).toStrictEqual(NonExistantState)
        expect(result.current.enedisConsent.enedisConsentState).toStrictEqual(NonExistantState)
    }, 20000)
    test('when there is server error while fetching consents, snackbar is shown', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_LOAD_CONSENTS)

        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents(), { store })

        act(() => {
            result.current.getConsents(TEST_METER_GUID)
        })
        await waitForValueToChange(
            () => {
                return result.current.consentsLoading
            },
            { timeout: 6000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_NRLINK_ERROR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ENEDIS_ERROR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    }, 20000)
})
