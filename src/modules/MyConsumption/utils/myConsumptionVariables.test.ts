import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { getYPointValueLabel, getChartColor } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { createTheme } from '@mui/material/styles'

const yValue = 1.2
const yValuekWh = 1_200
const yValueMWh = 1_200_000
const yValueVA = 1_200
const yValueConverted = '1.20'
const roundedYValue = 1

// eslint-disable-next-line jsdoc/require-jsdoc
describe('test pure functions', () => {
    test('getYPointValueLabel test with different cases', async () => {
        /**
         * CONSUMPTION TEST.
         */
        /* Format ROUNDED VALUES */
        // When unit is Wh and consumption it'll show the value given in Wh.
        let label = getYPointValueLabel(yValue, metricTargetsEnum.consumption, 'Wh', true)
        expect(label).toBe(`${roundedYValue} Wh`)

        // When period is not daily and unit is kWh consumption it'll convert the value in kWh.
        label = getYPointValueLabel(yValuekWh, metricTargetsEnum.consumption, 'kWh', true)
        expect(label).toBe(`${roundedYValue} kWh`)

        // When period is not daily and unit is MWh consumption it'll convert the value in MWh.
        label = getYPointValueLabel(yValueMWh, metricTargetsEnum.consumption, 'MWh', true)
        expect(label).toBe(`${roundedYValue} MWh`)

        /* FLOATED VALUES */
        // When unit is Wh and consumption it'll show the value given in Wh.
        label = getYPointValueLabel(yValue, metricTargetsEnum.consumption, 'Wh')
        expect(label).toBe(`${yValueConverted} Wh`)

        // When period is not daily and unit is kWh consumption it'll convert the value in kWh.
        label = getYPointValueLabel(yValuekWh, metricTargetsEnum.consumption, 'kWh')
        expect(label).toBe(`${yValueConverted} kWh`)

        // When period is not daily and unit is MWh consumption it'll convert the value in MWh.
        label = getYPointValueLabel(yValueMWh, metricTargetsEnum.consumption, 'MWh')
        expect(label).toBe(`${yValueConverted} MWh`)

        // When value is null and unit Wh consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'Wh')
        expect(label).toBe(' Wh')

        // When value is null and unit kWh consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'kWh')
        expect(label).toBe(' kWh')

        // When value is null and unit MWh consumption it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.consumption, 'MWh')
        expect(label).toBe(' MWh')

        /**
         * Euros Consumption TEST.
         */
        // When Euros Consumption it'll show the value given in €.
        label = getYPointValueLabel(yValue, metricTargetsEnum.eurosConsumption)
        expect(label).toBe(`${yValue.toFixed(2)} €`)

        // When value is null and External temperature it'll show only the unit.
        label = getYPointValueLabel(null, metricTargetsEnum.eurosConsumption)
        expect(label).toBe(' €')

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
        label = getYPointValueLabel(yValueVA, metricTargetsEnum.pMax)
        expect(label).toBe(`${yValueConverted} kVA`)

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
        let label = getChartColor(metricTargetsEnum.consumption, theme, false)
        expect(label).toBe('#AABBCC')

        label = getChartColor(metricTargetsEnum.consumption, theme, true)
        expect(label).toBe('rgba(255,255,255, .0)')

        // When Euros Consumption, it should return palette.primary.light.
        label = getChartColor(metricTargetsEnum.eurosConsumption, theme)
        expect(label).toBe('rgba(255, 255, 255, .0)')

        // When internal temperature.
        label = getChartColor(metricTargetsEnum.internalTemperature, theme)
        expect(label).toBe('#BA1B1B')

        // When External temperature, it should return palette.secondary.main.
        label = getChartColor(metricTargetsEnum.externalTemperature, theme)
        expect(label).toBe('#FFC200')

        // When Pmax.
        label = getChartColor(metricTargetsEnum.pMax, theme)
        expect(label).toBe('#FF7A00')

        // Autoconsommation
        label = getChartColor(metricTargetsEnum.autoconsumption, theme)
        expect(label).toBe('#BEECDB')

        // Total Off Idle Autoconsommation
        label = getChartColor(metricTargetsEnum.totalOffIdleConsumption, theme)
        expect(label).toBe(theme.palette.secondary.main)

        // Total Off Euro Idle Consumption
        label = getChartColor(metricTargetsEnum.totalEurosOffIdleConsumption, theme)
        expect(label).toBe(theme.palette.primary.light)

        // Subscription
        label = getChartColor(metricTargetsEnum.subscriptionPrices, theme)
        expect(label).toBe('#CCDCDD')

        // Peak hour consumption
        label = getChartColor(metricTargetsEnum.peakHourConsumption, theme)
        expect(label).toBe('#CC9121')

        // Off Peak hour consumption
        label = getChartColor(metricTargetsEnum.offPeakHourConsumption, theme)
        expect(label).toBe('#CCAB1D')

        // Euros Idle consumption
        label = getChartColor(metricTargetsEnum.eurosIdleConsumption, theme)
        expect(label).toBe('#8191B2')
    })
})
