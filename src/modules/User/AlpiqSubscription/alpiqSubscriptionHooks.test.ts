import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import {
    ELIGIBILITY_ERROR_MESSAGE,
    MONTHLY_ESTIMATION_ERROR_MESSAGE,
    NO_HOUSING_ERROR_MESSAGE,
    useAlpiqProvider,
} from 'src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { CreateAlpiqSubscriptionDataType } from 'src/modules/User/AlpiqSubscription/index.d'
import { applyCamelCase } from 'src/common/react-platform-components'

const mockEnqueueSnackbar = jest.fn()
const TEST_SNACKBAR_ERROR = 'snackbar_error'
const mockOnAfterValidation = jest.fn()
let mockCreateSubscriptionBody: CreateAlpiqSubscriptionDataType = {
    modeFacturation: 'REEL',
    jourPrelevement: 27,
    dateDebutContrat: '23-03-2026',
    addressFacturation: applyCamelCase(TEST_HOUSES[0].address),
    iban: 'FR7493938387299828278',
    nomAssocieIban: 'Dupont',
    prenomAssocieIban: 'Jean',
    puissanceSouscrite: 6,
    optionTarifaire: 'BASE',
    mensualite: 120,
}
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

describe('Test useAlpiqProvider functions', () => {
    describe('Test Get monthly subscription estimation', () => {
        test('When no housingId, returns error message', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useAlpiqProvider())
            result.current.getMonthlySubscriptionEstimation(3, 'BASE', undefined)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(NO_HOUSING_ERROR_MESSAGE, {
                variant: 'error',
            })
        })
        test('When server error, returns error message', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_SNACKBAR_ERROR)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useAlpiqProvider())
            result.current.getMonthlySubscriptionEstimation(3, 'BASE', 1)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MONTHLY_ESTIMATION_ERROR_MESSAGE, {
                variant: 'error',
            })
            await store.dispatch.userModel.setAuthenticationToken('') // reset
        })
        test('When performed successfully, returns value', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useAlpiqProvider())
            const resultEstimation = await result.current.getMonthlySubscriptionEstimation(3, 'BASE', 2)
            expect(resultEstimation).toBe(33)
        })
    })
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
            await store.dispatch.userModel.setAuthenticationToken('') // reset
        }, 8000)
    })
    describe('Test create alpiq subscription', () => {
        test('When request performed successfully, enqueue snackbar with success message apprears.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useAlpiqProvider())
            result.current.createAlpiqSubscription(mockCreateSubscriptionBody, TEST_HOUSES[0].id)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Souscription reçue', {
                variant: 'success',
            })
        }, 8000)
        test('When request performed with error, enqueue snackbar with error message apprears.', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useAlpiqProvider())
            result.current.createAlpiqSubscription(mockCreateSubscriptionBody, TEST_HOUSES[1].id)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Erreur lors de la souscription au contract Alpiq', {
                variant: 'error',
            })
        }, 8000)
        test('When missing housing Id, enqueue snackbar with error message apprears.', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useAlpiqProvider())
            result.current.createAlpiqSubscription(mockCreateSubscriptionBody)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Aucun logement renseigné', {
                variant: 'error',
            })
        }, 8000)
    })
})
