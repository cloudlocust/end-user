import {
    defaultAnalysisApexChartsOptions,
    getAnalysisApexChartProps,
    getValueTooltipText,
} from 'src/modules/Analysis/utils/analysisApexChartsProps'
import { Theme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'

const mockValues = [10, 20, 30]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockTooltipY: ApexTooltipY = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatter: function (normalizedValue, { seriesIndex: valueIndex }) {
        return `${Number(mockValues[valueIndex]).toFixed(2)} kWh`
    },
    title: {
        // eslint-disable-next-line jsdoc/require-jsdoc
        formatter: (seriesName) => '',
    },
}
// eslint-disable-next-line jsdoc/require-jsdoc
const mockOptions: (theme: Theme) => ApexOptions = (theme) => ({
    ...defaultAnalysisApexChartsOptions(theme),
    tooltip: {
        y: { ...mockTooltipY },
    },
})

describe('test pure function', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    test('getAnalysisApexChartProps test with valid data', async () => {
        // ApexChart Props
        const analysisApexChartsProps = getAnalysisApexChartProps(mockValues, theme)
        const mockOptionsResult = mockOptions(theme)
        expect(JSON.stringify(analysisApexChartsProps.options)).toStrictEqual(JSON.stringify(mockOptionsResult))
        expect(
            (analysisApexChartsProps.options.tooltip!.y! as ApexTooltipY).formatter!(0, { seriesIndex: 0 }),
        ).toStrictEqual(`${mockValues[0].toFixed(2)} kWh`)
        expect(
            (analysisApexChartsProps.options.tooltip!.y! as ApexTooltipY).title!.formatter!('SERIES NAME'),
        ).toStrictEqual('')
    })

    test('getValueTooltipText test with different cases', async () => {
        const values = [
            // Null value.
            null,
            // Valid value.
            10.55,
        ]

        const unit = 'kWh'
        // Test cases
        const results = [
            // Null value tooltip text
            ` ${unit}`,
            // Valid value tooltip text
            `10.55 ${unit}`,
        ]
        results.forEach((newValue, index) => {
            expect(getValueTooltipText(index, values)).toEqual(results[index])
        })
    })
})
