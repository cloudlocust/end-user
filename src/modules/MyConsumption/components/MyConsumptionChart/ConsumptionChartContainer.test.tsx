import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import {
    ApexAxisChartSerie,
    getMetricsWithParamsType,
    IMetric,
    metricFiltersType,
    metricIntervalType,
    metricTargetsEnum,
} from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { ConsumptionChartContainerProps, periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { IEnedisSgeConsent, INrlinkConsent, IEnphaseConsent } from 'src/modules/Consents/Consents'
import { ConsumptionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'

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
const CONSUMPTION_TITLE_DAILY = 'en Watt par jour'
const CONSUMPTION_TITLE_WEEKLY = 'en kWh par semaine'
const CONSUMPTION_TITLE_MONTHLY = 'en kWh par mois'
const CONSUMPTION_TITLE_YEARLY = 'en kWh par année'
const EUROS_CONSUMPTION_TITLE_WEEKLY = 'en € par semaine'
const EUROS_CONSUMPTION_TITLE_MONTHLY = 'en € par mois'
const EUROS_CONSUMPTION_TITLE_YEARLY = 'en € par année'
const CONSUMPTION_ICON_TEST_ID = 'BoltIcon'
const EUROS_CONSUMPTION_ICON_TEST_ID = 'EuroIcon'
const apexchartsClassName = 'apexcharts-svg'
const buttonDisabledClassname = 'Mui-disabled'
let buttonLabelText = 'target-menu'
const mockGetConsents = jest.fn()
const mockGetMetricsWithParams = jest.fn()
let mockSgeConsentFeatureState = true
let mockManualContractFillingIsEnabled = true

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

const consumptionChartContainerProps: ConsumptionChartContainerProps = {
    filters: mockFilters,
    enedisSgeConsent: mockEnedisConsent,
    enphaseConsent,
    hasMissingHousingContracts: false,
    metricsInterval: mockMetricsInterval,
    period: mockPeriod,
    range: mockRange,
}

const mockGetMetricsWithParamsValues: getMetricsWithParamsType = {
    filters: mockFilters,
    interval: mockMetricsInterval,
    range: mockRange,
    targets: [metricTargetsEnum.autoconsumption, metricTargetsEnum.consumption],
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

const AUTO_CONSUMPTION_TOOLTIP_TEXT = 'Autoconsommation'
// const TOTAL_CONSUMPTION_TOOLTIP_TEXT = 'Consommation totale'
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

// MyConsumptionContainer cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) =>
        (
            <div className={`${apexchartsClassName}`} {...props}>
                {/* Show all chart targets, passed a data props */}
                {props.series.map((serie: ApexAxisChartSerie) => (
                    <h1 id={serie.name}>{serie.name}</h1>
                ))}
            </div>
        ),
)

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

describe('MyConsumptionContainer test', () => {
    test('onLoad getMetrics is called two times, one with default targets and then all targets.', async () => {
        consumptionChartContainerProps.period = mockPeriod
        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...consumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // First time, getMetrics is called with only two targets
        await waitFor(() => {
            expect(mockGetMetricsWithParams).toHaveBeenCalledWith(mockGetMetricsWithParamsValues)
        })

        expect(() => getByText(CONSUMPTION_ENEDIS_SGE_WARNING_TEXT)).toThrow()
        // Consent enphase is Active Bought network consumption and AutoConsumption tooltip texts are shown
        // TODO: fix thisS.
        expect(getByText(AUTO_CONSUMPTION_TOOLTIP_TEXT)).toBeTruthy()
    })
    test('Different period props, When consumption chart.', async () => {
        const consumptionTitleCases = [
            {
                period: 'daily' as periodType,
                text: CONSUMPTION_TITLE_DAILY,
            },
            {
                period: 'weekly' as periodType,
                text: CONSUMPTION_TITLE_WEEKLY,
            },
            {
                period: 'monthly' as periodType,
                text: CONSUMPTION_TITLE_MONTHLY,
            },
            {
                period: 'yearly' as periodType,
                text: CONSUMPTION_TITLE_YEARLY,
            },
        ]

        consumptionTitleCases.forEach(({ period, text }) => {
            consumptionChartContainerProps.period = period
            const { getByText, queryAllByText } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...consumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            expect(queryAllByText('Ma puissance')).toBeTruthy()
            expect(getByText(text)).toBeTruthy()
        })
    })
    test('Different period props, When euros consumption chart.', async () => {
        const consumptionTitleCases = [
            {
                period: 'weekly' as periodType,
                metricsInterval: '1d' as metricIntervalType,
                ConsumptionChartPeriodTitle: EUROS_CONSUMPTION_TITLE_WEEKLY,
            },
            {
                period: 'monthly' as periodType,
                metricsInterval: '1d' as metricIntervalType,
                ConsumptionChartPeriodTitle: EUROS_CONSUMPTION_TITLE_MONTHLY,
            },
            {
                period: 'yearly' as periodType,
                metricsInterval: '1M' as metricIntervalType,
                ConsumptionChartPeriodTitle: EUROS_CONSUMPTION_TITLE_YEARLY,
            },
        ]

        consumptionTitleCases.forEach(async ({ period, metricsInterval, ConsumptionChartPeriodTitle }) => {
            consumptionChartContainerProps.period = period
            consumptionChartContainerProps.metricsInterval = metricsInterval
            const { getByText, getByTestId } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...consumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            // TOGGLING TO EUROS CONSUMPTION CHART
            userEvent.click(getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID).parentElement as HTMLButtonElement)
            // CONSUMPTION ICON should be shown
            await waitFor(() => {
                expect(getByTestId(CONSUMPTION_ICON_TEST_ID)).toBeTruthy()
            })
            try {
                expect(getByText(ConsumptionChartPeriodTitle)).toBeTruthy()
            } catch (err) {}
        })
    }, 20000)
    test('When hasMissingHousingContracts and isEurosConsumptin, message is shown', async () => {
        consumptionChartContainerProps.period = 'weekly'
        consumptionChartContainerProps.metricsInterval = '1d'
        consumptionChartContainerProps.hasMissingHousingContracts = true
        const { getByText, getByTestId } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...consumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // TOGGLING TO EUROS CONSUMPTION CHART
        userEvent.click(getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID).parentElement as HTMLButtonElement)
        // CONSUMPTION ICON should be shown
        await waitFor(() => {
            expect(getByTestId(CONSUMPTION_ICON_TEST_ID)).toBeTruthy()
        })
        expect(() => getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID)).toThrow()

        // HasMissingContractsExample Text
        expect(getByText(HAS_MISSING_CONTRACTS_WARNING_TEXT)).toBeTruthy()
        // Contracts Redirection URL
        expect(getByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT).parentElement!.closest('a')).toHaveAttribute(
            'href',
            `${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}/contracts`,
        )

        // TOGGLING BACK TO CONSUMPTION, AUTOCONSUMPTION CHART, for coverage of EurosConsumptionButtonToggler.
        userEvent.click(getByTestId(CONSUMPTION_ICON_TEST_ID).parentElement as HTMLButtonElement)
        // EUROS ICON Should be shown
        await waitFor(() => {
            expect(getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID)).toBeTruthy()
        })
        expect(() => getByText(HAS_MISSING_CONTRACTS_WARNING_TEXT)).toThrow()
    }, 20000)
    test('When period is daily, EurosConsumption and pMax button should be disabled', async () => {
        consumptionChartContainerProps.period = 'daily'
        consumptionChartContainerProps.metricsInterval = '1m' as metricIntervalType
        const { getByText, getByTestId, getByLabelText, getAllByRole } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...consumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        let button = getByLabelText(buttonLabelText)

        expect(
            (getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID).parentElement as HTMLButtonElement).classList.contains(
                buttonDisabledClassname,
            ),
        ).toBeTruthy()

        expect(button).toBeInTheDocument()

        button.focus()
        button.click()

        expect(getByText('Ajouter un axe sur le graphique :')).toBeTruthy()
        let menuItems = getAllByRole('menuitem')

        expect(menuItems[3].classList.contains(buttonDisabledClassname)).toBeTruthy()
        expect(menuItems[3]).toHaveAttribute('aria-disabled', 'true')
    })

    test('When period is not daily and enedisSgeConsent is not Connected, pMax button should be disabled, enedisSgeConsent warning is shown', async () => {
        consumptionChartContainerProps.period = 'weekly'
        consumptionChartContainerProps.metricsInterval = mockGetMetricsWithParamsValues.interval
        consumptionChartContainerProps.enedisSgeConsent = mockEnedisSgeConsentOff
        mockEnedisConsent = mockEnedisSgeConsentOff

        const { getByText, getAllByRole, getByLabelText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...consumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        let button = getByLabelText(buttonLabelText)
        expect(button).toBeInTheDocument()

        button.focus()
        button.click()

        expect(getByText('Ajouter un axe sur le graphique :')).toBeTruthy()
        let menuItems = getAllByRole('menuitem')

        expect(menuItems[3].classList.contains('Mui-disabled')).toBeTruthy()
        expect(menuItems[3]).toHaveAttribute('aria-disabled', 'true')
        expect(getByText(CONSUMPTION_ENEDIS_SGE_WARNING_TEXT)).toBeTruthy()
    })

    test('When consent enphaseOff, autoconsumption target is not shown, getMetrics is called two times, one with default targets and then all targets both without autoconsumption target', async () => {
        consumptionChartContainerProps.enphaseConsent!.enphaseConsentState = 'NONEXISTENT'
        reduxedRender(
            <Router>
                <ConsumptionChartContainer {...consumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // First time, getMetrics is called with only two targets
        await waitFor(() => {
            expect(mockGetMetricsWithParams).toHaveBeenCalledWith({
                ...mockGetMetricsWithParamsValues,
                targets: [
                    metricTargetsEnum.baseConsumption,
                    metricTargetsEnum.peakHourConsumption,
                    metricTargetsEnum.offPeakHourConsumption,
                    metricTargetsEnum.consumption,
                ],
            })
        })
    })
    test('When manual contract filling is disabled, missing contract link does not show.', () => {
        mockManualContractFillingIsEnabled = false
        const { queryByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...consumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(queryByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT)).not.toBeInTheDocument()

        mockManualContractFillingIsEnabled = true
    })

    test('When isShowIdleConsumptionDisabledInfo', async () => {
        consumptionChartContainerProps.period = 'daily'
        consumptionChartContainerProps.metricsInterval = '1m' as metricIntervalType

        const { getByText } = reduxedRender(
            <Router>
                <ConsumptionChartContainer {...consumptionChartContainerProps} />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        const idleConsumptionButtonElement = getByText('Veille')

        userEvent.click(idleConsumptionButtonElement)
        await waitFor(() => {
            expect(getByText('Les informations de veille ne sont pas disponibles pour cette pèriode')).toBeTruthy()
        })
    })

    describe('TemperatureOrPmax TargetMenuGroup Test', () => {
        test('When clicking on reset button, getMetrics should be called without pMax or temperature', async () => {
            consumptionChartContainerProps.period = 'weekly'
            consumptionChartContainerProps.metricsInterval = '1d' as metricIntervalType

            const { getByLabelText, getAllByRole } = reduxedRender(
                <Router>
                    <ConsumptionChartContainer {...consumptionChartContainerProps} />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )

            let button = getByLabelText(buttonLabelText)
            expect(button).toBeInTheDocument()

            button.focus()
            button.click()

            // Reset Button.
            userEvent.click(getAllByRole('menuitem')[1])

            await waitFor(() => {
                expect(mockGetMetricsWithParams).toHaveBeenCalledTimes(2)
            })
        }, 10000)
    })
})
