import {
    defaultAnalysisApexChartsOptions,
    getAnalysisApexChartProps,
} from 'src/modules/Analysis/utils/analysisApexChartsProps'
import { Theme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import AnalysisChartTooltip from 'src/modules/Analysis/components/AnalysisChart/AnalysisChartTooltip'
import { renderToString } from 'react-dom/server'
const mockValues = [10, 20, 30]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockTooltipY: ApexTooltipY = {
    title: {
        // eslint-disable-next-line jsdoc/require-jsdoc
        formatter: (seriesName) => '',
    },
}
// eslint-disable-next-line jsdoc/require-jsdoc
const mockOptions: (theme: Theme) => ApexOptions = (theme) => ({
    ...defaultAnalysisApexChartsOptions(theme),
    tooltip: {
        custom:
            // eslint-disable-next-line jsdoc/require-jsdoc
            ({ seriesIndex }) =>
                renderToString(<AnalysisChartTooltip valueIndex={seriesIndex} values={values} theme={theme} />),
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
            (analysisApexChartsProps.options.tooltip!.y! as ApexTooltipY).title!.formatter!('SERIES NAME'),
        ).toStrictEqual('')

        expect(analysisApexChartsProps.options.tooltip!.custom!({ seriesIndex: 0 })).toBe(
            renderToString(<AnalysisChartTooltip valueIndex={0} values={mockValues} theme={theme} />),
        )
    })
})
