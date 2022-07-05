import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

// eslint-disable-next-line jsdoc/require-jsdoc
describe('test pure functions', () => {
    test('consumptionWattUnitConversion test with different cases', async () => {
        let expectedResult = {
            value: 120,
            unit: 'W',
        }
        // Reference for writing big numbers in JS: https://stackoverflow.com/questions/17605444/making-large-numbers-readable-in-javascript
        // When Watt.
        const wValue = 120
        let result = consumptionWattUnitConversion(wValue)
        expect(result).toStrictEqual(expectedResult)

        // When kWh.
        const kWhValue = 120_000
        expectedResult.unit = 'kWh'
        result = consumptionWattUnitConversion(kWhValue)
        expect(result).toStrictEqual(expectedResult)

        // When MWh.
        const mWhValue = 120_000_000
        expectedResult.unit = 'MWh'
        result = consumptionWattUnitConversion(mWhValue)
        expect(result).toStrictEqual(expectedResult)
    })
})
