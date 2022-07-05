import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { getYPointValueLabel, getChartColor } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { createTheme } from '@mui/material/styles'

const yValue = 120
const yValuekWh = 1_200
const yValueMWh = 1_200_000
const yValueConverted = '1.20'

// eslint-disable-next-line jsdoc/require-jsdoc
describe('test pure functions', () => {
    test('getYPointValueLabel test with different cases', async () => {
        /**
         * CONSUMPTION TEST.
         */
        // When unit is W and consumption it'll show the value given in Watt.
        let label = getYPointValueLabel(yValue, metricTargetsEnum.consumption, 'W')
        expect(label).toBe(`${yValue} W`)

        // When period is not daily and unit is kWh consumption it'll convert the value in kWh.
        label = getYPointValueLabel(yValuekWh, metricTargetsEnum.consumption, 'kWh')
        expect(label).toBe(`${yValueConverted} kWh`)

        // When period is not daily and unit is MWh consumption it'll convert the value in MWh.
        label = getYPointValueLabel(yValueMWh, metricTargetsEnum.consumption, 'MWh')
        expect(label).toBe(`${yValueConverted} MWh`)

        // When value is null and unit W consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'W')
        expect(label).toBe(' W')

        // When value is null and unit kWh consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'kWh')
        expect(label).toBe(' kWh')

        // When value is null and unit MWh consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'MWh')
        expect(label).toBe(' MWh')
        /**
         * TEMPERATURE TEST.
         */
        // When Internal temperature it'll show the value given in Watt.
        label = getYPointValueLabel(yValue, metricTargetsEnum.internalTemperature)
        expect(label).toBe(`${yValue} °C`)

        // When value is null and External temperature it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.internalTemperature)
        expect(label).toBe(' °C')

        // When External temperature it'll show the value given in Watt.
        label = getYPointValueLabel(yValue, metricTargetsEnum.externalTemperature)
        expect(label).toBe(`${yValue} °C`)

        // When value is null and External temperature it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.externalTemperature)
        expect(label).toBe(' °C')

        /**
         * PMAX TEST.
         */
        // When Pmax it'll show the value given in Watt.
        label = getYPointValueLabel(yValue, metricTargetsEnum.pMax)
        expect(label).toBe(`${yValue} kVA`)

        // When value is null and Pmax it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.pMax)
        expect(label).toBe(' kVA')
    })

    test('getChartColor test with different cases', async () => {
        const theme = createTheme({
            palette: {
                primary: {
                    main: '#FFFFFF',
                    light: '#FFEECD',
                },
                secondary: {
                    main: '#AABBCC',
                },
            },
        })
        // When Consumption, it should return palette.primary.light.
        let label = getChartColor(metricTargetsEnum.consumption, theme)
        expect(label).toBe('#FFEECD')

        // When internal temperature.
        label = getChartColor(metricTargetsEnum.internalTemperature, theme)
        expect(label).toBe('#BA1B1B')

        // When External temperature, it should return palette.secondary.main.
        label = getChartColor(metricTargetsEnum.externalTemperature, theme)
        expect(label).toBe('#AABBCC')

        // When Pmax.
        label = getChartColor(metricTargetsEnum.pMax, theme)
        expect(label).toBe('#FF7A00')
    })
})
