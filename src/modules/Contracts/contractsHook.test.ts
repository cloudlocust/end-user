import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useContractList, useContractDetails } from 'src/modules/Contracts/contractsHook'
import {
    TEST_HOUSE_ID,
    TEST_SUCCESS_ID,
    TEST_SUCCESS_ADD_CONTRACT,
    TEST_ERROR_OFFER,
} from 'src/mocks/handlers/contracts'
import { act } from '@testing-library/react-hooks'

const mockEnqueueSnackbar = jest.fn()

/**
 * Mocking the useSnackbar used in CustomerDetails to load the customerDetails based on url /customers/:id {id} params.
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

const TEST_LOAD_CONTRACTS_ERROR_MESSAGE = 'Erreur lors du chargement des contrats'
// ADD Contract
const TEST_SUCCESS_ADD_CONTRACT_MESSAGE = "Succès lors de l'ajout du contrat"
const TEST_ERROR_OFFER_ADD_CONTRACT_MESSAGE = "L'offre est invalide"
const TEST_ERROR_ADD_CONTRACT_MESSAGE = "Erreur lors de l'ajout du contrat"
// REMOVE Contract
const TEST_SUCCESS_REMOVE_CONTRACT_MESSAGE = 'Succès lors de la suppression du contrat'
const TEST_ERROR_REMOVE_CONTRACT_MESSAGE = 'Erreur lors de la suppression du contrat'
// Edit Contract
const TEST_SUCCESS_EDIT_CONTRACT_MESSAGE = 'Succès lors de la modification du contrat'
const TEST_ERROR_OFFER_EDIT_CONTRACT_MESSAGE = "L'offre est invalide"
const TEST_ERROR_EDIT_CONTRACT_MESSAGE = 'Erreur lors de la modification du contrat'
describe('useContractsList test', () => {
    describe('Load Contracts', () => {
        test('When load error snackbar should be called with error message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractList(TEST_HOUSE_ID, -1), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_CONTRACTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })
    })
    describe('add Contract when', () => {
        test('fail, error message from backend', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractList(TEST_HOUSE_ID), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Element is added.
            act(async () => {
                try {
                    await result.current.addElement({ ...TEST_SUCCESS_ADD_CONTRACT, offerId: TEST_ERROR_OFFER })
                } catch (err) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Message Error
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ERROR_OFFER_ADD_CONTRACT_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
        test('fail, default error message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractList(TEST_HOUSE_ID), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Element is added.
            act(async () => {
                try {
                    await result.current.addElement({ ...TEST_SUCCESS_ADD_CONTRACT, contractTypeId: TEST_ERROR_OFFER })
                } catch (err) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Message Error
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ERROR_ADD_CONTRACT_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
        test('success, contract should be added', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractList(TEST_HOUSE_ID), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Element is added.
            act(async () => {
                try {
                    await result.current.addElement(TEST_SUCCESS_ADD_CONTRACT)
                } catch (err) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SUCCESS_ADD_CONTRACT_MESSAGE, {
                variant: 'success',
            })
        }, 10000)
    })
})
describe('useContractDetails test', () => {
    describe('removeContractDetails test', () => {
        test('Success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractDetails(TEST_HOUSE_ID, TEST_SUCCESS_ID), { initialState: {} })
            act(() => {
                result.current.removeElementDetails()
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SUCCESS_REMOVE_CONTRACT_MESSAGE, {
                variant: 'success',
            })
        }, 10000)
        test('Error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractDetails(TEST_HOUSE_ID, 0), { initialState: {} })
            act(() => {
                result.current.removeElementDetails()
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ERROR_REMOVE_CONTRACT_MESSAGE, { variant: 'error' })
        }, 10000)
    })

    describe('editContractDetails test', () => {
        test('Success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractDetails(TEST_HOUSE_ID, TEST_SUCCESS_ID), { initialState: {} })
            // Element is edited.
            act(async () => {
                try {
                    await result.current.editElementDetails({ ...TEST_SUCCESS_ADD_CONTRACT, offerId: TEST_ERROR_OFFER })
                } catch (err) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SUCCESS_EDIT_CONTRACT_MESSAGE, {
                variant: 'success',
            })
        }, 10000)
        test('Error detail from backend', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractDetails(TEST_HOUSE_ID, 0), { initialState: {} })
            // Element is edited.
            act(async () => {
                try {
                    await result.current.editElementDetails({ ...TEST_SUCCESS_ADD_CONTRACT, offerId: TEST_ERROR_OFFER })
                } catch (error) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ERROR_OFFER_EDIT_CONTRACT_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
        test('Error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractDetails(TEST_HOUSE_ID, 0), { initialState: {} })
            // Element is edited.
            act(async () => {
                try {
                    await result.current.editElementDetails({ ...TEST_SUCCESS_ADD_CONTRACT })
                } catch (error) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ERROR_EDIT_CONTRACT_MESSAGE, { variant: 'error' })
        }, 10000)
    })
})
