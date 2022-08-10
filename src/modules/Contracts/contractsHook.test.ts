import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useContractList } from 'src/modules/Contracts/contractsHook'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'

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
})
