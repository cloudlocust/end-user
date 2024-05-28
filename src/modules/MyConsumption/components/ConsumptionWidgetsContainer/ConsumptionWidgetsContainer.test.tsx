import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricFiltersType, metricIntervalType, IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import ConsumptionWidgetsContainer from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer'
import { ConsumptionWidgetsContainerProps } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/WidgetContainer'
import {
    ConsumptionWidgetsMetricsContext,
    ConsumptionWidgetsMetricsProvider,
} from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { PeriodEnum, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { endOfDay, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

const CONSOMMATION_TOTAL_TEXT = 'Consommation Totale'
const CONSOMMATION_PURCHASED_TEXT = 'Achetée'
const CONSOMMATION_VEILLE_TEXT = 'Consommation de Veille'
const PRODUCTION_TOTAL_TEXT = 'Production Totale'
const PRODUCTION_INJECTED_TEXT = 'Injectée'
const AUTOCONSOMMATION_TEXT = 'Autoconsommation'
const COUT_TOTAL_TEXT = 'Coût Total'
const PUISSANCE_MAXIMALE_TEXT = 'Puissance Maximale'

const widgetClassnameSelector = ' .MuiGrid-root .MuiGrid-item'
// const numbersOfWidgets = WidgetTargets.length
const LIST_WIDGETS_TEXT = 'Chiffres clés'
let mockGlobalProductionFeatureState = true

let mockFilters: metricFiltersType = [
    {
        key: 'housing_id',
        operator: '=',
        value: '123456789',
    },
]
let mockMetricsInterval: metricIntervalType = '1m'
let mockPeriod: periodType = 'daily'
const mockPreviousDayRange = {
    from: '2022-06-04T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}
const currentTime = utcToZonedTime(new Date(), 'Europe/Paris')
const mockTodayRange = {
    from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
    to: getDateWithoutTimezoneOffset(endOfDay(currentTime)),
}

let consumptionWidgetsContainerProps: ConsumptionWidgetsContainerProps

let mockIsProductionActiveAndHousingHasAccess = true

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get globalProductionFeatureState() {
        return mockGlobalProductionFeatureState
    },
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => true,
    //eslint-disable-next-line
    isProductionActiveAndHousingHasAccess: () => mockIsProductionActiveAndHousingHasAccess,
}))

// Convert metricTargetsEnum enum to array of values for we can set it in target (simulate the existing data).
let metricsData: IMetric[] = Object.values(metricTargetsEnum).map(
    (target) =>
        ({
            target,
            datapoints: [[120, 1707435000000]],
        } as IMetric),
)

let mockMetricsData: IMetric[] = JSON.parse(JSON.stringify(metricsData))

jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockMetricsData,
        isMetricsLoading: false,
        setRange: jest.fn(),
        setMetricsInterval: jest.fn(),
        getMetricsWithParams: jest.fn(),
        setData: jest.fn(),
    }),
}))

let mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.Consumption
jest.mock('src/modules/MyConsumption/store/myConsumptionStore', () => ({
    /**
     * Mock useMyConsumptionStore hook for we can change between tabs.
     *
     * @returns Current tab.
     */
    useMyConsumptionStore: () => ({ consumptionToggleButton: mockMyConsumptionTab }),
}))

