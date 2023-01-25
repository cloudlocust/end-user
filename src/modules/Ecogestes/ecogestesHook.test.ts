import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import useEcogestesByCategory from './ecogestesHook'

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

describe('EcogesteHook test', () => {
    describe('Get By Category', () => {
        test('getByCategory error, snackbar should be called with error message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative category to fake an error in the msw.
                // See Handler for more details.
            } = reduxedRenderHook(() => useEcogestesByCategory(-1), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
                variant: 'error',
            })
        })
        test('getByCategory with correct ID should return ecogestes array', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // Giving negative size to fake an error in the msw.
            } = reduxedRenderHook(() => useEcogestesByCategory(1), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)

            expect(result.current.elementList).toBeTruthy()
            expect(result.current.elementList.length).toBeGreaterThanOrEqual(2)
        })
    })
})
