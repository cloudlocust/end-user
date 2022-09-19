import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionContainer } from 'src/modules/MyConsumption/MyConsumptionContainer'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { waitFor } from '@testing-library/react'
import { formatMetricFilter } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import userEvent from '@testing-library/user-event'
import { URL_CONTRACTS } from 'src/modules/Contracts/ContractsConfig'
import { store } from 'src/redux'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

// mock store.

let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS(['consumption_metrics'])
let mockNrlinkConsent: string
let mockIsMetricsLoading = false
let mockEnedisConsent: string
const mockSetFilters = jest.fn()
const circularProgressClassname = '.MuiCircularProgress-root'
const EUROS_CONSUMPTION_EXAMPLE_CHART_WARNING_TEXT = "Ce graphe est un exemple. Renseigner votre contrat d'énergie"
const WEEKLY_PERIOD_BUTTON_TEXT = 'Semaine'
const MONTHLY_PERIOD_BUTTON_TEXT = 'Mois'
const YEARLY_PERIOD_BUTTON_TEXT = 'Année'
const CONSUMPTION_TITLE_DAILY = 'en Wh par jour'
const CONSUMPTION_TITLE_WEEKLY = 'en kWh par semaine'
const CONSUMPTION_TITLE_MONTHLY = 'en kWh par mois'
const CONSUMPTION_TITLE_YEARLY = 'en kWh par année'
const EUROS_CONSUMPTION_TITLE_DAILY = 'en € par jour'
const EUROS_CONSUMPTION_TITLE_WEEKLY = 'en € par semaine'
const EUROS_CONSUMPTION_TITLE_MONTHLY = 'en € par mois'
const EUROS_CONSUMPTION_TITLE_YEARLY = 'en € par année'
const CONSUMPTION_ICON_TEST_ID = 'BoltIcon'
const EUROS_CONSUMPTION_ICON_TEST_ID = 'EuroIcon'
const apexchartsClassName = 'apexcharts-svg'
const mockGetConsents = jest.fn()

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        filters: [
            {
                key: 'meter_guid',
                operator: '=',
                value: '123456789',
            },
        ],
        range: {
            from: '2022-06-04T00:00:00.000Z',
            to: '2022-06-04T23:59:59.999Z',
        },
        isMetricsLoading: mockIsMetricsLoading,
        setRange: jest.fn(),
        setMetricsInterval: jest.fn(),
        interval: '2min',
        setFilters: mockSetFilters,
    }),
}))

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisConsent: {
            meterGuid: '133456',
            enedisConsentState: mockNrlinkConsent,
        },
        nrlinkConsent: {
            meterGuid: '133456',
            nrlinkConsentState: mockEnedisConsent,
        },
        getConsents: mockGetConsents,
    }),
}))

// MyConsumptionContainer cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className={`${apexchartsClassName}`} {...props}></div>,
)

describe('MyConsumptionContainer test', () => {
    test('when there is no nrlinkConsent and no enedisConsent, a message is shown', async () => {
        mockData = []
        mockNrlinkConsent = 'NONEXISTENT'
        mockEnedisConsent = 'NONEXISTENT'
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
        await waitFor(() => {
            expect(mockGetConsents).toHaveBeenCalled()
        })
        expect(getByText("Pour voir votre consommation vous devez d'abord")).toBeTruthy()
        expect(getByText('enregistrer votre compteur et votre nrLink')).toBeTruthy()
    })
    test("when data from useMetrics is empty, widget section isn't shown", async () => {
        mockNrlinkConsent = 'CONNECTED'
        mockEnedisConsent = 'CONNECTED'
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
        expect(() => getByText('Chiffres clés')).toThrow()
    })
    test('Clicking on different period changes the Consumption Title', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
        // Daily CONSUMPTION Text
        expect(getByText(CONSUMPTION_TITLE_DAILY)).toBeTruthy()

        // Weekly CONSUMPTION Text
        userEvent.click(getByText(WEEKLY_PERIOD_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(CONSUMPTION_TITLE_WEEKLY)).toBeTruthy()
        })

        // Monthly CONSUMPTION Text
        userEvent.click(getByText(MONTHLY_PERIOD_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(CONSUMPTION_TITLE_MONTHLY)).toBeTruthy()
        })

        // Yearly CONSUMPTION Text
        userEvent.click(getByText(YEARLY_PERIOD_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(CONSUMPTION_TITLE_YEARLY)).toBeTruthy()
        })
    })
    test('Toggling to EurosConsumption on different period changes the ConsumptionEuros Title', async () => {
        const { getByText, getByTestId } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
        // TOGGLING TO EUROS CONSUMPTION CHART
        userEvent.click(getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID).parentElement as HTMLButtonElement)
        // CONSUMPTION ICON should be shown
        await waitFor(() => {
            expect(getByTestId(CONSUMPTION_ICON_TEST_ID)).toBeTruthy()
        })
        // Daily EUROS CONSUMPTION Text
        expect(getByText(EUROS_CONSUMPTION_TITLE_DAILY)).toBeTruthy()

        // Weekly EUROS CONSUMPTION Text
        userEvent.click(getByText(WEEKLY_PERIOD_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(EUROS_CONSUMPTION_TITLE_WEEKLY)).toBeTruthy()
        })

        // Monthly EUROS CONSUMPTION Text
        userEvent.click(getByText(MONTHLY_PERIOD_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(EUROS_CONSUMPTION_TITLE_MONTHLY)).toBeTruthy()
        })

        // Yearly EUROS CONSUMPTION Text
        userEvent.click(getByText(YEARLY_PERIOD_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(EUROS_CONSUMPTION_TITLE_YEARLY)).toBeTruthy()
        })
        // Example Chart Information Text
        expect(getByText(EUROS_CONSUMPTION_EXAMPLE_CHART_WARNING_TEXT)).toBeTruthy()
        // Contracts Redirection URL
        expect(getByText(EUROS_CONSUMPTION_EXAMPLE_CHART_WARNING_TEXT).parentElement!.closest('a')).toHaveAttribute(
            'href',
            URL_CONTRACTS,
        )

        // TOGGLING TO CONSUMPTION CHART
        userEvent.click(getByTestId(CONSUMPTION_ICON_TEST_ID).parentElement as HTMLButtonElement)
        // EUROS CONSUMPTION ICON should be shown
        await waitFor(() => {
            expect(getByTestId(EUROS_CONSUMPTION_ICON_TEST_ID)).toBeTruthy()
        })
    })
    test('housesList not empty, then filters metrics should have currentHousing of houseList, otherwise setFilters is not called', async () => {
        // we initiate the store by adding the housing list - by default current state will be the first element
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)

        reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { store },
        )
        await waitFor(() => {
            expect(mockSetFilters).toHaveBeenCalledWith(formatMetricFilter(LIST_OF_HOUSES[0].meter.guid))
        })

        await store.dispatch.housingModel.setHousingModelState([])
        await waitFor(() => {
            expect(mockSetFilters).toHaveBeenCalledTimes(1)
        })
    })
    test('housing list is filled and isMetricsLoading true, Spinner is shown', async () => {
        // initiate the store by adding housing list - by default current state will be the first element
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
        mockIsMetricsLoading = true
        mockData = []
        const { container } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { store },
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
        expect(container.querySelector(`.${apexchartsClassName}`)).not.toBeInTheDocument()
    })
})
