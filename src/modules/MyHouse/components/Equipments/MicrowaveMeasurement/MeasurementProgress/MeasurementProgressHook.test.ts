import { renderHook } from '@testing-library/react-hooks'
import { useMeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressHook'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

// Mock functions used in the hook (use the real ones)
jest.mock(
    'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions',
    () => ({
        ...jest.requireActual(
            'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions',
        ),
    }),
)

/**
 * Mock for the getTimeFromLastUpdate function.
 *
 * @returns Passed time from last update.
 */
const mockGetTimeFromLastUpdate = () => 0

describe('useMeasurementProgress hook', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('Calculates remainingTime and circularProgressValue correctly', () => {
        const maxDuration = 50

        // Render the hook with status inProgress
        const { result } = renderHook(() =>
            useMeasurementProgress(measurementStatusEnum.inProgress, maxDuration, mockGetTimeFromLastUpdate),
        )

        expect(result.current.remainingTime).toBe(50)
        expect(result.current.circularProgressValue).toBe(0)

        // Advance the timer by 1 second
        jest.advanceTimersByTime(1000)

        // Check if values are updated
        expect(result.current.remainingTime).toBe(49)
        expect(result.current.circularProgressValue).toBe(2)

        // Advance the timer by 24 seconds (25 seconds after starting the measurement process, the middle of the process)
        jest.advanceTimersByTime(24000)

        // Check if values are updated
        expect(result.current.remainingTime).toBe(25)
        expect(result.current.circularProgressValue).toBe(50)
    })
})
