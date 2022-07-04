import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { getYPointValueLabel, getChartColor } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { createTheme } from '@mui/material/styles'

const yValue = 1200

// eslint-disable-next-line jsdoc/require-jsdoc
describe('test pure functions', () => {
    test('getYPointValueLabel test with different cases', async () => {
        /**
         * CONSUMPTION TEST.
         */
        // When period is daily and consumption it'll show the value given in Watt.
        let label = getYPointValueLabel(yValue, metricTargetsEnum.consumption, 'daily')
        expect(label).toBe(`${yValue} W`)

        // When period is not daily and consumption it'll convert the value in kWh.
        label = getYPointValueLabel(yValue, metricTargetsEnum.consumption, 'weekly')
        expect(label).toBe(`${(yValue / 1000).toFixed(2)} kWh`)

        // When value is null and period is daily and consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'daily')
        expect(label).toBe(' W')

        // When value is null and period is daily and consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'monthly')
        expect(label).toBe(' kWh')

        /**
         * TEMPERATURE TEST.
         */
        // When Internal temperature it'll show the value given in Watt.
        label = getYPointValueLabel(yValue, metricTargetsEnum.internalTemperature, 'daily')
        expect(label).toBe(`${yValue} °C`)

        // When value is null and External temperature it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.internalTemperature, 'monthly')
        expect(label).toBe(' °C')

        // When External temperature it'll show the value given in Watt.
        label = getYPointValueLabel(yValue, metricTargetsEnum.externalTemperature, 'daily')
        expect(label).toBe(`${yValue} °C`)

        // When value is null and External temperature it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.externalTemperature, 'monthly')
        expect(label).toBe(' °C')

        /**
         * PMAX TEST.
         */
        // When Pmax it'll convert and show the data given in kVA.
        label = getYPointValueLabel(yValue, metricTargetsEnum.pMax, 'daily')
        expect(label).toBe(`${(yValue / 1000).toFixed(2)} kVA`)

        // When value is null and Pmax it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.pMax, 'monthly')
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
