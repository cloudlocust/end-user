import { reduxedRender } from 'src/common/react-platform-components/test'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { TEST_SUCCESS_WEEK_METRICS as MOCK_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { applyCamelCase } from 'src/common/react-platform-components'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionChartProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'

const TEST_SUCCESS_WEEK_METRICS = applyCamelCase(MOCK_WEEK_METRICS([metricTargetsEnum.consumption]))
// eslint-disable-next-line jsdoc/require-jsdoc
const propsMyConsumptionChart = {
    data: TEST_SUCCESS_WEEK_METRICS,
    isSolarProductionConsentOff: false,
} as ConsumptionChartProps

const eChartsClassName = '.echarts-for-react'

describe('Test MyConsumptionChart', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    test('When ConsumptionChart is called with valid data, echarts should be shown', async () => {
        const { container } = reduxedRender(
            <ThemeProvider theme={theme}>
                <MyConsumptionChart {...propsMyConsumptionChart} />
            </ThemeProvider>,
        )
        expect(container.querySelector(eChartsClassName)).toBeInTheDocument()
    })
})
