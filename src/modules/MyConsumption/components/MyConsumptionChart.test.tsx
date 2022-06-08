import React from 'react'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionChart } from 'src/modules/MyConsumption'
import { fakeData } from 'src/modules/MyConsumption/utils/fakeData'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
// eslint-disable-next-line jsdoc/require-jsdoc
const propsMyConsumptionChart = {
    data: fakeData,
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
    // TODO test better and fix s.observe error.
    // test('When component mount with data', async () => {
    //     const { getByTestId } = reduxedRender(
    //         <ThemeProvider theme={theme}>
    //             <MyConsumptionChart {...propsMyConsumptionChart} />)
    //         </ThemeProvider>,
    //     )

    //     await waitFor(() => {
    //         expect(getByTestId(APEXCHARTS_TESTID)).toBeTruthy()
    //     })
    // })
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
