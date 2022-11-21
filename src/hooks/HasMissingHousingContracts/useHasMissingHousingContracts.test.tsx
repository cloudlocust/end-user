import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { waitFor } from '@testing-library/react'

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

const TEST_GET_HAS_MISSING_HOUSING_CONTRACTS_ERROR_MESSAGE =
    'Erreur lors de la récupération du message du contrat example'
describe('useHasMissingHousingContracts test', () => {
    describe('getHasMissingHousingContracts', () => {
        test('When load error snackbar should be called with error message', async () => {
            const {
                renderedHook: { result },
            } = reduxedRenderHook(() => useHasMissingHousingContracts(getRange('week'), -1), {
                initialState: {},
            })

            await waitFor(
                () => {
                    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
                        TEST_GET_HAS_MISSING_HOUSING_CONTRACTS_ERROR_MESSAGE,
                        {
                            variant: 'error',
                        },
                    )
                },
                { timeout: 10000 },
            )
            expect(result.current.hasMissingHousingContracts).toBe(null)
        }, 15000)

        test('When success and hasMissingHousingContracts returns false', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useHasMissingHousingContracts(getRange('week'), TEST_HOUSES[1].id), {
                initialState: {},
            })

            await waitForValueToChange(
                () => {
                    return result.current.hasMissingHousingContracts
                },
                { timeout: 4000 },
            )
            expect(result.current.hasMissingHousingContracts).toBe(false)
            expect(mockEnqueueSnackbar).not.toHaveBeenCalled()
        }, 10000)

        test('When success and hasMissingHousingContracts returns true', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useHasMissingHousingContracts(getRange('week'), TEST_HOUSES[0].id), {
                initialState: {},
            })

            await waitForValueToChange(
                () => {
                    return result.current.hasMissingHousingContracts
                },
                { timeout: 4000 },
            )
            expect(result.current.hasMissingHousingContracts).toBe(true)
            expect(mockEnqueueSnackbar).not.toHaveBeenCalled()
        })
    })
})
