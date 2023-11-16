import { getEquipmentMeasurementResult } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/utils'
import { TEST_MEASUREMENT_RESULT_EXIST, TEST_RESULT_VALUE, TEST_MEASUREMENT_ERROR } from 'src/mocks/handlers/equipments'

const measurementMode = 'mode'
const housingEquipmentId = 35
const equipmentNumber = 1

describe('getEquipmentMeasurementResult function', () => {
    beforeEach(async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(null)
    })

    test('when the measurement result exist', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_MEASUREMENT_RESULT_EXIST)

        const result = await getEquipmentMeasurementResult(measurementMode, housingEquipmentId, equipmentNumber)
        expect(result).toBe(TEST_RESULT_VALUE)
    })

    test('when the measurement result does not exist', async () => {
        const result = await getEquipmentMeasurementResult(measurementMode, housingEquipmentId, equipmentNumber)
        expect(result).toBe(null)
    })

    test('when there is an error', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_MEASUREMENT_ERROR)

        const result = await getEquipmentMeasurementResult(measurementMode, housingEquipmentId, equipmentNumber)
        expect(result).toBe(null)
    })
})
