// https://www.npmjs.com/package/convert-units
import convert, { Unit } from 'convert-units'
/**
 * Converts Watt value into its adequate unit (W, kWh, MWh), and return the value with its corresponding unit.
 * If the conversion to a specific unit is less than 999 it returns it.
 *
 * @param valueInWatt Value to be converted.
 * @returns Object {value, unit}, representing the converted valueInWatt given to its corresponding unit.
 */
export const consumptionWattUnitConversion = (valueInWatt: number) => {
    const units: Unit[] = ['Wh', 'kWh', 'MWh']
    for (let index = 0; index < units.length - 1; index++) {
        // Convert from Wh to Wh, kWh
        const convertedValue = convert(valueInWatt).from(units[0]).to(units[index])
        // We return if its the adequate unit.
        if (convertedValue < 999)
            return {
                value: Number(convertedValue.toFixed(2)),
                // If the corresponding unit is Wh, we returns W because we use W indicating Watt instead of Wh in our MyConsumption Module and not (Wh, kWh), because we can not convert using this library, from W to kWh.
                unit: units[index],
            }
    }
    // Returns the value and unit of the last unit, W to MWh.
    return {
        value: Number(
            convert(valueInWatt)
                .from(units[0])
                .to(units[units.length - 1])
                .toFixed(2),
        ),
        unit: units[units.length - 1],
    }
}
