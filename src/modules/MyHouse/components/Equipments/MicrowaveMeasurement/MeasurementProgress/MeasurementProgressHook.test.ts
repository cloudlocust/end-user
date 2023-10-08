import { renderHook } from '@testing-library/react-hooks'
import { useMeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressHook'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

// Mock functions used in the hook
jest.mock(
    'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions',
    () => ({
        calculateRemainingTime: jest.fn(),
        calculateCircularProgressValue: jest.fn(),
    }),
)

describe('useMeasurementProgress hook', () => {
    test('Calculates remainingTime and circularProgressValue correctly', () => {
        const maxDuration = 60

        // Mock the values returned by the helper functions
        const calculateRemainingTimeMock = jest.fn(() => 30)
        const calculateCircularProgressValueMock = jest.fn(() => 50)
        require('src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions').calculateRemainingTime.mockImplementation(
            calculateRemainingTimeMock,
        )
        require('src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions').calculateCircularProgressValue.mockImplementation(
            calculateCircularProgressValueMock,
        )

        // Render the hook with status inProgress
        const { result } = renderHook(() => useMeasurementProgress(measurementStatusEnum.inProgress, maxDuration))

        expect(result.current.remainingTime).toBe(30)
        expect(result.current.circularProgressValue).toBe(50)
    })
})
