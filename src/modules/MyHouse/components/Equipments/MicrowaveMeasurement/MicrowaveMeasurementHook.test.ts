import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import {
    TEST_MEASUREMENT_RESULT_EXIST,
    TEST_RESULT_VALUE,
    TEST_STATUS_PENDING,
    TEST_STATUS_IN_PROGRESS,
    TEST_STATUS_SUCCESS,
    TEST_STATUS_FAILED,
} from 'src/mocks/handlers/equipments'
import { useMicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurementHook'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

const mockEnqueueSnackbar = jest.fn()

/**
 * Mocking the useSnackbar.
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

const housingEquipmentId = 35
const measurementMode = 'mode'
const equipmentNumber = 1
const measurementMaxDuration = 50

// eslint-disable-next-line jsdoc/require-returns
/**
 * Function that call the useMicrowaveMeasurement function with default parameters.
 */
const useMicrowaveMeasurementFunction = () =>
    useMicrowaveMeasurement(housingEquipmentId, measurementMode, equipmentNumber, measurementMaxDuration)

describe('useMicrowaveMeasurement', () => {
    beforeEach(async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(null)
    })

    test('should render the initial measurement status and measurement result', () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() =>
            useMicrowaveMeasurement(housingEquipmentId, measurementMode, equipmentNumber, measurementMaxDuration),
        )

        expect(result.current.measurementStatus).toBe(null)
        expect(result.current.measurementResult).toBe(null)
    })

    describe('updating the measurement result', () => {
        test('when the measurement result exist', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_MEASUREMENT_RESULT_EXIST)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(useMicrowaveMeasurementFunction)
            act(() => result.current.updateResult())
            await waitForValueToChange(
                () => {
                    return result.current.measurementResult
                },
                { timeout: 5000 },
            )
            expect(result.current.measurementResult).toBe(TEST_RESULT_VALUE)
        })

        test('when the measurement result doesn not exist', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(useMicrowaveMeasurementFunction)
            act(() => result.current.updateResult())
            await waitForValueToChange(
                () => {
                    return result.current.measurementResult
                },
                { timeout: 5000 },
            )
            expect(result.current.measurementResult).toBe(0)
        })
    })

    describe('updating the measurement status', () => {
        test('should update the measurement status when the status is PENDING', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_PENDING)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(useMicrowaveMeasurementFunction)
            act(() => result.current.updateStatus())
            await waitForValueToChange(
                () => {
                    return result.current.measurementStatus
                },
                { timeout: 5000 },
            )
            expect(result.current.measurementStatus).toBe(measurementStatusEnum.pending)
        })

        test('should update the measurement status when the status is IN_PROGRESS', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_IN_PROGRESS)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(useMicrowaveMeasurementFunction)
            act(() => result.current.updateStatus())
            await waitForValueToChange(
                () => {
                    return result.current.measurementStatus
                },
                { timeout: 5000 },
            )
            expect(result.current.measurementStatus).toBe(measurementStatusEnum.inProgress)
        })

        test('should update the measurement status when the status is FAILED', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_FAILED)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(useMicrowaveMeasurementFunction)
            act(() => result.current.updateStatus())
            await waitForValueToChange(
                () => {
                    return result.current.measurementStatus
                },
                { timeout: 5000 },
            )
            expect(result.current.measurementStatus).toBe(measurementStatusEnum.failed)
        })

        test('should update the measurement status when the status is SUCCESS', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_SUCCESS)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(useMicrowaveMeasurementFunction)
            act(() => result.current.updateStatus())
            await waitForValueToChange(
                () => {
                    return result.current.measurementStatus
                },
                { timeout: 5000 },
            )
            expect(result.current.measurementStatus).toBe(measurementStatusEnum.success)
        })

        test('should update the measurement status when the equipment does not exist', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(useMicrowaveMeasurementFunction)
            act(() => result.current.updateStatus())
            await waitForValueToChange(
                () => {
                    return result.current.measurementStatus
                },
                { timeout: 5000 },
            )
            expect(result.current.measurementStatus).toBe(measurementStatusEnum.failed)
        })
    })

    describe('starting the measurement process', () => {
        describe('when a measurement process is running', () => {
            test('when status is PENDING', async () => {
                const { store } = require('src/redux')
                await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_PENDING)
                const {
                    renderedHook: { result, waitForValueToChange },
                } = reduxedRenderHook(useMicrowaveMeasurementFunction)
                act(() => result.current.startMeasurement())
                await waitForValueToChange(
                    () => {
                        return result.current.measurementStatus
                    },
                    { timeout: 5000 },
                )
                expect(result.current.measurementStatus).toBe(measurementStatusEnum.pending)
                expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Un test de mesure est déjà en cours', {
                    autoHideDuration: 5000,
                    variant: 'info',
                })
            })

            test('when status is IN_PROGRESS', async () => {
                const { store } = require('src/redux')
                await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_IN_PROGRESS)
                const {
                    renderedHook: { result, waitForValueToChange },
                } = reduxedRenderHook(useMicrowaveMeasurementFunction)
                act(() => result.current.startMeasurement())
                await waitForValueToChange(
                    () => {
                        return result.current.measurementStatus
                    },
                    { timeout: 5000 },
                )
                expect(result.current.measurementStatus).toBe(measurementStatusEnum.inProgress)
                expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Un test de mesure est déjà en cours', {
                    autoHideDuration: 5000,
                    variant: 'info',
                })
            })
        })

        describe('when no measurement process is running', () => {
            test('when status is SUCCESS', async () => {
                const { store } = require('src/redux')
                await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_SUCCESS)
                const {
                    renderedHook: { result, waitForValueToChange },
                } = reduxedRenderHook(useMicrowaveMeasurementFunction)
                act(() => result.current.startMeasurement())
                await waitForValueToChange(
                    () => {
                        return result.current.measurementStatus
                    },
                    { timeout: 5000 },
                )
                expect(result.current.measurementStatus).toBe(measurementStatusEnum.pending)
            })

            test('when status is FAILED', async () => {
                const { store } = require('src/redux')
                await store.dispatch.userModel.setAuthenticationToken(TEST_STATUS_FAILED)
                const {
                    renderedHook: { result, waitForValueToChange },
                } = reduxedRenderHook(useMicrowaveMeasurementFunction)
                act(() => result.current.startMeasurement())
                await waitForValueToChange(
                    () => {
                        return result.current.measurementStatus
                    },
                    { timeout: 5000 },
                )
                expect(result.current.measurementStatus).toBe(measurementStatusEnum.pending)
            })
        })
    })
})
