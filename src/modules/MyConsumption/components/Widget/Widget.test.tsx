import { reduxedRender } from 'src/common/react-platform-components/test'
import { globalProductionFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import { ProductionWidgetErrorIcon } from 'src/modules/MyConsumption/components/WidgetInfoIcons'
import {
    ConsumptionWidgetsMetricsContext,
    ConsumptionWidgetsMetricsProvider,
} from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { renderWidgetTitle } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

const TEST_WEEK_DATA: IMetric[] = TEST_SUCCESS_WEEK_METRICS([metricTargetsEnum.consumption])
let mockData: IMetric[] = TEST_WEEK_DATA

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const CONSOMMATION_TOTALE_TEXT = globalProductionFeatureState ? 'Achetée' : 'Consommation Totale'
const CONSOMMATION_TOTALE_UNIT = 'kWh'

const NO_DATA_MESSAGE = 'Aucune donnée disponible'
const circularProgressClassname = '	.MuiCircularProgress-root'

const ENPHASE_CONSENT_INACTIVE_ERROR_ICON = 'ErrorOutlineIcon'

const mockGetMetricsWithParams = jest.fn()
let mockFilters: metricFiltersType = [
    {
        key: 'housing_id',
        operator: '=',
        value: '123456789',
    },
]
let mockRange = {
    from: '2022-06-01T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}
let mockIsMetricsLoading = false
const mockSetFilters = jest.fn()
let mockPeriod: periodType = 'weekly'
let mockMetricsInterval: metricIntervalType = '1d'

let mockWidgetPropsDefault: IWidgetProps = {
    period: mockPeriod,
    filters: mockFilters,
    metricsInterval: mockMetricsInterval,
    range: mockRange,
    targets: [metricTargetsEnum.consumption],
}

const mockConsumptionToggleButton = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction

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
        interval: mockMetricsInterval,
        setFilters: mockSetFilters,
        getMetricsWithParams: mockGetMetricsWithParams,
    }),
}))

// need to mock this because myHouseConfig uses it
jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    //eslint-disable-next-line
    isProductionActiveAndHousingHasAccess: () => true,
}))

jest.mock('src/modules/MyConsumption/store/myConsumptionStore', () => ({
    /**
     * Mock useMyConsumptionStore hook for we can change between tabs.
     *
     * @returns Current tab.
     */
    useMyConsumptionStore: () => ({
        consumptionToggleButton: mockConsumptionToggleButton,
    }),
}))

/**
 * Render the widget with the given props.
 *
 * @param props The props to pass to the widget.
 * @returns The render result.
 */
const renderTestComponent = (props: IWidgetProps) => {
    return reduxedRender(
        <ConsumptionWidgetsMetricsProvider>
            <Widget {...props} />
        </ConsumptionWidgetsMetricsProvider>,
    )
}

describe('Widget component test', () => {
    test('when isMetricLoading is true, a spinner is shown', async () => {
        mockIsMetricsLoading = true
        const { container } = renderTestComponent(mockWidgetPropsDefault)

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
    test('When widget getMetrics, value should be shown', async () => {
        mockIsMetricsLoading = false
        mockData[0].datapoints = [[1000, 1651406400]]
        const { getByText } = renderTestComponent(mockWidgetPropsDefault)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeInTheDocument()
        // Data is converted to kWh
        expect(getByText(1)).toBeInTheDocument()
    })

    test('when there is no data, an error message is shown', async () => {
        mockData = []
        const { getByText } = renderTestComponent(mockWidgetPropsDefault)

        expect(getByText(NO_DATA_MESSAGE)).toBeTruthy()
    })

    test('when the infoIcon is given, icon is shown in the widget.', async () => {
        mockData = []
        const mockWidgetProps: IWidgetProps = {
            ...mockWidgetPropsDefault,
            infoIcons: { [metricTargetsEnum.consumption]: <ProductionWidgetErrorIcon /> },
        }
        const { getByTestId } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <Widget {...mockWidgetProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )

        expect(getByTestId(ENPHASE_CONSENT_INACTIVE_ERROR_ICON)).toBeTruthy()
        userEvent.click(getByTestId(ENPHASE_CONSENT_INACTIVE_ERROR_ICON))
        expect(window.location.pathname).toBe(`${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}`)
    })

    test('when there is many targets, all targets should be rendered', async () => {
        mockData = []

        const mockCurrentRangeMetricWidgetsData = [
            {
                target: metricTargetsEnum.injectedProduction,
                datapoints: [[123, 1651406400]],
            },
        ]
        // mock injectedProduction metric data, so that the autoconsumption widget is shown.
        const contextValue = {
            storeWidgetMetricsData: jest.fn(),
            currentRangeMetricWidgetsData: mockCurrentRangeMetricWidgetsData,
            oldRangeMetricWidgetsData: [],
            getMetricsWidgetsData: jest.fn(),
            resetMetricsWidgetData: jest.fn(),
        }

        const { getByText } = reduxedRender(
            <ConsumptionWidgetsMetricsContext.Provider value={contextValue}>
                <Widget
                    {...mockWidgetPropsDefault}
                    targets={[metricTargetsEnum.totalProduction, metricTargetsEnum.autoconsumption]}
                />
            </ConsumptionWidgetsMetricsContext.Provider>,
        )

        expect(getByText(renderWidgetTitle(metricTargetsEnum.totalProduction))).toBeInTheDocument()
        expect(getByText(renderWidgetTitle(metricTargetsEnum.autoconsumption))).toBeInTheDocument()
    })
})
