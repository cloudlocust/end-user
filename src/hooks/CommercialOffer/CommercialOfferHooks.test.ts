import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import {
    TEST_AUTHORIZATION_LOAD_ERROR_CONTRACT_TYPES,
    TEST_LOAD_ERROR_ID,
    TEST_LOAD_SUCCESS_ID,
} from 'src/mocks/handlers/commercialOffer'
import { useCommercialOffer } from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { act } from 'react-dom/test-utils'

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

const TEST_LOAD_CONTRACT_TYPES_ERROR_MESSAGE = 'Erreur lors du chargement des types de contrat'
const TEST_LOAD_PROVIDERS_ERROR_MESSAGE = 'Erreur lors du chargement des fournisseurs'
const TEST_LOAD_OFFERS_ERROR_MESSAGE = 'Erreur lors du chargement des offres'
const TEST_LOAD_TARIFF_TYPES_ERROR_MESSAGE = 'Erreur lors du chargement des types de tariff'
const TEST_LOAD_POWERS_ERROR_MESSAGE = 'Erreur lors du chargement des puissances de contrat'

describe('useCommercialOffer Hook test', () => {
    describe('Load Contract Types', () => {
        test('When load error snackbar should be called with error message', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_AUTHORIZATION_LOAD_ERROR_CONTRACT_TYPES)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), { store })

            act(() => {
                result.current.loadContractTypes()
            })
            expect(result.current.isContractTypesLoading).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isContractTypesLoading
                },
                { timeout: 4000 },
            )
            expect(result.current.isContractTypesLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_CONTRACT_TYPES_ERROR_MESSAGE, {
                variant: 'error',
            })
        })

        test('When load success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken('')

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), { store })

            act(() => {
                result.current.loadContractTypes()
            })
            await waitForValueToChange(
                () => {
                    return result.current.contractTypeList
                },
                { timeout: 8000 },
            )
            expect(result.current.isContractTypesLoading).toBe(false)
            expect(result.current.contractTypeList.length).toBeGreaterThan(0)
        }, 10000)
    })
    describe('Load Providers', () => {
        test('Providers load error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadProviders(TEST_LOAD_ERROR_ID)
            })
            expect(result.current.isProvidersLoading).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isProvidersLoading
                },
                { timeout: 4000 },
            )
            expect(result.current.isProvidersLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_PROVIDERS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })

        test('Providers load success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadProviders(TEST_LOAD_SUCCESS_ID)
            })
            await waitForValueToChange(
                () => {
                    return result.current.providerList
                },
                { timeout: 8000 },
            )
            expect(result.current.isProvidersLoading).toBe(false)
            expect(result.current.providerList.length).toBeGreaterThan(0)
        }, 10000)
    })
    describe('Load Offers', () => {
        test('Offers load error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadOffers(TEST_LOAD_ERROR_ID, TEST_LOAD_ERROR_ID)
            })
            expect(result.current.isOffersLoading).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isOffersLoading
                },
                { timeout: 4000 },
            )
            expect(result.current.isOffersLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_OFFERS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })

        test('Offers load success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadOffers(TEST_LOAD_SUCCESS_ID, TEST_LOAD_SUCCESS_ID)
            })
            await waitForValueToChange(
                () => {
                    return result.current.offerList
                },
                { timeout: 8000 },
            )
            expect(result.current.isOffersLoading).toBe(false)
            expect(result.current.offerList.length).toBeGreaterThan(0)
        }, 10000)
    })

    describe('Load TariffTypes', () => {
        test('Tariff Types load error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadTariffTypes(TEST_LOAD_ERROR_ID)
            })
            expect(result.current.isTariffTypesLoading).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isTariffTypesLoading
                },
                { timeout: 4000 },
            )
            expect(result.current.isTariffTypesLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_TARIFF_TYPES_ERROR_MESSAGE, {
                variant: 'error',
            })
        })

        test('Tariff Types load success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadTariffTypes(TEST_LOAD_SUCCESS_ID)
            })
            await waitForValueToChange(
                () => {
                    return result.current.tariffTypeList
                },
                { timeout: 8000 },
            )
            expect(result.current.isTariffTypesLoading).toBe(false)
            expect(result.current.tariffTypeList.length).toBeGreaterThan(0)
        }, 10000)
    })
    describe('Load Powers', () => {
        test('Powers load error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadPowers(TEST_LOAD_ERROR_ID)
            })
            expect(result.current.isPowersLoading).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isPowersLoading
                },
                { timeout: 4000 },
            )
            expect(result.current.isPowersLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_POWERS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })

        test('Powers load success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useCommercialOffer(), {})

            act(() => {
                result.current.loadPowers(TEST_LOAD_SUCCESS_ID, TEST_LOAD_SUCCESS_ID)
            })
            await waitForValueToChange(
                () => {
                    return result.current.powerList
                },
                { timeout: 8000 },
            )
            expect(result.current.isPowersLoading).toBe(false)
            expect(result.current.powerList.length).toBeGreaterThan(0)
        }, 10000)
    })
})
