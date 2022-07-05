// https://www.npmjs.com/package/convert-units
import convert, { Unit } from 'convert-units'
import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'
/**
 * Converts Watt value into its adequate unit (W, kWh, MWh), and return the value with its corresponding unit.
 * If the conversion to a specific unit is less than 999 it returns it.
 *
 * @param valueInWatt Value to be converted.
 * @returns Object {value, unit}, representing the converted valueInWatt given to its corresponding unit.
 */
export const consumptionWattUnitConversion = (valueInWatt: number) => {
    const units: Unit[] = ['Wh', 'kWh', 'MWh']
    for (let index = 0; index < units.length; index++) {
        // Convert from Wh to Wh, kWh or MWh
        const convertedValue = convert(valueInWatt).from(units[0]).to(units[index])
        if (convertedValue < 999)
            return {
                value: Number(convertedValue.toFixed(2)),
                // If the corresponding unit is Wh, we returns W because we use W indicating Watt instead of Wh in our MyConsumption Module and not (Wh, kWh, MWh), because we can not convert using this library, from W to kWh , or W to MWh.
                unit: (index === 0 ? 'W' : units[index]) as totalConsumptionUnits,
            }
    }
}
