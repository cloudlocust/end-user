import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { periodType, ProductionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import { ProductionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ProductionChartContainer'
import { ENPHASE_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS([
    metricTargetsEnum.totalProduction,
    metricTargetsEnum.injectedProduction,
    metricTargetsEnum.autoconsumption,
])

let mockIsMetricsLoading = false
const mockSetFilters = jest.fn()
const PRODUCTION_TITLE_DAILY = 'en Watt par jour'
const PRODUCTION_TITLE_WEEKLY = 'en kWh par semaine'
const PRODUCTION_TITLE_MONTHLY = 'en kWh par mois'
const PRODUCTION_TITLE_YEARLY = 'en kWh par année'
const apexchartsClassName = 'apexcharts-svg'
const PRODUCTION_CONSENT_OFF_MESSAGE =
    'Pour voir vos données de production veuillez connecter votre onduleur Ou Reliez la prise Shelly de vos panneaux plug&play'
const mockGetMetricsWithParams = jest.fn()
const circularProgressClassname = '.MuiCircularProgress-root'
let mockProductionChartErrorState = false
let mockConnectedPlugsFeatureState = true
let mockFilters: metricFiltersType = [
    {
        key: 'meter_guid',
        operator: '=',
        value: '123456789',
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
    isProductionConsentOff: false,
    isProductionConsentLoadingInProgress: false,
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

// Set connected plug feature state to test associate of connected plug.
jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get connectedPlugsFeatureState() {
        return mockConnectedPlugsFeatureState
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
    test('When only isMetricsLoading true, Spinner is shown', async () => {
        mockIsMetricsLoading = true
        const { container } = reduxedRender(
            <Router>
                <ProductionChartContainer {...productionChartContainerProps} />
            </Router>,
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
        expect(container.querySelector(`.${apexchartsClassName}`)).not.toBeInTheDocument()
    })

    test('When only isProductionConsentLoadingInProgress true, Spinner is shown', async () => {
        productionChartContainerProps.isProductionConsentLoadingInProgress = true
        const { container } = reduxedRender(
            <Router>
                <ProductionChartContainer {...productionChartContainerProps} />
            </Router>,
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
        expect(container.querySelector(`.${apexchartsClassName}`)).not.toBeInTheDocument()
    })

    test('When connectedPlugProduction and enphaseConsent OFF.', async () => {
        mockIsMetricsLoading = false
        mockProductionChartErrorState = true
        productionChartContainerProps.isProductionConsentOff = true
        productionChartContainerProps.isProductionConsentLoadingInProgress = false
        mockConnectedPlugsFeatureState = true
        const { getByText } = reduxedRender(
            <Router>
                <ProductionChartContainer {...productionChartContainerProps} />
            </Router>,
        )
        expect(getByText(PRODUCTION_CONSENT_OFF_MESSAGE)).toBeTruthy()
    })

    test('When only enphaseConsentOff.', async () => {
        mockConnectedPlugsFeatureState = false
        process.env.REACT_APP_CONNECTED_PLUGS_FEATURE_STATE = 'disabled'
        const { getByText } = reduxedRender(
            <Router>
                <ProductionChartContainer {...productionChartContainerProps} />
            </Router>,
        )
        expect(getByText(ENPHASE_OFF_MESSAGE)).toBeTruthy()

        process.env.REACT_APP_CONNECTED_PLUGS_FEATURE_STATE = 'enabled'
    })
})
