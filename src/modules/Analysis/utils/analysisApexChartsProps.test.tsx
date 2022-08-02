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
// 1 Jan 2022, 2 Jan 2022, 3 Jan 2022
const mockTimeStampValues = [1640995200000, 1641081600000, 1641168000000]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockOptions: (theme: Theme) => ApexOptions = (theme) => ({
    ...defaultAnalysisApexChartsOptions(theme),
    fill: {
        opacity: [1, 0.7, 1],
    },
    colors: [theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark],
    tooltip: {
        custom:
            // eslint-disable-next-line jsdoc/require-jsdoc
            ({ seriesIndex }) =>
                renderToString(
                    <AnalysisChartTooltip
                        valueIndex={seriesIndex}
                        values={mockValues}
                        timestampValues={mockTimeStampValues}
                        theme={theme}
                    />,
                ),
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
        const analysisApexChartsProps = getAnalysisApexChartProps(mockValues, mockTimeStampValues, theme)
        const mockOptionsResult = mockOptions(theme)
        expect(JSON.stringify(analysisApexChartsProps.options)).toStrictEqual(JSON.stringify(mockOptionsResult))
        expect(
            (analysisApexChartsProps.options.tooltip!.custom! as (options: any) => any)({ seriesIndex: 1 }),
        ).toStrictEqual(
            renderToString(
                <AnalysisChartTooltip
                    valueIndex={1}
                    timestampValues={mockTimeStampValues}
                    values={mockValues}
                    theme={theme}
                />,
            ),
        )
    })
})
