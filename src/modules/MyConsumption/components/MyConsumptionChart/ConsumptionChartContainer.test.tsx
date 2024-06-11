import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import {
    getMetricsWithParamsType,
    IMetric,
    metricFiltersType,
    metricIntervalType,
    metricTargetsEnum,
} from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS, TEST_SUCCESS_YEAR_METRICS } from 'src/mocks/handlers/metrics'
import { cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import { IEnedisSgeConsent, INrlinkConsent, IEnphaseConsent } from 'src/modules/Consents/Consents'
import {
    ConsumptionChartContainer,
    URL_SOLAR_INSTALLATION_RECOMMENDATION,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { setupJestCanvasMock } from 'jest-canvas-mock'
import { NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { screen, within } from '@testing-library/react'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

// mock store.

let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS([metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption])
let mockAdditionalData: IMetric[] = TEST_SUCCESS_WEEK_METRICS([
    metricTargetsEnum.consumption,
    metricTargetsEnum.eurosConsumption,
])

// Nrlink Consent format
const nrLinkConsent: INrlinkConsent = {
    meterGuid: '133456',
    nrlinkConsentState: 'CONNECTED',
    nrlinkGuid: '12',
}

// Enedis Consent format
const mockEnedisSgeConsentConnected: IEnedisSgeConsent = {
    meterGuid: '133456',
    enedisSgeConsentState: 'CONNECTED',
    expiredAt: '',
}

// Enedis Consent format
const mockEnedisSgeConsentOff: IEnedisSgeConsent = {
    meterGuid: '133456',
    enedisSgeConsentState: 'NONEXISTENT',
    expiredAt: '',
}
// Enphase Consent default
const enphaseConsent: IEnphaseConsent = {
    meterGuid: '133456',
    enphaseConsentState: 'ACTIVE',
}

let mockNrlinkConsent: INrlinkConsent | undefined = nrLinkConsent
let mockEnedisConsent: IEnedisSgeConsent | undefined = mockEnedisSgeConsentConnected
let mockEnphaseConsent: IEnphaseConsent | undefined = enphaseConsent as IEnphaseConsent
let mockProductionChartErrorState = false

let mockIsMetricsLoading = false
const mockSetFilters = jest.fn()
const HAS_MISSING_CONTRACTS_WARNING_TEXT =
    "Ce graphe est un exemple basé sur un tarif Bleu EDF Base. Vos données contractuelles de fourniture d'énergie ne sont pas disponibles sur toute la période."
const HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT = "Renseigner votre contrat d'énergie"
const CONSUMPTION_ENEDIS_SGE_WARNING_TEXT = 'Accéder à votre historique de consommation'
const MESSING_DATA_WARNING_TEXT =
    'Il se peut que vos données soient incomplètes si vous tentez d’afficher une période sans contrat déclaré ou sans Linky ou encore si la période est antérieure à 3 ans.'
const EUROS_CONSUMPTION_ICON_TEST_ID = 'euros-consumption-button'
const menuButtonLabelText = 'target-menu'
const menuItemRole = 'menuitem'
const DECREMENT_DATE_ARROW_TEXT = 'chevron_left'
const disabledClass = 'Mui-disabled'
const mockGetConsents = jest.fn()
let mockGetMetricsWithParams = jest.fn()
let mockSgeConsentFeatureState = true
let mockManualContractFillingIsEnabled = true

let mockFilters: metricFiltersType = [
    {
        key: 'housing_id',
        operator: '=',
        value: '123456789',
    },
]
let mockRange = {
    from: '2022-06-04T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}

let mockMetricsInterval: metricIntervalType = '1m'

let echartsConsumptionChartContainerProps: ConsumptionChartContainerProps = {
    filters: mockFilters,
    enedisSgeConsent: mockEnedisConsent,
    hasMissingHousingContracts: false,
    metricsInterval: mockMetricsInterval,
    period: PeriodEnum.DAILY,
    range: mockRange,
    isIdleShown: false,
    setMetricsInterval: jest.fn(),
    onPeriodChange: jest.fn(),
    onRangeChange: jest.fn(),
}

const mockGetMetricsWithParamsValues: getMetricsWithParamsType = {
    filters: mockFilters,
    interval: mockMetricsInterval,
    range: mockRange,
    targets: [metricTargetsEnum.consumptionByTariffComponent, metricTargetsEnum.consumption],
}

// Mock useHistory hook.
const mockPushHistory = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockPushHistory,
    }),
}))

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

    /**
     * We mock the useAdditionalMetrics hook to return the mock data and the mock functions.
     *
     * @returns The mock data and the mock functions.
     */
    useAdditionalMetrics: () => ({
        data: mockAdditionalData,
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

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisSgeConsent: mockEnedisConsent,
        nrlinkConsent: {
            meterGuid: '133456',
            nrlinkConsentState: mockNrlinkConsent,
        },
        enphaseConsent: {
            meterGuid: '133456',
            enphaseConsentState: mockEnphaseConsent,
        },
        getConsents: mockGetConsents,
    }),
}))

