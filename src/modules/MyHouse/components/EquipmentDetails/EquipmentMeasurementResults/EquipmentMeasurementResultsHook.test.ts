import { TEST_MEASUREMENT_RESULT_EXIST, TEST_RESULT_VALUE, TEST_MEASUREMENT_ERROR } from 'src/mocks/handlers/equipments'
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResultsHook'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'

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

const measurementModes = ['mode A', 'mode B']
const errorMessages = [
    `Un problème s'est produit lors de la récupération du résultat de la mesure en mode mode A : Error in getting measurement result`,
    `Un problème s'est produit lors de la récupération du résultat de la mesure en mode mode B : Error in getting measurement result`,
]
const housingEquipmentId = 35
const equipmentNumber = 1

// eslint-disable-next-line jsdoc/require-returns
/**
 * Function that call the useEquipmentMeasurementResults function with default parameters.
 */
const useEquipmentMeasurementResultsFunction = () =>
    useEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes)

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

        await waitForValueToChange(
            () => {
                return result.current.measurementResults
            },
            { timeout: 5000 },
        )
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: { isLoading: false, value: TEST_RESULT_VALUE },
            [measurementModes[1]]: { isLoading: false, value: TEST_RESULT_VALUE },
        })
    })

    test('when the measurement result does not exist', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(useEquipmentMeasurementResultsFunction)

        await waitForValueToChange(
            () => {
                return result.current.measurementResults
            },
            { timeout: 5000 },
        )
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: { isLoading: false, value: null },
            [measurementModes[1]]: { isLoading: false, value: null },
        })
    })

    test('when there is an error', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_MEASUREMENT_ERROR)
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(useEquipmentMeasurementResultsFunction)

        await waitForValueToChange(
            () => {
                return result.current.measurementResults
            },
            { timeout: 5000 },
        )
        expect(result.current.measurementResults).toStrictEqual({
            [measurementModes[0]]: { isLoading: false, value: null },
            [measurementModes[1]]: { isLoading: false, value: null },
        })
        expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(2)
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(errorMessages[0], {
            autoHideDuration: 5000,
            variant: 'error',
        })
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(errorMessages[1], {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
