import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { TEST_SUCCESS_WEEK_METRICS as MOCK_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { applyCamelCase } from 'src/common/react-platform-components'
import { MyConsumptionChartProps, periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

const TEST_SUCCESS_WEEK_METRICS = applyCamelCase(MOCK_WEEK_METRICS([metricTargetsEnum.consumption]))
// eslint-disable-next-line jsdoc/require-jsdoc
const propsMyConsumptionChart = {
    data: TEST_SUCCESS_WEEK_METRICS,
    chartType: 'consumption',
    period: 'daily' as periodType,
    range: getRange('day'),
    isStackedEnabled: false,
} as MyConsumptionChartProps

const apexChartsDailyPeriodWrapper = '.apexChartsDailyPeriodWrapper'
const apexChartsWeeklyPeriodWrapper = '.apexChartsWeeklyPeriodWrapper'
const apexChartsMonthlyPeriodWrapper = '.apexChartsMonthlyPeriodWrapper'
const apexChartsYearlyPeriodWrapper = '.apexChartsYearlyPeriodWrapper'
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

        expect(container.querySelector(apexChartsDailyPeriodWrapper)).toBeInTheDocument()
        expect(container.querySelector(apexChartsClassName)).toBeInTheDocument()
    })
    test('When Period changes, monthly and daily class should be shown', async () => {
        const cases = [
            {
                period: 'daily',
                className: apexChartsDailyPeriodWrapper,
            },
            {
                period: 'weekly',
                className: apexChartsWeeklyPeriodWrapper,
            },
            {
                period: 'monthly',
                className: apexChartsMonthlyPeriodWrapper,
            },
            {
                period: 'yearly',
                className: apexChartsYearlyPeriodWrapper,
            },
        ]
        cases.forEach((testCase) => {
            propsMyConsumptionChart.period = testCase.period as periodType
            const { container } = reduxedRender(
                <ThemeProvider theme={theme}>
                    <MyConsumptionChart {...propsMyConsumptionChart} />
                </ThemeProvider>,
            )

            expect(container.querySelector(testCase.className)).toBeInTheDocument()
        })
    })
})
