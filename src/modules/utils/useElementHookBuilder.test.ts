import { BuilderUseElementDetails, BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { act } from 'react-dom/test-utils'
import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'
import { searchFilterType } from 'src/modules/utils'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES, falseAddress } from 'src/mocks/handlers/houses'
//https://www.toptal.com/react/testing-react-hooks-tutorial
//https://mswjs.io/docs/comparison

const mockHistoryReplace = jest.fn()
const mockEnqueueSnackbar = jest.fn()
const SEARCH_INPUT = 'ervin'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        replace: mockHistoryReplace,
    }),
}))

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

const defaultAddErrorMessage = "Erreur lors de l'ajout de l'élément"
const defaultAddSuccessMessage = "Succès lors de l'ajout de l'élément"
const defaultRemoveErrorMessage = "Erreur lors de la suppression de l'élément"
const defaultRemoveSuccessMessage = "Succès lors de la suppression de l'élément"
const TEST_SIZE = 1

const TEST_SUCCESS_HOUSE_ID = 1
const TEST_ERROR_HOUSE_ID = 'fakeId'
describe('BuilderUseElementList', () => {
    describe('loadElementList', () => {
        test('When Builder instanciated with pagination Table', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: 1,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(true), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.elementList.length).toBeGreaterThan(0)
            expect(result.current.loadingInProgress).toBe(false)
        })

        test('Load Page, should load elementList of the new page', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(true), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(result.current.elementList).toHaveLength(TEST_SIZE)
            const prevElementList = result.current.elementList

            act(() => {
                result.current.loadPage(2)
            })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 2000 },
            )
            expect(result.current.elementList).toHaveLength(TEST_SIZE)
            expect(result.current.elementList[0].id).not.toBe(prevElementList[0].guid)
        })

        test('NextPage and PreviousPage', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(true), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(result.current.elementList).toHaveLength(TEST_SIZE)
            const firstLoadElementList = result.current.elementList
            // Next Page
            act(() => {
                result.current.nextPage()
            })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 2000 },
            )
            expect(result.current.elementList).toHaveLength(TEST_SIZE)
            expect(result.current.elementList[0].id).not.toBe(firstLoadElementList[0].id)

            // Previous Page
            act(() => {
                result.current.previousPage()
            })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 2000 },
            )
            expect(result.current.elementList).toHaveLength(TEST_SIZE)
            expect(result.current.elementList[0].id).toBe(firstLoadElementList[0].id)
        }, 10000)
        test('when builder instanciated  valid endpoint hook should be instanciated and elementList should be filled', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.elementList.length).toBeGreaterThan(0)
            expect(result.current.loadingInProgress).toBe(false)
        })
        test('When indicating a size and valid endpoint, initially elementList should have the length of the indicated size', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.elementList).toHaveLength(TEST_SIZE)
            expect(result.current.loadingInProgress).toBe(false)
        })

        test('loadMoreElements, when called elementList should be more filled with size indicated', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            act(() => {
                result.current.loadMoreElements()
            })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 5000 },
            )
            expect(result.current.elementList).toHaveLength(TEST_SIZE * 2)
        }, 10000)

        test('ReloadElements, when called elementList should be filled with default size', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)

            // LOAD MORE ELEMENTS
            act(() => {
                result.current.loadMoreElements()
            })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 5000 },
            )
            expect(result.current.elementList).toHaveLength(TEST_SIZE * 2)

            // RELOAD ELEMENTS
            act(() => {
                result.current.reloadElements()
            })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 5000 },
            )
            expect(result.current.elementList).toHaveLength(TEST_SIZE)
        }, 20000)

        test('updateFilters, when updating filters reloadElements should be called with new filters', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Search customers with word: ervin.
            act(() => {
                result.current.updateFilters({ search: SEARCH_INPUT })
            })
            // Wait for the elementList to load again with filters update.
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.elementList.length).toBeGreaterThan(0)
        }, 10000)
        test('default filter', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(false, { search: SEARCH_INPUT }), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(result.current.elementList.length).toBeGreaterThan(0)
        })
    })

    describe('addElement test', () => {
        test('when Success, snackbar should be called with default message', async () => {
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(), { initialState: {} })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            act(() => {
                result.current.addElement(TEST_HOUSES[0])
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(defaultAddSuccessMessage, { variant: 'success' })
        })
        test('when error, snackbar should be called with default message', async () => {
            const useElementList = BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
                API_ENDPOINT: HOUSING_API,
                sizeParam: TEST_SIZE,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementList(), { initialState: {} })
            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            act(async () => {
                try {
                    await result.current.addElement({ ...TEST_HOUSES[0], address: falseAddress })
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(defaultAddErrorMessage, { variant: 'error' })
        }, 8000)
    })
})

describe('BuilderUseElementDetails', () => {
    describe('removeElementDetails test', () => {
        test('Success', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementDetails = BuilderUseElementDetails<IHousing, {}, IHousing>({
                API_ENDPOINT: `${HOUSING_API}/${TEST_SUCCESS_HOUSE_ID}`,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementDetails(), { initialState: {} })
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(defaultRemoveSuccessMessage, { variant: 'success' })
        }, 8000)
        test('Error', async () => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const useElementDetails = BuilderUseElementDetails<IHousing, {}, IHousing>({
                API_ENDPOINT: `${HOUSING_API}/${TEST_ERROR_HOUSE_ID}`,
            })
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useElementDetails(), { initialState: {} })
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(defaultRemoveErrorMessage, { variant: 'error' })
        }, 8000)
    })
})
