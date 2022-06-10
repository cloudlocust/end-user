import React from 'react'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionChart } from 'src/modules/MyConsumption'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { TEST_SUCCESS_DAY_METRICS as MOCK_DAY_METRICS } from 'src/mocks/handlers/metrics'
import { applyCamelCase } from 'src/common/react-platform-components'
const TEST_SUCCESS_DAY_METRICS = applyCamelCase(MOCK_DAY_METRICS)
// eslint-disable-next-line jsdoc/require-jsdoc
const propsMyConsumptionChart = {
    data: TEST_SUCCESS_DAY_METRICS,
    chartType: 'bar',
    isMetricsLoading: false,
}

// const APEXCHARTS_TESTID = 'apexcharts'
describe('Test MyConsumptionChart', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    // The ReactApexCharts component which used chart.js to create a line chart, ResizeObserver is being used internally.
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }))
    test('When isMetricsLoading true, Circular progress should be shown', async () => {
        propsMyConsumptionChart.isMetricsLoading = true
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <MyConsumptionChart {...propsMyConsumptionChart} />
            </ThemeProvider>,
        )

        await waitFor(() => {
            expect(() => getByText('MODIFIER_BUTTON_TEXT')).toThrow()
        })
    })
})
