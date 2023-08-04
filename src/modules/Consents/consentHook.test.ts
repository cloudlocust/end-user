import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_SUCCESS_ENEDIS_SGE_CONSENT, TEST_ERROR_ENPHASE_AUTHORIZATION } from 'src/mocks/handlers/consents'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { MeterVerificationEnum } from 'src/modules/Consents/Consents.d'
import { useConsents } from 'src/modules/Consents/consentsHook'

const mockEnqueueSnackbar = jest.fn()
const TEST_SUCCESS = 'success'
const TEST_ERROR = 'error'
const TEST_SNACKBAR_ERROR = 'snackbar_error'

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
const connectedState = 'CONNECTED'
const TEST_ENEDIS_NRLINK_ENPHASE_ERROR =
    'Nous rencontrons une erreur lors de la récupération de vos consentements d’un de vos compteurs ou capteurs. Veuillez réessayer plus tard'

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
        expect(result.current.nrlinkConsent.nrlinkConsentState).toStrictEqual(connectedState)
        expect(result.current.enedisSgeConsent.enedisSgeConsentState).toStrictEqual(connectedState)
        expect(result.current.enphaseConsent.enphaseConsentState).toStrictEqual('ACTIVE')
    }, 8000)
    test('when there is server error while fetching consents, snackbar is shown only once', async () => {
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
        expect(mockEnqueueSnackbar).toHaveBeenNthCalledWith(1, TEST_ENEDIS_NRLINK_ENPHASE_ERROR, {
            autoHideDuration: 5000,
            variant: 'error',
        })
    }, 8000)
    test('when verifyMater request is performed succesfully', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_SUCCESS)
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
    }, 8000)
    test('when verifyMeter request fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_SNACKBAR_ERROR)
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
    test('when createEnedisSgeConsent request is performed successfully', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_SUCCESS)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.isCreateEnedisSgeConsentLoading).toBeFalsy()

        act(() => {
            result.current.createEnedisSgeConsent(TEST_HOUSES[0].id)
        })
        expect(result.current.isCreateEnedisSgeConsentLoading).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isCreateEnedisSgeConsentLoading
            },
            { timeout: 6000 },
        )

        expect(result.current.enedisSgeConsent.enedisSgeConsentState).toStrictEqual(
            TEST_SUCCESS_ENEDIS_SGE_CONSENT.enedis_sge_consent_state,
        )
    }, 8000)
    test('when createEnedisSgeConsent request fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_SNACKBAR_ERROR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.isCreateEnedisSgeConsentLoading).toBeFalsy()
        expect(result.current.createEnedisSgeConsentError).toBe(false)

        act(() => {
            result.current.createEnedisSgeConsent(TEST_HOUSES[0].id)
        })
        expect(result.current.isCreateEnedisSgeConsentLoading).toBeTruthy()
        await waitForValueToChange(
            () => {
                return result.current.isCreateEnedisSgeConsentLoading
            },
            { timeout: 6000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur lors de la création de votre compteur', {
            autoHideDuration: 5000,
            variant: 'error',
        })
    }, 8000)
    test('when getEnphaseLink resolves', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken()
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.enphaseLink).toBeFalsy()
        act(() => {
            result.current.getEnphaseLink(TEST_HOUSES[0].id)
        })
        await waitForValueToChange(
            () => {
                return result.current.enphaseLink
            },
            { timeout: 6000 },
        )
        expect(result.current.enphaseLink).toBe('https://enlighten.enphaseenergy.com/')
    }, 8000)
    test('when getEnphaseLink fails', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_ERROR)
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useConsents())
        expect(result.current.enphaseLink).toBeFalsy()
        act(() => {
            result.current.getEnphaseLink()
        })
        expect(result.current.enphaseLink).toBe('')
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Erreur lors de la récupération du lien d'Enphase", {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })

    describe('revoke enphase consent', () => {
        test('when its success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_SUCCESS)
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
            expect(result.current.enphaseConsent.enphaseConsentState).toStrictEqual('ACTIVE')
            expect(result.current.isEnphaseConsentLoading).toBeFalsy()

            act(() => {
                result.current.revokeEnphaseConsent(TEST_HOUSES[0].meter?.guid)
            })
            expect(result.current.isEnphaseConsentLoading).toBeTruthy()
            await waitForValueToChange(
                () => {
                    return result.current.isEnphaseConsentLoading
                },
                { timeout: 6000 },
            )

            expect(result.current.enphaseConsentState).toBeUndefined()
        }, 8000)
        test('when fails', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_ERROR_ENPHASE_AUTHORIZATION)
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
            expect(result.current.enphaseConsent.enphaseConsentState).toStrictEqual('ACTIVE')
            expect(result.current.isEnphaseConsentLoading).toBeFalsy()

            act(() => {
                result.current.revokeEnphaseConsent(TEST_HOUSES[0].meter?.guid)
            })
            expect(result.current.isEnphaseConsentLoading).toBeTruthy()
            await waitForValueToChange(
                () => {
                    return result.current.isEnphaseConsentLoading
                },
                { timeout: 6000 },
            )
            expect(result.current.isEnphaseConsentLoading).toBeFalsy()

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
                'Erreur lors de la révokation de votre consentement enphase',
                {
                    autoHideDuration: 5000,
                    variant: 'error',
                },
            )
        }, 8000)
    })
})
