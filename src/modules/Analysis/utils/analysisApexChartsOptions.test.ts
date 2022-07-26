import {
    defaultAnalysisApexChartsOptions,
    getAnalysisApexChartOptions,
} from 'src/modules/Analysis/utils/analysisApexChartsOptions'
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
    test('getAnalysisApexChartOptions test with valid data', async () => {
        // ApexChart Props
        const analysisApexChartsOptions = getAnalysisApexChartOptions(mockValues, theme)
        const mockOptionsResult = mockOptions(theme)
        expect(JSON.stringify(analysisApexChartsOptions)).toStrictEqual(JSON.stringify(mockOptionsResult))
        expect((analysisApexChartsOptions.tooltip!.y! as ApexTooltipY).formatter!(0, { seriesIndex: 0 })).toStrictEqual(
            `${mockValues[0].toFixed(2)} kWh`,
        )
        expect((analysisApexChartsOptions.tooltip!.y! as ApexTooltipY).title!.formatter!('SERIES NAME')).toStrictEqual(
            '',
        )
    })
})
