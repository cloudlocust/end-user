import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { periodType, ProductionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import { IEnphaseConsent } from 'src/modules/Consents/Consents'
import { ProductionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ProductionChartContainer'
import { ENPHASE_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS([
    metricTargetsEnum.totalProduction,
    metricTargetsEnum.injectedProduction,
    metricTargetsEnum.autoconsumption,
])

// Enphase Consent default
const enphaseConsent: IEnphaseConsent = {
    meterGuid: '133456',
    enphaseConsentState: 'ACTIVE',
}

let mockIsMetricsLoading = false
const mockSetFilters = jest.fn()
const PRODUCTION_TITLE_DAILY = 'en Watt par jour'
const PRODUCTION_TITLE_WEEKLY = 'en kWh par semaine'
const PRODUCTION_TITLE_MONTHLY = 'en kWh par mois'
const PRODUCTION_TITLE_YEARLY = 'en kWh par année'
const apexchartsClassName = 'apexcharts-svg'
const PRODUCTION_TITLE_TEXT = 'Ma production'
const mockGetMetricsWithParams = jest.fn()
const circularProgressClassname = '.MuiCircularProgress-root'
let mockProductionChartErrorState = false
let mockFilters: metricFiltersType = [
    {
        key: 'network_identifier',
        operator: '=',
        value: 123456789,
    },
]
let mockRange = {
    from: '2022-06-04T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}

let mockPeriod: periodType = 'daily'
let mockMetricsInterval: metricIntervalType = '1m'

const productionChartContainerProps: ProductionChartContainerProps = {
    filters: mockFilters,
    enphaseConsent,
    metricsInterval: mockMetricsInterval,
    period: mockPeriod,
    range: mockRange,
}

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        filters: mockFilters,
        range: mockRange,
        isMetricsLoading: mockIsMetricsLoading,
        setRange: jest.fn(),
        setMetricsInterval: jest.fn(),
        interval: '1m',
        setFilters: mockSetFilters,
        getMetricsWithParams: mockGetMetricsWithParams,
    }),
}))

// ProductionChartContainer cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className={`${apexchartsClassName}`} {...props}></div>,
)

jest.mock('src/modules/MyConsumption/MyConsumptionConfig', () => ({
    ...jest.requireActual('src/modules/MyConsumption/MyConsumptionConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get productionChartErrorState() {
        return mockProductionChartErrorState
    },
}))

describe('ProductionChartContainer test', () => {
    test('Different period props, When production chart.', async () => {
        const productionTitleCases = [
            {
                period: 'daily' as periodType,
                text: PRODUCTION_TITLE_DAILY,
            },
            {
                period: 'weekly' as periodType,
                text: PRODUCTION_TITLE_WEEKLY,
            },
            {
                period: 'monthly' as periodType,
                text: PRODUCTION_TITLE_MONTHLY,
            },
            {
                period: 'yearly' as periodType,
                text: PRODUCTION_TITLE_YEARLY,
            },
        ]

        productionTitleCases.forEach(({ period, text }) => {
            productionChartContainerProps.period = period
            const { getByText } = reduxedRender(
                <Router>
                    <ProductionChartContainer {...productionChartContainerProps} />
                </Router>,
            )
            expect(getByText(text)).toBeTruthy()
        })
    })
    test('When isMetricsLoading true, Spinner is shown', async () => {
        mockIsMetricsLoading = true
        const { container } = reduxedRender(
            <Router>
                <ProductionChartContainer {...productionChartContainerProps} />
            </Router>,
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
        expect(container.querySelector(`.${apexchartsClassName}`)).not.toBeInTheDocument()
    })
    test('When enphaseConsentState not Active.', async () => {
        mockIsMetricsLoading = true

        enphaseConsent!.enphaseConsentState = 'EXPIRED'
        productionChartContainerProps.enphaseConsent = enphaseConsent
        const { getByText } = reduxedRender(
            <Router>
                <ProductionChartContainer {...productionChartContainerProps} />
            </Router>,
        )
        expect(() => getByText(PRODUCTION_TITLE_TEXT)).toThrow()
    })

    test('When productionChartErrorState.', async () => {
        enphaseConsent!.enphaseConsentState = 'EXPIRED'
        productionChartContainerProps.enphaseConsent = enphaseConsent
        mockProductionChartErrorState = true
        const { getByText } = reduxedRender(
            <Router>
                <ProductionChartContainer {...productionChartContainerProps} />
            </Router>,
        )
        expect(getByText(ENPHASE_OFF_MESSAGE)).toBeTruthy()
    })
})
