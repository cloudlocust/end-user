import { act } from '@testing-library/react-hooks'
import { TEST_MEASUREMENT_RESULT_EXIST, TEST_RESULT_VALUE, TEST_MEASUREMENT_ERROR } from 'src/mocks/handlers/equipments'
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResultsHook'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'

const measurementModes = ['mode A', 'mode B', 'mode C']
const housingEquipmentId = 35
const equipmentNumber = 1

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
        } = reduxedRenderHook(() => useEquipmentMeasurementResults())
        act(() =>
            result.current.updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes),
        )
        await waitForValueToChange(
            () => {
                return result.current.measurementResults
            },
            { timeout: 5000 },
        )
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: TEST_RESULT_VALUE,
            [measurementModes[1]]: TEST_RESULT_VALUE,
            [measurementModes[2]]: TEST_RESULT_VALUE,
        })
    })

    test('when the measurement result does not exist', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEquipmentMeasurementResults())
        act(() =>
            result.current.updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes),
        )
        await waitForValueToChange(
            () => {
                return result.current.measurementResults
            },
            { timeout: 5000 },
        )
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: null,
            [measurementModes[1]]: null,
            [measurementModes[2]]: null,
        })
    })

    test('when there is an error', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_MEASUREMENT_ERROR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEquipmentMeasurementResults())
        act(() =>
            result.current.updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes),
        )
        await waitForValueToChange(
            () => {
                return result.current.measurementResults
            },
            { timeout: 5000 },
        )
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: null,
            [measurementModes[1]]: null,
            [measurementModes[2]]: null,
        })
    })
})
