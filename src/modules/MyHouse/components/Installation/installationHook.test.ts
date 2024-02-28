import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import {
    TEST_SAVE_EQUIPMENT,
    TEST_ERROR_SAVE_EQUIPMENT_ID,
    TEST_LOAD_ERROR_EQUIPMENT,
    TEST_LOAD_ERROR_METER_EQUIPMENT,
    TEST_AUTHORIZATION_LOAD_EMPTY_METER_EQUIPEMENTS,
} from 'src/mocks/handlers/equipments'
import {
    ADD_UPDATE_INSTALLATION_DEFAULT_ERROR_MESSAGE,
    ADD_UPDATE_INSTALLATION_SUCCESS_MESSAGE,
    GET_INSTALLATION_DEFAULT_ERROR_MESSAGE,
    useEquipmentList,
    useInstallation,
} from 'src/modules/MyHouse/components/Installation/installationHook'
import {
    TEST_ADD_UPDATE_INSTALLATION_BACKEND_ERROR_MESSAGE,
    TEST_GET_INSTALLATION_BACKEND_ERROR_MESSAGE,
    TEST_INSTALLATION,
    TEST_NEW_INSTALLATION,
} from 'src/mocks/handlers/installation'
import { applyCamelCase } from 'src/common/react-platform-components'

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

const TEST_LOAD_HOUSING_EQUIPMENTS_ERROR_MESSAGE = 'Erreur lors du chargement de vos équipments'
const TEST_SAVE_HOUSING_EQUIPMENT_ERROR_MESSAGE = 'Erreur backend'
const TEST_SAVE_HOUSING_EQUIPMENT_DEFAULT_ERROR_MESSAGE = "Erreur lors de l'enregistrement de vos équipments"
const TEST_SAVE_HOUSING_EQUIPMENT_SUCCESS_MESSAGE = "Succès lors de l'enregistrement de vos équipments"
// const TEST_ADD_EQUIPMENT_SUCCESS_MESSAGE = "Succès lors de l'ajout de votre équipement"

