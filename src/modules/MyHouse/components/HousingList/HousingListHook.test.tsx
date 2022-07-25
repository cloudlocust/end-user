import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useHousingList } from 'src/modules/MyHouse/components/HousingList/HousingListHook'

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

const TEST_LOAD_HOUSINGS_ERROR_MESSAGE = 'Erreur lors du chargement des logements'

describe('housingListHook test', () => {
    describe('Builder functions', () => {
        test('loadHousingError, snackbar should be called with error message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative size to fake an error in the msw.
            } = reduxedRenderHook(() => useHousingList(-1), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_HOUSINGS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })
    })
})
