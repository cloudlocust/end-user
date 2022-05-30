import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import {
    TEST_SAVE_EQUIPMENT,
    TEST_ERROR_SAVE_EQUIPMENT_ID,
    TEST_LOAD_ERROR_EQUIPMENT,
    TEST_LOAD_ERROR_METER_EQUIPMENT,
    TEST_AUTHORIZATION_LOAD_EMPTY_METER_EQUIPEMENTS,
} from 'src/mocks/handlers/equipments'
import { useEquipmentList } from 'src/modules/MyHouse/components/Equipments/equipmentHooks'
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

const TEST_LOAD_EQUIPMENTS_ERROR_MESSAGE = 'Erreur lors du chargement de vos équipments'
const TEST_SAVE_EQUIPMENT_ERROR_MESSAGE = 'Erreur backend'
const TEST_SAVE_EQUIPMENT_DEFAULT_ERROR_MESSAGE = "Erreur lors de l'enregistrement de vos équipments"
const TEST_SAVE_EQUIPMENT_SUCCESS_MESSAGE = "Succès lors de l'enregistrement de vos équipments"
describe('EquipmentHooks test', () => {
    describe('Save Equipment when', () => {
        test('fail, message from backend should be shown in snackbar', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1))

            await waitForValueToChange(
                () => {
                    return result.current.equipmentList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            // Element is added at the beginning of the equipmentList.
            act(async () => {
                try {
                    await result.current.saveEquipment([
                        {
                            ...TEST_SAVE_EQUIPMENT,
                            equipmentId: TEST_ERROR_SAVE_EQUIPMENT_ID,
                        },
                    ])
                } catch (err) {}
            })
            expect(result.current.loadingEquipmentInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SAVE_EQUIPMENT_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 20000)
        test('fail, when no message from backend  saveEquipmentError function should be called with default error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1))

            await waitForValueToChange(
                () => {
                    return result.current.equipmentList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            // Element is added at the beginning of the equipmentList.
            act(async () => {
                try {
                    await result.current.saveEquipment([
                        {
                            ...TEST_SAVE_EQUIPMENT,
                            equipmentId: TEST_SAVE_EQUIPMENT.equipment_id + 1,
                        },
                    ])
                } catch (err) {}
            })
            expect(result.current.loadingEquipmentInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SAVE_EQUIPMENT_DEFAULT_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 20000)
        test('success, equipment should be saved', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1))

            await waitForValueToChange(
                () => {
                    return result.current.equipmentList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            // Element is added.
            act(async () => {
                try {
                    await result.current.saveEquipment([{ ...TEST_SAVE_EQUIPMENT }])
                } catch (err) {}
            })
            expect(result.current.loadingEquipmentInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SAVE_EQUIPMENT_SUCCESS_MESSAGE, {
                variant: 'success',
            })
        }, 20000)
    })
    describe('Load Equipments', () => {
        test('When load error meterEquipment snackbar should be called with error message', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_LOAD_ERROR_METER_EQUIPMENT)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1), { store })
            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_EQUIPMENTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })
        test('When load error equipments snackbar should be called with error message', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_LOAD_ERROR_EQUIPMENT)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1), { store })
            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_EQUIPMENTS_ERROR_MESSAGE, {
                variant: 'error',
            })
        })

        test('When load success with meterEquipment empty isEquipmentMeterListEmpty gets true', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_AUTHORIZATION_LOAD_EMPTY_METER_EQUIPEMENTS)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1), { store })
            expect(result.current.isEquipmentMeterListEmpty).toBe(false)
            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 2000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(true)

            await waitForValueToChange(
                () => {
                    return result.current.loadingEquipmentInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            expect(result.current.isEquipmentMeterListEmpty).toBe(true)
        })
    })
})
