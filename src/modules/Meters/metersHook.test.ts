import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import { useMeterList } from 'src/modules/Meters/metersHook'
import { TEST_ADD_METER, TEST_ERROR_METER_GUID, TEST_ERROR_METER_NAME } from 'src/mocks/handlers/meters'

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

const TEST_LOAD_METERS_ERROR_MESSAGE = 'Erreur lors du chargement des compteurs'
const TEST_ADD_METER_DUPLICATE_GUID_ERROR_MESSAGE = 'Le numéro de compteur existe déjà'
const TEST_ADD_METER_DUPLICATE_NAME_ERROR_MESSAGE = 'Le nom de compteur existe déjà'
const TEST_ADD_METER_ERROR_MESSAGE = "Erreur lors de l'ajout du compteur"
const TEST_ADD_METER_SUCCESS_MESSAGE = 'Succès lors de la configuration du compteur'
describe('MetersListHook test', () => {
    describe('Load Meters', () => {
        test('When load error snackbar should be called with error message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterList(-1), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_METERS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })
    })
    describe('add Meter when', () => {
        test('fail, duplicate guid addElementError function should be called with function message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterList(10), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Element is added at the beginning of the elementList.
            act(async () => {
                try {
                    await result.current.addElement({ ...TEST_ADD_METER, guid: TEST_ERROR_METER_GUID })
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_METER_DUPLICATE_GUID_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 10000)
        test('fail, duplicate name addElementError function should be called with function message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterList(10), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Element is added at the beginning of the elementList.
            act(async () => {
                try {
                    await result.current.addElement({ ...TEST_ADD_METER, name: TEST_ERROR_METER_NAME })
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_METER_DUPLICATE_NAME_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 20000)
        test('fail, other addElementError function should be called with function message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterList(10), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Element is added at the beginning of the elementList.
            act(async () => {
                try {
                    await result.current.addElement({ ...TEST_ADD_METER, name: TEST_ERROR_METER_GUID })
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_METER_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 20000)
        test('success, meter should be added', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterList(10), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 10000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            // Element is added.
            act(async () => {
                try {
                    await result.current.addElement({ ...TEST_ADD_METER })
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_METER_SUCCESS_MESSAGE, {
                variant: 'success',
            })
        }, 200000)
    })
})