describe('ConsumptionWidgetsContainer test', () => {
    beforeEach(() => {
        consumptionWidgetsContainerProps = {
            filters: mockFilters,
            metricsInterval: mockMetricsInterval,
            period: mockPeriod,
            range: mockTodayRange,
            hasMissingHousingContracts: false,
            enedisOff: false,
            enphaseOff: false,
            isIdleWidgetShown: true,
        }
    })

    afterEach(() => {
        consumptionWidgetsContainerProps.enphaseOff = false
        mockGlobalProductionFeatureState = true
    })

    test('when the range is for today, show the correspond widgets', async () => {
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(3)

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(COUT_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
        // productions widgets are not showing
        expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
        expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PUISSANCE_MAXIMALE_TEXT)).not.toBeInTheDocument()
    })

    test('when isIdleWidgetShown is false, do not show the widget "veille"', async () => {
        consumptionWidgetsContainerProps.isIdleWidgetShown = false
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(2)
        // Widgets that should be shown
        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(COUT_TOTAL_TEXT)).toBeInTheDocument()
        // Widgets that should not be shown
        expect(queryByText(CONSOMMATION_VEILLE_TEXT)).not.toBeInTheDocument()
        expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
        expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PUISSANCE_MAXIMALE_TEXT)).not.toBeInTheDocument()
    })

    test.each([PeriodEnum.WEEKLY, PeriodEnum.MONTHLY, PeriodEnum.YEARLY])(
        'when the period is not $period, Pmax widget should be shown',
        (period) => {
            consumptionWidgetsContainerProps.period = period
            const { container, getByText, queryByText } = reduxedRender(
                <Router>
                    <ConsumptionWidgetsMetricsProvider>
                        <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                    </ConsumptionWidgetsMetricsProvider>
                </Router>,
            )
            expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
            expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(4)

            // Widgets that should be shown
            expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
            expect(getByText(COUT_TOTAL_TEXT)).toBeInTheDocument()
            expect(getByText(PUISSANCE_MAXIMALE_TEXT)).toBeInTheDocument()
            expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
            // Widgets that should not be shown
            expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
            expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
            expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
            expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
        },
    )

    test('when the range is not for today, do not show Pmax widget', async () => {
        consumptionWidgetsContainerProps.range = mockPreviousDayRange
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(3)

        expect(queryByText(PUISSANCE_MAXIMALE_TEXT)).not.toBeInTheDocument()
    })

    describe('when AutoconsmptionProduction button is toggled', () => {
        test('when AutoconsmptionProduction button is toggled, show the correspond widgets', async () => {
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
            let mockCurrentRangeMetricWidgetsData = [
                {
                    target: metricTargetsEnum.injectedProduction,
                    datapoints: [[123, 1651406400]],
                },
            ]
            const mockGetMetricsWidgetsData = jest.fn().mockReturnValue(mockCurrentRangeMetricWidgetsData)

            const contextValue = {
                storeWidgetMetricsData: jest.fn(),
                currentRangeMetricWidgetsData: mockCurrentRangeMetricWidgetsData,
                oldRangeMetricWidgetsData: [],
                getMetricsWidgetsData: mockGetMetricsWidgetsData,
                resetMetricsWidgetData: jest.fn(),
            }

            const { container, getByText, queryByText } = reduxedRender(
                <Router>
                    <ConsumptionWidgetsMetricsContext.Provider value={contextValue}>
                        <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                    </ConsumptionWidgetsMetricsContext.Provider>
                </Router>,
            )
            expect(getByText(LIST_WIDGETS_TEXT)).toBeInTheDocument()
            expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(5)
            // Widgets that should be shown
            expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
            expect(getByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
            expect(getByText(COUT_TOTAL_TEXT)).toBeInTheDocument()
            expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
            expect(getByText(PRODUCTION_TOTAL_TEXT)).toBeInTheDocument()
            expect(getByText(PRODUCTION_INJECTED_TEXT)).toBeInTheDocument()
            expect(getByText(AUTOCONSOMMATION_TEXT)).toBeInTheDocument()
            /// Widgets that should not be shown
            expect(queryByText(PUISSANCE_MAXIMALE_TEXT)).not.toBeInTheDocument()
        })
        test('when the metrics of injected production not available, the widgets of autoconsumption and injection should not be showing', async () => {
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
            let mockCurrentRangeMetricWidgetsData = [
                {
                    target: metricTargetsEnum.injectedProduction,
                    datapoints: [[null, 1651406400]],
                },
            ]
            const mockGetMetricsWidgetsData = jest.fn().mockReturnValue(mockCurrentRangeMetricWidgetsData)

            const contextValue = {
                storeWidgetMetricsData: jest.fn(),
                currentRangeMetricWidgetsData: mockCurrentRangeMetricWidgetsData as IMetric[],
                oldRangeMetricWidgetsData: [],
                getMetricsWidgetsData: mockGetMetricsWidgetsData,
                resetMetricsWidgetData: jest.fn(),
            }

            mockMetricsData = mockMetricsData.map((metric) =>
                metric.target === metricTargetsEnum.injectedProduction ? { ...metric, datapoints: [] } : metric,
            )
            const { container, getByText, queryByText } = reduxedRender(
                <Router>
                    <ConsumptionWidgetsMetricsContext.Provider value={contextValue}>
                        <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                    </ConsumptionWidgetsMetricsContext.Provider>
                </Router>,
            )
            expect(getByText(LIST_WIDGETS_TEXT)).toBeInTheDocument()
            expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(4)
            // Widgets should be shown
            expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
            expect(getByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
            expect(getByText(PRODUCTION_TOTAL_TEXT)).toBeInTheDocument()
            // Widgets should not be shown
            expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
            expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
        })

        test('when the enphase consent is not active, the widgets of production & autoconsumption should not be showing', async () => {
            consumptionWidgetsContainerProps.enphaseOff = true
            mockMetricsData = []
            const { container, getByText, queryByText } = reduxedRender(
                <Router>
                    <ConsumptionWidgetsMetricsProvider>
                        <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                    </ConsumptionWidgetsMetricsProvider>
                </Router>,
            )
            expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
            expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(3)

            expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
            expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
            expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
            expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
            expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
            expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
            expect(getByText(COUT_TOTAL_TEXT)).toBeInTheDocument()
            expect(queryByText(PUISSANCE_MAXIMALE_TEXT)).not.toBeInTheDocument()
        })

        test('when the enphase feature is disabled, the widgets of production & autoconsumption should not be showing', async () => {
            mockGlobalProductionFeatureState = false // in tests no need for this since we mocked the hire function (IsProductionActiveAndHasHousingAccess)
            mockIsProductionActiveAndHousingHasAccess = false
            mockMetricsData = []
            const { container, getByText, queryByText } = reduxedRender(
                <Router>
                    <ConsumptionWidgetsMetricsProvider>
                        <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                    </ConsumptionWidgetsMetricsProvider>
                </Router>,
            )
            expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
            expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(3)

            expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
            expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
            expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
            expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
            expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
            expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
            expect(getByText(COUT_TOTAL_TEXT)).toBeInTheDocument()
            expect(queryByText(PUISSANCE_MAXIMALE_TEXT)).not.toBeInTheDocument()
        })
    })
})
