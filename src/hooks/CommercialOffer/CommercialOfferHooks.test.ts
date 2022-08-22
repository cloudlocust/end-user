import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_AUTHORIZATION_LOAD_ERROR_COMMERCIAL_OFFER } from 'src/mocks/handlers/commercialOffer'
import { useCommercialOffer } from 'src/hooks/CommercialOffer/CommercialOfferHooks'
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

const TEST_LOAD_COMMERCIAL_OFFER_ERROR_MESSAGE = 'Erreur lors du chargement des offres commerciales'
describe('useCommercialOffer Hook test', () => {
    describe('Load Commercial Offer', () => {
        test('When load error snackbar should be called with error message', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_AUTHORIZATION_LOAD_ERROR_COMMERCIAL_OFFER)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), { store })
            expect(result.current.loadingCommercialInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingCommercialInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingCommercialInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_COMMERCIAL_OFFER_ERROR_MESSAGE, {
                variant: 'error',
            })
        })

        test('When load success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken('')

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), { store })

            await waitForValueToChange(
                () => {
                    return result.current.commercialOffer
                },
                { timeout: 8000 },
            )
            expect(result.current.loadingCommercialInProgress).toBe(false)
            expect(result.current.commercialOffer.providers.length).toBeGreaterThan(0)
            expect(result.current.commercialOffer.tariffType.length).toBeGreaterThan(0)
        }, 10000)
    })
})
