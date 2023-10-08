import {
    calculateRemainingTime,
    calculateCircularProgressValue,
    formatDuration,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions'

describe('calculateRemainingTime function', () => {
    test('Calculates remaining time correctly', () => {
        expect(calculateRemainingTime(0, 60)).toBe(60)
        expect(calculateRemainingTime(10, 60)).toBe(50)
        expect(calculateRemainingTime(30, 60)).toBe(30)
        expect(calculateRemainingTime(40, 60)).toBe(20)
    })

    test('The remaining time is always greater than 0', () => {
        expect(calculateRemainingTime(60, 60)).toBeGreaterThan(0)
        expect(calculateRemainingTime(80, 60)).toBeGreaterThan(0)
        // Check that the value converges to 0, without reaching it (i.e. equal to 0 at infinity)
        expect(calculateRemainingTime(Infinity, 60)).toBe(0)
    })
})

describe('calculateCircularProgressValue function', () => {
    test('Calculates CircularProgress value prop correctly', () => {
        expect(calculateCircularProgressValue(0, 60)).toBe(100)
        expect(calculateCircularProgressValue(15, 60)).toBe(75)
        expect(calculateCircularProgressValue(30, 60)).toBe(50)
        expect(calculateCircularProgressValue(45, 60)).toBe(25)
        expect(calculateCircularProgressValue(60, 60)).toBe(0)
    })
})

describe('formatDuration function', () => {
    test('Calculate formatted duration correctly', () => {
        expect(formatDuration(0)).toBe('00 : 00')
        expect(formatDuration(55)).toBe('00 : 55')
        expect(formatDuration(73)).toBe('01 : 13')
        expect(formatDuration(148)).toBe('02 : 28')
    })
})
