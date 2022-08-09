import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useHousingList, useHousingsDetails } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { act } from '@testing-library/react-hooks'
import { falseAddress, TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { applyCamelCase } from 'src/common/react-platform-components/utils/mm'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
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
const ERROR_REMOVE_MESSAGE = 'Erreur lors de la Suppression du logement'
const SUCCESS_REMOVE_MESSAGE = 'Le logement a été supprimé'
const ERROR_ADD_MESSAGE = "Erreur lors de l'ajout du logement"
const SUCCESS_ADD_MESSAGE = 'Le logement a été ajouté'
const newAddress = {
    city: 'city',
    zipCode: 'zipCode',
    country: 'counry',
    lat: 7,
    lng: 7,
    name: 'name',
    placeId: 'placeId',
    addressAddition: undefined,
}

describe('housingstHooks test', () => {
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
    describe('add housing', () => {
        test('when fail, housing should not be added', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useHousingList(), { initialState: {} })

            // wait for elements to load.
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            let lengthBeforeAdd = result.current.elementList.length
            act(async () => {
                try {
                    await result.current.addElement({ address: falseAddress })
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
            expect(result.current.elementList.length).toEqual(lengthBeforeAdd)
            expect(mockEnqueueSnackbar).toHaveBeenLastCalledWith(ERROR_ADD_MESSAGE, {
                variant: 'error',
            })
        })
        test('when success, housing should be added', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useHousingList(), { initialState: {} })

            // wait for elements to load.
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            act(async () => {
                try {
                    await result.current.addElement({
                        address: newAddress,
                    })
                } catch (err) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 5000 },
            )

            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenLastCalledWith(SUCCESS_ADD_MESSAGE, {
                variant: 'success',
            })
        })
    })
    describe('remove housing', () => {
        test('when fail, housings should not be removed', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useHousingsDetails(), { initialState: {} })

            expect(result.current.loadingRequest).toBe(false)
            const fakeId = 'fakeId'
            act(async () => {
                try {
                    // FAKE ID that's different from the TEST_SUCCESS_COMMENT
                    await result.current.removeHousing(fakeId)
                } catch (err) {}
            })
            expect(result.current.loadingRequest).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingRequest
                },
                { timeout: 2000 },
            )

            expect(result.current.loadingRequest).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_REMOVE_MESSAGE, { variant: 'error' })
        })
        test('when success, comments should be removed', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useHousingsDetails(), { initialState: {} })

            expect(result.current.loadingRequest).toBe(false)
            act(() => {
                result.current.removeHousing(TEST_MOCKED_HOUSES[0].id)
            })
            expect(result.current.loadingRequest).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingRequest
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingRequest).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_REMOVE_MESSAGE, { variant: 'success' })
        })
    })
})
