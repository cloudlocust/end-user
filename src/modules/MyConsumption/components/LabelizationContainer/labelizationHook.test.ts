import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import {
    GET_ACTIVITIES_DEFAULT_ERROR_MESSAGE,
    ADD_ACTIVITY_DEFAULT_ERROR_MESSAGE,
    ADD_ACTIVITY_SUCCESS_MESSAGE,
    useLabelization,
    DELETE_ACTIVITY_DEFAULT_ERROR_MESSAGE,
    DELETE_ACTIVITY_SUCCESS_MESSAGE,
} from 'src/modules/MyConsumption/components/LabelizationContainer/labelizationHook'
import {
    TEST_GET_ACTIVITIES_BACKEND_ERROR_MESSAGE,
    TEST_ADD_ACTIVITY_BACKEND_ERROR_MESSAGE,
    FAILED_WITH_MSG_REQ_AUTHORIZATION,
    FAILED_REQ_AUTHORIZATION,
    TEST_DELETE_ACTIVITY_BACKEND_ERROR_MESSAGE,
} from 'src/mocks/handlers/labelization'

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

describe('useLabelization Hook test', () => {
    describe('getActivitiesList function test', () => {
        // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars
        const callGetActivitiesList = async (result: any) => {
            try {
                await result.current.getActivitiesList()
            } catch (err) {}
        }

        test('when getActivitiesList fail and there is error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(FAILED_WITH_MSG_REQ_AUTHORIZATION)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callGetActivitiesList(result))
            expect(result.current.isGetActivitiesLoading).toBe(true)
            await waitForValueToChange(() => result.current.isGetActivitiesLoading, { timeout: 2000 })
            expect(result.current.isGetActivitiesLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_GET_ACTIVITIES_BACKEND_ERROR_MESSAGE, {
                variant: 'error',
            })
            expect(result.current.activitiesList).toBe(null)
        }, 5000)

        test('when getActivitiesList fail with no error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(FAILED_REQ_AUTHORIZATION)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callGetActivitiesList(result))
            expect(result.current.isGetActivitiesLoading).toBe(true)
            await waitForValueToChange(() => result.current.isGetActivitiesLoading, { timeout: 2000 })
            expect(result.current.isGetActivitiesLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(GET_ACTIVITIES_DEFAULT_ERROR_MESSAGE, {
                variant: 'error',
            })
            expect(result.current.activitiesList).toBe(null)
        }, 5000)

        test('when getActivitiesList success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(null)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callGetActivitiesList(result))
            expect(result.current.isGetActivitiesLoading).toBe(true)
            await waitForValueToChange(() => result.current.isGetActivitiesLoading, { timeout: 2000 })
            expect(result.current.isGetActivitiesLoading).toBe(false)
            expect(result.current.activitiesList).toHaveLength(3)
        }, 5000)
    })

    describe('addActivity function test', () => {
        // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars
        const callAddActivity = async (result: any) => {
            try {
                await result.current.addActivity({
                    startDate: '2024-02-04T18:00:00.000Z',
                    endDate: '2024-02-04T19:00:00.000Z',
                    consumption: 110,
                    consumptionPrice: 12,
                    useType: "Test type d'usage",
                    housingEquipmentId: 47,
                })
            } catch (err) {}
        }

        test('when addActivity fail and there is error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(FAILED_WITH_MSG_REQ_AUTHORIZATION)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callAddActivity(result))
            expect(result.current.isAddActivityLoading).toBe(true)
            await waitForValueToChange(() => result.current.isAddActivityLoading, { timeout: 2000 })
            expect(result.current.isAddActivityLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_ADD_ACTIVITY_BACKEND_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 5000)

        test('when addActivity fail with no error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(FAILED_REQ_AUTHORIZATION)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callAddActivity(result))
            expect(result.current.isAddActivityLoading).toBe(true)
            await waitForValueToChange(() => result.current.isAddActivityLoading, { timeout: 2000 })
            expect(result.current.isAddActivityLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ADD_ACTIVITY_DEFAULT_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 5000)

        test('when addActivity success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken()

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callAddActivity(result))
            expect(result.current.isAddActivityLoading).toBe(true)
            await waitForValueToChange(() => result.current.isAddActivityLoading, { timeout: 5000 })
            expect(result.current.isAddActivityLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ADD_ACTIVITY_SUCCESS_MESSAGE, {
                variant: 'success',
            })
            // TODO: Assert that getActivitiesList is called
        }, 5000)
    })

    describe('deleteActivity function test', () => {
        // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars
        const callDeleteActivity = async (result: any) => {
            try {
                await result.current.deleteActivity(1)
            } catch (err) {}
        }

        test('when deleteActivity fail and there is error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(FAILED_WITH_MSG_REQ_AUTHORIZATION)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callDeleteActivity(result))
            expect(result.current.isDeleteActivityLoading).toBe(true)
            await waitForValueToChange(() => result.current.isDeleteActivityLoading, { timeout: 2000 })
            expect(result.current.isDeleteActivityLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_DELETE_ACTIVITY_BACKEND_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 5000)

        test('when deleteActivity fail with no error message from backend', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(FAILED_REQ_AUTHORIZATION)

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callDeleteActivity(result))
            expect(result.current.isDeleteActivityLoading).toBe(true)
            await waitForValueToChange(() => result.current.isDeleteActivityLoading, { timeout: 2000 })
            expect(result.current.isDeleteActivityLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DELETE_ACTIVITY_DEFAULT_ERROR_MESSAGE, {
                variant: 'error',
            })
        }, 5000)

        test('when deleteActivity success', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken()

            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useLabelization(1))

            act(async () => callDeleteActivity(result))
            expect(result.current.isDeleteActivityLoading).toBe(true)
            await waitForValueToChange(() => result.current.isDeleteActivityLoading, { timeout: 5000 })
            expect(result.current.isDeleteActivityLoading).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DELETE_ACTIVITY_SUCCESS_MESSAGE, {
                variant: 'success',
            })
            // TODO: Assert that getActivitiesList is called
        }, 5000)
    })
})
