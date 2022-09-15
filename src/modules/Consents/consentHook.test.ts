import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_SUCCESS_ENEDIS_SGE_CONSENT } from 'src/mocks/handlers/consents'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { MeterVerificationEnum } from 'src/modules/Consents/Consents.d'
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
const TEST_ERROR = 'error'

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
        await store.dispatch.userModel.setAuthenticationToken(TEST_ERROR)

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
    test('when verifyMater request is performed succesfully', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken('')
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.meterVerification).toStrictEqual(MeterVerificationEnum.NOT_VERIFIED)
        act(() => {
            result.current.verifyMeter(TEST_HOUSES[0].id)
        })
        await waitForValueToChange(
            () => {
                return result.current.isMeterVerifyLoading
            },
            { timeout: 6000 },
        )
        expect(result.current.meterVerification).toStrictEqual(MeterVerificationEnum.VERIFIED)
    })
    test('when verifyMeter request fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_ERROR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.meterVerification).toStrictEqual(MeterVerificationEnum.NOT_VERIFIED)
        act(() => {
            result.current.verifyMeter(TEST_HOUSES[0].id)
        })
        await waitForValueToChange(
            () => {
                return result.current.isMeterVerifyLoading
            },
            { timeout: 6000 },
        )
        expect(result.current.meterVerification).toStrictEqual(MeterVerificationEnum.NOT_VERIFIED)
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur lors de la vérification de votre compteur', {
            autoHideDuration: 5000,
            variant: 'error',
        })
    }, 10000)
    test('when createEnedisSgeConsent requestt is performed successfully', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken('')
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.isEnedisSgeConsentLoading).toBeFalsy()

        act(() => {
            result.current.createEnedisSgeConsent(TEST_HOUSES[0].id)
        })
        expect(result.current.isEnedisSgeConsentLoading).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isEnedisSgeConsentLoading
            },
            { timeout: 6000 },
        )

        expect(result.current.enedisSgeConsent.enedisSgeConsentState).toStrictEqual(
            TEST_SUCCESS_ENEDIS_SGE_CONSENT.enedis_sge_consent_state,
        )
    })
    test('when createEnedisSgeConsent request fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_ERROR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.isEnedisSgeConsentLoading).toBeFalsy()

        act(() => {
            result.current.createEnedisSgeConsent(TEST_HOUSES[0].id)
        })
        expect(result.current.isEnedisSgeConsentLoading).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isEnedisSgeConsentLoading
            },
            { timeout: 6000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur lors de la création de votre compteur', {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