// Mock useHasMissingHousingContracts
jest.mock('src/hooks/HasMissingHousingContracts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHasMissingHousingContracts: () => ({
        hasMissingHousingContracts: true,
    }),
}))

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get sgeConsentFeatureState() {
        return mockSgeConsentFeatureState
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    get manualContractFillingIsEnabled() {
        return mockManualContractFillingIsEnabled
    },

    /**
     * Function to check if plugs are used based on production status.
     *
     * @returns True if plugs are used based on production status.
     */
    arePlugsUsedBasedOnProductionStatus: () => {
        return process.env.REACT_APP_CONNECTED_PLUGS_FEATURE_STATE === 'enabled'
    },
}))

jest.mock('src/modules/MyConsumption/MyConsumptionConfig', () => ({
    ...jest.requireActual('src/modules/MyConsumption/MyConsumptionConfig'),
    /**
     * Mock the productionChartErrorState const.
     *
     * @returns Mocked productionChartErrorState.
     */
    get productionChartErrorState() {
        return mockProductionChartErrorState
    },
}))

let mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.Consumption
jest.mock('src/modules/MyConsumption/store/myConsumptionStore', () => ({
    /**
     * Mock useMyConsumptionStore hook for we can change between tabs.
     *
     * @returns Current tab.
     */
    useMyConsumptionStore: () => ({
        consumptionToggleButton: mockMyConsumptionTab,
        isPartiallyYearlyDataExist: true,
        setPartiallyYearlyDataExist: jest.fn(),
        resetToDefault: jest.fn(),
        setConsumptionToggleButton: jest.fn(),
    }),
}))

// Now, when you import and use echarts-for-react in your Jest tests
// It will use the mocked EChartsReact component instead of the real one.
// This ensures that the rendering logic of the real charts is bypassed,
// and the tests can focus on the behavior of your component without the need to render actual charts.
jest.mock('echarts-for-react')