describe('EquipmentHooks test', () => {
    describe('Save Equipment when', () => {
        test('fail, message from backend should be shown in snackbar', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1))

            await waitForValueToChange(
                () => {
                    return result.current.equipmentsList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            // Element is added at the beginning of the equipmentList.
            act(async () => {
                try {
                    await result.current.addHousingEquipment([
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SAVE_HOUSING_EQUIPMENT_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 20000)
        test('fail, when no message from backend  saveEquipmentError function should be called with default error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1))

            await waitForValueToChange(
                () => {
                    return result.current.equipmentsList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            // Element is added at the beginning of the equipmentList.
            act(async () => {
                try {
                    await result.current.addHousingEquipment([
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SAVE_HOUSING_EQUIPMENT_DEFAULT_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 20000)
        test('success, equipment should be saved', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEquipmentList(1))

            await waitForValueToChange(
                () => {
                    return result.current.equipmentsList
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingEquipmentInProgress).toBe(false)
            // Element is added.
            act(async () => {
                try {
                    await result.current.addHousingEquipment([{ ...TEST_SAVE_EQUIPMENT }])
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_SAVE_HOUSING_EQUIPMENT_SUCCESS_MESSAGE, {
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_HOUSING_EQUIPMENTS_ERROR_MESSAGE, {
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
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_LOAD_HOUSING_EQUIPMENTS_ERROR_MESSAGE, {
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
        /**
         * This case is hard to replicate on a test because it performs two requests.
         */
        // test('When new equipment is added succesfully', async () => {
        //     const {
        //         renderedHook: { result, waitForValueToChange },
        //     } = reduxedRenderHook(() => useEquipmentList(1))

        //     act(async () => {
        //         await result.current.addEquipment({
        //             name: 'test equipment',
        //         })
        //     })
        //     expect(result.current.isaAdEquipmentLoading).toBe(true)
        //     await waitForValueToChange(
        //         () => {
        //             return result.current.isaAdEquipmentLoading
        //         },
        //         { timeout: 4000 },
        //     )
        //     expect(result.current.isaAdEquipmentLoading).toBe(false)
        //     // eslint-disable-next-line sonarjs/no-identical-functions
        //     act(async () => {
        //         try {
        //             await result.current.saveEquipment([
        //                 {
        //                     ...TEST_SAVE_EQUIPMENT,
        //                     equipmentId: TEST_SAVE_EQUIPMENT.equipment_id,
        //                 },
        //             ])
        //         } catch (err) {}
        //     })
        //     expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_EQUIPMENT_SUCCESS_MESSAGE, {
        //         variant: 'success',
        //     })
        // })
    })
})

const CAMEL_CASED_TEST_INSTALLATION = applyCamelCase(TEST_INSTALLATION)
const CAMEL_CASED_TEST_NEW_INSTALLATION = applyCamelCase(TEST_NEW_INSTALLATION)

describe('installation hook test', () => {
    describe('get installation informations', () => {
        // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars
        const callGetInstallationInfos = async (result: any) => {
            try {
                await result.current.getInstallationInfos()
            } catch (err) {}
        }

        test('when the get installation request fail and there is error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken('failed with message')

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallation(1))

            act(async () => callGetInstallationInfos(result))
            expect(result.current.getInstallationInfosInProgress).toBe(true)
            await waitForValueToChange(() => result.current.getInstallationInfosInProgress, { timeout: 2000 })
            expect(result.current.getInstallationInfosInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_GET_INSTALLATION_BACKEND_ERROR_MESSAGE, {
                variant: 'error',
            })
            expect(result.current.installationInfos).toBe(null)
        }, 5000)

        test('when the get installation request fail with no error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken('failed')

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallation(1))

            act(async () => callGetInstallationInfos(result))
            expect(result.current.getInstallationInfosInProgress).toBe(true)
            await waitForValueToChange(() => result.current.getInstallationInfosInProgress, { timeout: 2000 })
            expect(result.current.getInstallationInfosInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(GET_INSTALLATION_DEFAULT_ERROR_MESSAGE, {
                variant: 'error',
            })
            expect(result.current.installationInfos).toBe(null)
        }, 5000)

        test('when the get installation request success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(null)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallation(1))

            act(async () => callGetInstallationInfos(result))
            expect(result.current.getInstallationInfosInProgress).toBe(true)
            await waitForValueToChange(() => result.current.getInstallationInfosInProgress, { timeout: 2000 })
            expect(result.current.getInstallationInfosInProgress).toBe(false)
            expect(result.current.installationInfos).toStrictEqual(CAMEL_CASED_TEST_INSTALLATION)
        }, 5000)
    })

    describe('add or update installation informations', () => {
        // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars
        const callAddUpdateInstallationInfos = async (result: any) => {
            try {
                await result.current.addUpdateInstallationInfos(CAMEL_CASED_TEST_NEW_INSTALLATION)
            } catch (err) {}
        }

        test('when the add/update installation request fail and there is error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken('failed with message')

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallation(1))

            act(async () => callAddUpdateInstallationInfos(result))
            expect(result.current.addUpdateInstallationInfosInProgress).toBe(true)
            await waitForValueToChange(() => result.current.addUpdateInstallationInfosInProgress, { timeout: 2000 })
            expect(result.current.addUpdateInstallationInfosInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_UPDATE_INSTALLATION_BACKEND_ERROR_MESSAGE, {
                variant: 'error',
            })
            expect(result.current.installationInfos).toBe(null)
        }, 5000)

        test('when the add/update installation request fail with no error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken('failed')

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallation(1))

            act(async () => callAddUpdateInstallationInfos(result))
            expect(result.current.addUpdateInstallationInfosInProgress).toBe(true)
            await waitForValueToChange(() => result.current.addUpdateInstallationInfosInProgress, { timeout: 2000 })
            expect(result.current.addUpdateInstallationInfosInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ADD_UPDATE_INSTALLATION_DEFAULT_ERROR_MESSAGE, {
                variant: 'error',
            })
            expect(result.current.installationInfos).toBe(null)
        }, 5000)

        test('when the add/update installation request success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken()

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useInstallation(1))

            act(async () => callAddUpdateInstallationInfos(result))
            expect(result.current.addUpdateInstallationInfosInProgress).toBe(true)
            await waitForValueToChange(() => result.current.addUpdateInstallationInfosInProgress, { timeout: 5000 })
            expect(result.current.addUpdateInstallationInfosInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ADD_UPDATE_INSTALLATION_SUCCESS_MESSAGE, {
                variant: 'success',
            })
            expect(result.current.installationInfos).toStrictEqual(CAMEL_CASED_TEST_NEW_INSTALLATION)
        }, 5000)
    })
})
