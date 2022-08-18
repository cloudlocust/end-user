import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useContractList, useContractDetails } from 'src/modules/Contracts/contractsHook'
import { TEST_HOUSE_ID, TEST_SUCCESS_ID } from 'src/mocks/handlers/contracts'
import { act } from '@testing-library/react-hooks'

const mockEnqueueSnackbar = jest.fn()
const mockHouseId = TEST_HOUSE_ID

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

/**
 * Mocking the react-router-dom used in contractsHooks.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams to get the houseId from url.
     *
     * @returns UseParams containing houseId.
     */
    useParams: () => ({
        houseId: `${mockHouseId}`,
    }),
}))

const TEST_LOAD_CONTRACTS_ERROR_MESSAGE = 'Erreur lors du chargement des contrats'
const TEST_SUCCESS_REMOVE_CONTRACT_MESSAGE = 'Succès lors de la suppression du contrat'
const TEST_ERROR_REMOVE_CONTRACT_MESSAGE = 'Erreur lors de la suppression du contrat'
describe('useContractsList test', () => {
    describe('Load Contracts', () => {
        test('When load error snackbar should be called with error message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractList(-1), { initialState: {} })
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
})
describe('useContractDetails test', () => {
    describe('removeContractDetails test', () => {
        test('Success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useContractDetails(TEST_SUCCESS_ID), { initialState: {} })
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
            } = reduxedRenderHook(() => useContractDetails(0), { initialState: {} })
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
})
