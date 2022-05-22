import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import { TEST_ADD_METER, TEST_ERROR_METER_GUID, TEST_ERROR_METER_NAME } from 'src/mocks/handlers/meters'
import { useEquipmentList } from 'src/modules/Equipments/equipmentHooks'

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

const TEST_LOAD_METERS_ERROR_MESSAGE = 'Erreur lors du chargement de vos équipments'
const TEST_SAVE_EQUIPMENT_ERROR_MESSAGE = 'error from backend'
const TEST_SAVE_EQUIPMENT_DEFAULT_ERROR_MESSAGE = "Erreur lors de l'enregistrement de vos équipments"
const TEST_SAVE_EQUIPMENT_SUCCESS_MESSAGE = "Succès lors de l'enregistrement de vos équipments"
describe('MetersListHook test', () => {
    describe('Load Meters', () => {
        test('When load error snackbar should be called with error message', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(-1), { initialState: {} })
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
    describe('Save Equipment when', () => {
        test('fail, message from backend should be shown in snackbar', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(10), { initialState: {} })

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
        test('fail, when no message from backend  addElementError function should be called with default error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(10), { initialState: {} })

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
        test('success, equipment should be saved', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(10), { initialState: {} })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
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
                { timeout: 2000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_METER_SUCCESS_MESSAGE, {
                variant: 'success',
            })
        })
    })
})
