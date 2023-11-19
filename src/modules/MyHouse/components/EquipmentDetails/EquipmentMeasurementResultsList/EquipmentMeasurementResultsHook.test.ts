import { act } from '@testing-library/react-hooks'
import { TEST_MEASUREMENT_RESULT_EXIST, TEST_RESULT_VALUE, TEST_MEASUREMENT_ERROR } from 'src/mocks/handlers/equipments'
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/EquipmentMeasurementResultsHook'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'

const measurementModes = ['mode A', 'mode B', 'mode C']
const housingEquipmentId = 35
const equipmentNumber = 1

// eslint-disable-next-line jsdoc/require-returns
/**
 * Function that call the useEquipmentMeasurementResults function with default parameters.
 */
const useEquipmentMeasurementResultsFunction = () => useEquipmentMeasurementResults()

describe('useEquipmentMeasurementResults hook', () => {
    beforeEach(async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(null)
    })

    test('when the measurement result exist', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_MEASUREMENT_RESULT_EXIST)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(useEquipmentMeasurementResultsFunction)
        act(() =>
            result.current.updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes),
        )
        for (let i = 0; i < measurementModes.length; i++) {
            await waitForValueToChange(
                () => {
                    return result.current.measurementResults
                },
                { timeout: 5000 },
            )
        }
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: { isLoading: false, value: TEST_RESULT_VALUE },
            [measurementModes[1]]: { isLoading: false, value: TEST_RESULT_VALUE },
            [measurementModes[2]]: { isLoading: false, value: TEST_RESULT_VALUE },
        })
    })

    test('when the measurement result does not exist', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(useEquipmentMeasurementResultsFunction)
        act(() =>
            result.current.updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes),
        )
        for (let i = 0; i < measurementModes.length; i++) {
            await waitForValueToChange(
                () => {
                    return result.current.measurementResults
                },
                { timeout: 5000 },
            )
        }
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: { isLoading: false, value: null },
            [measurementModes[1]]: { isLoading: false, value: null },
            [measurementModes[2]]: { isLoading: false, value: null },
        })
    })

    test('when there is an error', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_MEASUREMENT_ERROR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(useEquipmentMeasurementResultsFunction)
        act(() =>
            result.current.updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes),
        )
        for (let i = 0; i < measurementModes.length; i++) {
            await waitForValueToChange(
                () => {
                    return result.current.measurementResults
                },
                { timeout: 5000 },
            )
        }
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: { isLoading: false, value: null },
            [measurementModes[1]]: { isLoading: false, value: null },
            [measurementModes[2]]: { isLoading: false, value: null },
        })
    })
})
