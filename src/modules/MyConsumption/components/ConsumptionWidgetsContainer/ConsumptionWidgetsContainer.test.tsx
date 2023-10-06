import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricFiltersType, metricIntervalType } from 'src/modules/Metrics/Metrics'
import ConsumptionWidgetsContainer from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer'
import { ConsumptionWidgetsContainerProps } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/WidgetContainer'
import { ConsumptionWidgetsMetricsProvider } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

const CONSOMMATION_TOTAL_TEXT = 'Consommation Totale'
const CONSOMMATION_PURCHASED_TEXT = 'Achetée'
const PRODUCTION_TOTAL_TEXT = 'Production Totale'
const PRODUCTION_INJECTED_TEXT = 'Injectée'
const AUTOCONSOMMATION_TEXT = 'Autoconsommation'

const widgetClassnameSelector = ' .MuiGrid-root .MuiGrid-item'
// const numbersOfWidgets = WidgetTargets.length
const LIST_WIDGETS_TEXT = 'Chiffres clés'
let mockGlobalProductionFeatureState = true

let mockFilters: metricFiltersType = [
    {
        key: 'meter_guid',
        operator: '=',
        value: '123456789',
    },
]
let mockMetricsInterval: metricIntervalType = '1m'
let mockPeriod: periodType = 'daily'
let mockRange = {
    from: '2022-06-04T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}

const consumptionWidgetsContainerProps: ConsumptionWidgetsContainerProps = {
    filters: mockFilters,
    metricsInterval: mockMetricsInterval,
    period: mockPeriod,
    range: mockRange,
    hasMissingHousingContracts: false,
    enedisOff: false,
    enphaseOff: false,
}

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

jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: [],
        isMetricsLoading: false,
        setRange: jest.fn(),
        setMetricsInterval: jest.fn(),
    }),
}))

describe('ConsumptionWidgetsContainer test', () => {
    afterEach(() => {
        consumptionWidgetsContainerProps.enphaseOff = false
        mockGlobalProductionFeatureState = true
    })
    test('the widgets is showing correctly', async () => {
        const { container, getByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(8)

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_INJECTED_TEXT)).toBeInTheDocument()
        expect(getByText(AUTOCONSOMMATION_TEXT)).toBeInTheDocument()
    })
    // test('when the enphase consent is not active, the widgets of production & autoconsumption should not be showing', async () => {
    //     consumptionWidgetsContainerProps.enphaseOff = true
    //     const { container, getByText, queryByText } = reduxedRender(
    //         <Router>
    //             <ConsumptionWidgetsMetricsProvider>
    //                 <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
    //             </ConsumptionWidgetsMetricsProvider>
    //         </Router>,
    //     )
    //     expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
    //     expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(6)

    //     expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
    //     expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
    //     expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
    //     expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
    // })

    // test('when the enphase feature is disabled, the widgets of production & autoconsumption should not be showing', async () => {
    //     mockGlobalProductionFeatureState = false // in tests no need for this since we mocked the hire function (IsProductionActiveAndHasHousingAccess)
    //     mockIsProductionActiveAndHousingHasAccess = false
    //     const { container, getByText, queryByText } = reduxedRender(
    //         <Router>
    //             <ConsumptionWidgetsMetricsProvider>
    //                 <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
    //             </ConsumptionWidgetsMetricsProvider>
    //         </Router>,
    //     )
    //     expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
    //     expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(6)

    //     expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
    //     expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
    //     expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
    //     expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
    // })
})