describe('MyConsumptionContainer test', () => {
    beforeEach(() => {
        setupJestCanvasMock()
    })

    // Unmounts React trees after each test.
    afterEach(cleanup)

    test('onLoad, getMetrics is called two times, one with default targets of autoconsumption and then all targets.', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.DAILY
        echartsConsumptionChartContainerProps.metricsInterval = '1m'

        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        await waitFor(() => {
            expect(mockGetMetricsWithParams).toHaveBeenCalledWith(mockGetMetricsWithParamsValues)
            expect(mockGetMetricsWithParams).toHaveBeenCalledTimes(2)
        })

        expect(() => getByText(CONSUMPTION_ENEDIS_SGE_WARNING_TEXT)).toThrow()
    })
    test.each`
        period       | metricsInterval
        ${'weekly'}  | ${'1d'}
        ${'monthly'} | ${'1d'}
        ${'yearly'}  | ${'1M'}
    `(
        'euros consumption chart for $period period.',
        async ({ period, metricsInterval }) => {
            echartsConsumptionChartContainerProps.period = period
            echartsConsumptionChartContainerProps.metricsInterval = metricsInterval
            const { getByLabelText } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            const eurosConsumptionButtonToggler = getByLabelText('euros-consumption-switcher')
            expect(eurosConsumptionButtonToggler).not.toBeChecked()
            // TOGGLING TO EUROS CONSUMPTION CHART
            userEvent.click(eurosConsumptionButtonToggler)
            // CONSUMPTION ICON should be shown
            expect(eurosConsumptionButtonToggler).toBeChecked()
        },
        20000,
    )
    test('When hasMissingHousingContracts and isEurosConsumption, message is shown', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.WEEKLY
        echartsConsumptionChartContainerProps.metricsInterval = '1d'
        echartsConsumptionChartContainerProps.hasMissingHousingContracts = true
        const { getByText, getByTestId, getByLabelText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        const eurosConsumptionButtonToggler = getByLabelText('euros-consumption-switcher')
        expect(eurosConsumptionButtonToggler).not.toBeChecked()
        // TOGGLING TO EUROS CONSUMPTION CHART
        userEvent.click(eurosConsumptionButtonToggler)
        // CONSUMPTION ICON should be shown
        expect(eurosConsumptionButtonToggler).toBeChecked()
        expect(() => getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID)).toThrow()

        // HasMissingContractsExample Text
        expect(getByText(HAS_MISSING_CONTRACTS_WARNING_TEXT)).toBeInTheDocument()
        // Contracts Redirection URL
        expect(getByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT).parentElement!.closest('a')).toHaveAttribute(
            'href',
            `${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}/contracts`,
        )

        // TOGGLING BACK TO CONSUMPTION, AUTOCONSUMPTION CHART, for coverage of EurosConsumptionButtonToggler.
        userEvent.click(eurosConsumptionButtonToggler)
        // EUROS ICON Should be shown
        expect(eurosConsumptionButtonToggler).not.toBeChecked()
        expect(() => getByText(HAS_MISSING_CONTRACTS_WARNING_TEXT)).toThrow()
    }, 20000)

    test('When the data metrics not exist in yearly period, a warning message is shown', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.YEARLY
        echartsConsumptionChartContainerProps.metricsInterval = mockGetMetricsWithParamsValues.interval
        echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
        mockEnedisConsent = mockEnedisSgeConsentConnected
        mockData = []
        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(getByText(MESSING_DATA_WARNING_TEXT)).toBeInTheDocument()
    })
    test('When the data metrics is partially exist in yearly period, a warning message is shown', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.YEARLY
        echartsConsumptionChartContainerProps.metricsInterval = mockGetMetricsWithParamsValues.interval
        echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
        mockEnedisConsent = mockEnedisSgeConsentConnected
        const yearlyDataMetrics = TEST_SUCCESS_YEAR_METRICS([metricTargetsEnum.consumption])
        // remove some data points for we can test partially existing data.
        mockData = [
            {
                target: yearlyDataMetrics[0].target,
                datapoints: yearlyDataMetrics[0].datapoints.slice(0, 2),
            },
        ]
        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(getByText(MESSING_DATA_WARNING_TEXT)).toBeInTheDocument()
    })

    test('When the all data metrics is exist in yearly period, a warning message must be not shown', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.YEARLY
        echartsConsumptionChartContainerProps.metricsInterval = mockGetMetricsWithParamsValues.interval
        echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
        mockEnedisConsent = mockEnedisSgeConsentConnected
        mockData = TEST_SUCCESS_YEAR_METRICS([metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption])
        // change the data points for we can test all data exist.
        mockData = mockData.map((metric) => {
            return {
                target: metric.target,
                datapoints: metric.datapoints.map((datapoint) => [20, datapoint[1]]),
            }
        })
        const { queryByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(queryByText(MESSING_DATA_WARNING_TEXT)).not.toBeInTheDocument()
    })

    test('When period is daily, EurosConsumption and pMax buttons should not be shown', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.DAILY
        echartsConsumptionChartContainerProps.metricsInterval = '1m' as metricIntervalType
        const { getByText, queryByTestId, getByLabelText, getAllByRole, queryByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(queryByTestId(EUROS_CONSUMPTION_ICON_TEST_ID)).toBeNull()

        let menuButton = getByLabelText(menuButtonLabelText)
        expect(menuButton).toBeInTheDocument()

        menuButton.focus()
        menuButton.click()

        expect(getByText('Ajouter un axe sur le graphique :')).toBeInTheDocument()
        expect(getAllByRole(menuItemRole).length).toBe(3)
        expect(queryByText('Pmax')).not.toBeInTheDocument()
    })

    test('When period is not daily and enedisSgeConsent is not Connected, pMax button should not be shown, enedisSgeConsent warning is shown', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.WEEKLY
        echartsConsumptionChartContainerProps.metricsInterval = mockGetMetricsWithParamsValues.interval
        echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentOff
        mockEnedisConsent = mockEnedisSgeConsentOff

        const { getByText, getAllByRole, getByLabelText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        let menuButton = getByLabelText(menuButtonLabelText)
        expect(menuButton).toBeInTheDocument()

        menuButton.focus()
        menuButton.click()

        expect(getByText('Ajouter un axe sur le graphique :')).toBeInTheDocument()
        expect(getAllByRole(menuItemRole).length).toBe(3)
        expect(queryByText('Pmax')).not.toBeInTheDocument()

        expect(getByText(CONSUMPTION_ENEDIS_SGE_WARNING_TEXT)).toBeInTheDocument()
    })

    test('When consumption is toggled, getMetrics is called without autoconsumption target', async () => {
        reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // First time, getMetrics is called with only two targets
        await waitFor(() => {
            expect(mockGetMetricsWithParams).toHaveBeenCalledWith({
                ...mockGetMetricsWithParamsValues,
                targets: [metricTargetsEnum.consumptionByTariffComponent, metricTargetsEnum.consumption],
            })
        })
    })

    test('When "Autoconso & Production" is toggled, getMetrics is called with autoconsumption target', async () => {
        mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
        reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // First time, getMetrics is called with only two targets
        await waitFor(() => {
            expect(mockGetMetricsWithParams).toHaveBeenCalledWith({
                ...mockGetMetricsWithParamsValues,
                targets: [
                    metricTargetsEnum.autoconsumption,
                    metricTargetsEnum.consumption,
                    metricTargetsEnum.injectedProduction,
                    metricTargetsEnum.totalProduction,
                ],
            })
        })
    })

    test('When manual contract filling is disabled, missing contract link does not show.', () => {
        mockManualContractFillingIsEnabled = false
        const { queryByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(queryByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT)).not.toBeInTheDocument()

        mockManualContractFillingIsEnabled = true
    })

    test('When daily period, no button idle', async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.DAILY
        echartsConsumptionChartContainerProps.metricsInterval = '1m' as metricIntervalType

        const { queryByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(queryByText('Veille')).not.toBeInTheDocument()
    })

    //! This change is temporary, do not delete the commented test.
    // test('When daily period, their is button for labelisation', async () => {
    //     echartsConsumptionChartContainerProps.period = PeriodEnum.DAILY
    //     echartsConsumptionChartContainerProps.metricsInterval = '1m' as metricIntervalType

    // //     const { queryByText } = reduxedRender(
    // //         <Router>
    // //             <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
    // //         </Router>,
    // //         { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
    // //     )

    // //     expect(queryByText('Identifier une conso')).toBeInTheDocument()
    // // })

    test(`should all years of date picker disabled except the last ${NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW} years on the yearly view if enedisSge connected`, async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.YEARLY
        echartsConsumptionChartContainerProps.metricsInterval = '1M' as metricIntervalType
        echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected

        const { getByTestId } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        userEvent.click(getByTestId('date-picker-input'))
        const dialog = screen.getByRole('dialog')
        const dialogWithin = within(dialog)
        // Check if the last NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW are enabled.
        const currentYear = new Date().getFullYear()
        const lastNYears = Array.from(
            { length: NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW },
            (_, index) => currentYear - index - 1,
        )

        for (let year of lastNYears) {
            expect(dialogWithin.getByText(year.toString(), { selector: 'button' })).not.toBeDisabled()
        }

        // Check if the rest years are disabled.
        const LAST_YEAR_IN_DATE_PICKER = 1900
        const restOfYears = Array.from(
            {
                length:
                    lastNYears[NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW - 1] -
                    LAST_YEAR_IN_DATE_PICKER,
            },
            (_, i) => lastNYears[NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW - 1] - 1 - i,
        )

        for (let year of restOfYears) {
            expect(dialogWithin.getByText(year.toString(), { selector: 'button' })).toBeDisabled()
        }
    })

    test(`should previous button of year navigation disabled in last ${NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW} on the yearly view if enedisSge connected`, async () => {
        echartsConsumptionChartContainerProps.period = PeriodEnum.YEARLY
        echartsConsumptionChartContainerProps.metricsInterval = '1M' as metricIntervalType
        echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // check if the previous button is enabled for n last years and it disabled of other.
        for (let index = 0; index < NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW; index++) {
            userEvent.click(getByText(DECREMENT_DATE_ARROW_TEXT))

            const shouldBeDisabled = index === NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW - 1

            await waitFor(
                () => {
                    const isDisabled =
                        getByText(DECREMENT_DATE_ARROW_TEXT)!.parentElement!.classList.contains(disabledClass)
                    // Use the expected condition in a single, unconditional expect call
                    expect(isDisabled).toBe(shouldBeDisabled)
                },
                { timeout: 1500 },
            )
        }
    })

    describe('TemperatureOrPmax TargetMenuGroup Test', () => {
        test('When clicking on reset button, getMetrics should be called without pMax or temperature', async () => {
            echartsConsumptionChartContainerProps.period = PeriodEnum.WEEKLY
            echartsConsumptionChartContainerProps.metricsInterval = '1d' as metricIntervalType

            const { getByLabelText, getAllByRole } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )

            let menuButton = getByLabelText(menuButtonLabelText)
            expect(menuButton).toBeInTheDocument()

            menuButton.focus()
            menuButton.click()

            // Reset Button.
            userEvent.click(getAllByRole(menuItemRole)[1])

            await waitFor(() => {
                expect(mockGetMetricsWithParams).toHaveBeenCalledTimes(2)
            })
        }, 10000)
    })

    describe('Navigate to labelization page button test', () => {
        test('should show the button to navigate to the labelization page on consumption view and daily period', () => {
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.Consumption
            echartsConsumptionChartContainerProps.period = PeriodEnum.DAILY
            const { getByTestId } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            const button = getByTestId('linkToLabelizationPage')
            expect(button).toBeInTheDocument()
            expect(button).toHaveTextContent('Identifier un pic de conso')
        })

        test('should navigate to the labelization page when the button is clicked', async () => {
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.Consumption
            echartsConsumptionChartContainerProps.period = PeriodEnum.DAILY
            mockPushHistory.mockClear()
            const { getByTestId } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            const button = getByTestId('linkToLabelizationPage')
            userEvent.click(button)
            await waitFor(() => {
                expect(mockPushHistory).toHaveBeenCalled()
            })
        })
    })

    describe('Navigate to solar installation form button test', () => {
        test('should show the button to navigate to the solar installation form on production view', () => {
            echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
            mockEnedisConsent = mockEnedisSgeConsentConnected
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
            const { getByTestId } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            const button = getByTestId('linkToSolarInstallationForm')
            expect(button).toBeInTheDocument()
            expect(button).toHaveTextContent('⚙️ Mon installation solaire')
        })

        test('should navigate to the solar installation form when the button is clicked', async () => {
            echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
            mockEnedisConsent = mockEnedisSgeConsentConnected
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
            const { getByTestId } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            const button = getByTestId('linkToSolarInstallationForm')
            userEvent.click(button)
            await waitFor(() => {
                expect(mockPushHistory).toHaveBeenCalledWith('/my-houses/1/information', {
                    focusOnInstallationForm: true,
                })
            })
        })
    })

    describe('Solar installation recommendation button test', () => {
        test('should SolarInstallationRecommendation Button must be shown on production view', () => {
            echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
            mockEnedisConsent = mockEnedisSgeConsentConnected
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
            const { getByTestId } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            const button = getByTestId('solarInstallationRecommendationButton')
            expect(button).toBeInTheDocument()
            expect(button).toHaveTextContent('💖 Recommander mon installateur')
        })

        test('should open new tab when button is clicked', async () => {
            echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
            mockEnedisConsent = mockEnedisSgeConsentConnected
            mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
            const originalOpen = window.open
            window.open = jest.fn()
            const { getByTestId } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            const button = getByTestId('solarInstallationRecommendationButton')
            userEvent.click(button)
            await waitFor(() => {
                expect(window.open).toHaveBeenCalledWith(
                    URL_SOLAR_INSTALLATION_RECOMMENDATION,
                    '_blank',
                    'noopener noreferrer',
                )
                window.open = originalOpen
            })
        })
    })
})
