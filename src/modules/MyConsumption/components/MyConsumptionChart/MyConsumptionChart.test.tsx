import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionChart } from 'src/modules/MyConsumption'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { TEST_SUCCESS_WEEK_METRICS as MOCK_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { applyCamelCase } from 'src/common/react-platform-components'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
const TEST_SUCCESS_WEEK_METRICS = applyCamelCase(MOCK_WEEK_METRICS)
// eslint-disable-next-line jsdoc/require-jsdoc
const propsMyConsumptionChart = {
    data: TEST_SUCCESS_WEEK_METRICS,
    chartType: 'bar',
    isMetricsLoading: false,
    period: 7 as periodValue,
}
const circularProgressClassname = '.MuiCircularProgress-root'
const apexChartsClassName = '.apexcharts-svg'

// Mocking apexcharts, because there are errors related to modules not found, in test mode.
// TODO remove this and check if there is a solution to test ApexCharts without mocking it.
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

describe('Test MyConsumptionChart', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    test('When ConsumptionChart is called with valid data, apexChart should be shown', async () => {
        const { container } = reduxedRender(
            <ThemeProvider theme={theme}>
                <MyConsumptionChart {...propsMyConsumptionChart} />
            </ThemeProvider>,
        )

        expect(container.querySelector(apexChartsClassName)).toBeInTheDocument()
    })
    test('When isMetricsLoading true, Circular progress should be shown', async () => {
        propsMyConsumptionChart.isMetricsLoading = true
        const { container } = reduxedRender(
            <ThemeProvider theme={theme}>
                <MyConsumptionChart {...propsMyConsumptionChart} />
            </ThemeProvider>,
        )

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
