import {
    calculateRemainingTime,
    calculateCircularProgressValue,
    formatDuration,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions'

describe('calculateRemainingTime function', () => {
    test('Calculates remaining time correctly', () => {
        const maxDuration = 60
        const testCases = [
            { second: 0, expectedRemainingTime: 60 },
            { second: 10, expectedRemainingTime: 50 },
            { second: 30, expectedRemainingTime: 30 },
            { second: 40, expectedRemainingTime: 20 },
        ]
        testCases.forEach((testCase) => {
            expect(calculateRemainingTime(testCase.second, maxDuration)).toBe(testCase.expectedRemainingTime)
        })
    })

    test('The remaining time is always greater than 0', () => {
        const maxDuration = 60
        const seconds = [60, 80, 100]
        seconds.forEach((second) => {
            expect(calculateRemainingTime(second, maxDuration)).toBeGreaterThan(0)
        })

        // Checking that the value converges to 0, without reaching it (i.e. equal to 0 at infinity)
        expect(calculateRemainingTime(Infinity, maxDuration)).toBe(0)
    })
})

describe('calculateCircularProgressValue function', () => {
    test('Calculates CircularProgress value prop correctly', () => {
        const maxDuration = 60
        const testCases = [
            { remainingSeconds: 0, expectedProgressValue: 100 },
            { remainingSeconds: 15, expectedProgressValue: 75 },
            { remainingSeconds: 30, expectedProgressValue: 50 },
            { remainingSeconds: 45, expectedProgressValue: 25 },
            { remainingSeconds: 60, expectedProgressValue: 0 },
        ]
        testCases.forEach((testCase) => {
            expect(calculateCircularProgressValue(testCase.remainingSeconds, maxDuration)).toBe(
                testCase.expectedProgressValue,
            )
        })
    })
})

describe('formatDuration function', () => {
    test('Calculate formatted duration correctly', () => {
        const testCases = [
            { durationInSeconds: 0, expectedFormatedDuration: '00 : 00' },
            { durationInSeconds: 55, expectedFormatedDuration: '00 : 55' },
            { durationInSeconds: 73, expectedFormatedDuration: '01 : 13' },
            { durationInSeconds: 148, expectedFormatedDuration: '02 : 28' },
        ]
        testCases.forEach((testCase) => {
            expect(formatDuration(testCase.durationInSeconds)).toBe(testCase.expectedFormatedDuration)
        })
    })
})
