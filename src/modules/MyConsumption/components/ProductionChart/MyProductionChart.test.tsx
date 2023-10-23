import { reduxedRender } from 'src/common/react-platform-components/test'
import MyProductionChart, { productionChartClassName } from 'src/modules/MyConsumption/components/ProductionChart'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { TEST_SUCCESS_WEEK_METRICS as MOCK_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { applyCamelCase } from 'src/common/react-platform-components'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ProductionChartProps } from 'src/modules/MyConsumption/components/ProductionChart/ProductionChartTypes.d'

const TEST_SUCCESS_WEEK_METRICS = applyCamelCase(MOCK_WEEK_METRICS([metricTargetsEnum.totalProduction]))
// eslint-disable-next-line jsdoc/require-jsdoc
const propsMyProductionChart = {
    data: TEST_SUCCESS_WEEK_METRICS,
} as ProductionChartProps

describe('Test MyProductionChart', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    test('When ProductionChart is called with valid data, echarts should be shown', async () => {
        const { container } = reduxedRender(
            <ThemeProvider theme={theme}>
                <MyProductionChart {...propsMyProductionChart} />
            </ThemeProvider>,
        )
        expect(container.getElementsByClassName(`.${productionChartClassName}`)).toBeTruthy()
    })
})
