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
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { IEnedisSgeConsent, INrlinkConsent, IEnphaseConsent } from 'src/modules/Consents/Consents'
import { ConsumptionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { setupJestCanvasMock } from 'jest-canvas-mock'
import { SwitchConsumptionButtonLabelEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { screen, within } from '@testing-library/react'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

// mock store.

let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS([metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption])

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

let mockIsMetricsLoading = false
const mockSetFilters = jest.fn()
const HAS_MISSING_CONTRACTS_WARNING_TEXT =
    "Ce graphe est un exemple basé sur un tarif Bleu EDF Base. Vos données contractuelles de fourniture d'énergie ne sont pas disponibles sur toute la période."
const HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT = "Renseigner votre contrat d'énergie"
const CONSUMPTION_ENEDIS_SGE_WARNING_TEXT = 'Accéder à votre historique de consommation'
const MESSING_DATA_WARNING_TEXT =
    'Il se peut que vos données soient incomplètes si vous tentez d’afficher une période sans contrat déclaré ou sans Linky ou encore si la période est antérieur à 3 ans.'
const CONSUMPTION_TITLE_DAILY = 'Ma puissance'
const CONSUMPTION_TITLE_NOT_DAILY = 'Ma consommation'
const CONSUMPTION_PERIOD_TITLE_DAILY = 'en Watt par jour'
const CONSUMPTION_PERIOD_TITLE_WEEKLY = 'en kWh par semaine'
const CONSUMPTION_PERIOD_TITLE_MONTHLY = 'en kWh par mois'
const CONSUMPTION_PERIOD_TITLE_YEARLY = 'en kWh par année'
const EUROS_CONSUMPTION_PERIOD_TITLE_WEEKLY = 'en € par semaine'
const EUROS_CONSUMPTION_PERIOD_TITLE_MONTHLY = 'en € par mois'
const EUROS_CONSUMPTION_PERIOD_TITLE_YEARLY = 'en € par année'
const EUROS_CONSUMPTION_ICON_TEST_ID = 'euros-consumption-button'
const menuButtonLabelText = 'target-menu'
const menuItemRole = 'menuitem'
const DECREMENT_DATE_ARROW_TEXT = 'chevron_left'
const disabledClass = 'Mui-disabled'
const mockGetConsents = jest.fn()
const mockGetMetricsWithParams = jest.fn()
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

let mockPeriod: periodType = 'daily'
let mockMetricsInterval: metricIntervalType = '1m'

let echartsConsumptionChartContainerProps: ConsumptionChartContainerProps = {
    filters: mockFilters,
    enedisSgeConsent: mockEnedisConsent,
    isSolarProductionConsentOff: false,
    hasMissingHousingContracts: false,
    metricsInterval: mockMetricsInterval,
    period: mockPeriod,
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

    test.each`
        period       | metricsInterval | ConsumptionChartTitle          | ConsumptionChartPeriodTitle
        ${'daily'}   | ${'1m'}         | ${CONSUMPTION_TITLE_DAILY}     | ${CONSUMPTION_PERIOD_TITLE_DAILY}
        ${'weekly'}  | ${'1d'}         | ${CONSUMPTION_TITLE_NOT_DAILY} | ${CONSUMPTION_PERIOD_TITLE_WEEKLY}
        ${'monthly'} | ${'1d'}         | ${CONSUMPTION_TITLE_NOT_DAILY} | ${CONSUMPTION_PERIOD_TITLE_MONTHLY}
        ${'yearly'}  | ${'1M'}         | ${CONSUMPTION_TITLE_NOT_DAILY} | ${CONSUMPTION_PERIOD_TITLE_YEARLY}
    `(
        'consumption chart for $period period.',
        async ({ period, metricsInterval, ConsumptionChartTitle, ConsumptionChartPeriodTitle }) => {
            echartsConsumptionChartContainerProps.period = period
            echartsConsumptionChartContainerProps.metricsInterval = metricsInterval

            const { getByText } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )

            expect(getByText(new RegExp(ConsumptionChartTitle))).toBeInTheDocument()
            expect(getByText(new RegExp(ConsumptionChartPeriodTitle))).toBeInTheDocument()
        },
    )
    test('onLoad getMetrics with isSolarProductionConsentOff false is called two times, one with default targets of autoconsumption and then all targets.', async () => {
        mockPeriod = 'daily'
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
        period       | metricsInterval | ConsumptionChartPeriodTitle
        ${'weekly'}  | ${'1d'}         | ${EUROS_CONSUMPTION_PERIOD_TITLE_WEEKLY}
        ${'monthly'} | ${'1d'}         | ${EUROS_CONSUMPTION_PERIOD_TITLE_MONTHLY}
        ${'yearly'}  | ${'1M'}         | ${EUROS_CONSUMPTION_PERIOD_TITLE_YEARLY}
    `(
        'euros consumption chart for $period period.',
        async ({ period, metricsInterval, ConsumptionChartPeriodTitle }) => {
            echartsConsumptionChartContainerProps.period = period
            echartsConsumptionChartContainerProps.metricsInterval = metricsInterval
            const { getByText, getByLabelText } = reduxedRender(
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
            expect(getByText(new RegExp(CONSUMPTION_TITLE_NOT_DAILY))).toBeInTheDocument()
            expect(getByText(new RegExp(ConsumptionChartPeriodTitle))).toBeInTheDocument()
        },
        20000,
    )
    test('When hasMissingHousingContracts and isEurosConsumption, message is shown', async () => {
        echartsConsumptionChartContainerProps.period = 'weekly'
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
        echartsConsumptionChartContainerProps.period = 'yearly'
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
        echartsConsumptionChartContainerProps.period = 'yearly'
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
        echartsConsumptionChartContainerProps.period = 'yearly'
        echartsConsumptionChartContainerProps.metricsInterval = mockGetMetricsWithParamsValues.interval
        echartsConsumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentConnected
        mockEnedisConsent = mockEnedisSgeConsentConnected
        mockData = TEST_SUCCESS_YEAR_METRICS([metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption])
        const { queryByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(queryByText(MESSING_DATA_WARNING_TEXT)).not.toBeInTheDocument()
    })

    test('When period is daily, EurosConsumption and pMax buttons should not be shown', async () => {
        echartsConsumptionChartContainerProps.period = 'daily'
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
        echartsConsumptionChartContainerProps.period = 'weekly'
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

    test('When isSolarProductionConsentOff is true, autoconsumption target is not shown, getMetrics is called without autoconsumption target', async () => {
        echartsConsumptionChartContainerProps.isSolarProductionConsentOff = true
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
        echartsConsumptionChartContainerProps.isSolarProductionConsentOff = false
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
        echartsConsumptionChartContainerProps.period = 'daily'
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
    //     echartsConsumptionChartContainerProps.period = 'daily'
    //     echartsConsumptionChartContainerProps.metricsInterval = '1m' as metricIntervalType

    //     const { queryByText } = reduxedRender(
    //         <Router>
    //             <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
    //         </Router>,
    //         { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
    //     )

    //     expect(queryByText('Identifier une conso')).toBeInTheDocument()
    // })

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
            echartsConsumptionChartContainerProps.period = 'weekly'
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
                expect(mockGetMetricsWithParams).toHaveBeenCalledTimes(3)
            })
        }, 10000)
    })

    describe('SwitchConsumption Test', () => {
        // Unmounts React trees after each test.
        afterEach(cleanup)

        test.each`
            caseName                   | period       | metricsInterval | isSolarProductionConsentOff | isIdleShown
            ${'Daily with Solar'}      | ${'daily'}   | ${'1m'}         | ${false}                    | ${false}
            ${'Weekly without Solar'}  | ${'weekly'}  | ${'1d'}         | ${true}                     | ${true}
            ${'Monthly without Solar'} | ${'monthly'} | ${'1d'}         | ${true}                     | ${true}
            ${'Yearly without Solar'}  | ${'yearly'}  | ${'1M'}         | ${true}                     | ${true}
        `(
            'cases when SwitchConsumption button is shown: case: $caseName',
            async ({ period, metricsInterval, isSolarProductionConsentOff, isIdleShown }) => {
                echartsConsumptionChartContainerProps.period = period
                echartsConsumptionChartContainerProps.metricsInterval = metricsInterval
                echartsConsumptionChartContainerProps.isSolarProductionConsentOff = isSolarProductionConsentOff
                echartsConsumptionChartContainerProps.isIdleShown = isIdleShown

                const { getByText } = reduxedRender(
                    <Router>
                        <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                    </Router>,
                    { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
                )

                // test with General Properties, because it is always shown.
                expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
            },
        )

        test('cases when SwitchConsumption button is not shown: case: Daily without Solar', async () => {
            echartsConsumptionChartContainerProps.period = 'daily'
            echartsConsumptionChartContainerProps.metricsInterval = '1m'
            echartsConsumptionChartContainerProps.isSolarProductionConsentOff = true
            echartsConsumptionChartContainerProps.isIdleShown = false

            const { getByText } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...echartsConsumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )

            // test with General Properties, because it is always shown.
            expect(() => getByText(SwitchConsumptionButtonLabelEnum.General)).toThrow()
        })
    })
})
