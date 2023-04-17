import { reduxedRender } from 'src/common/react-platform-components/test'
import Analysis from 'src/modules/Analysis'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_MONTH_METRICS } from 'src/mocks/handlers/metrics'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { createTheme } from '@mui/material/styles'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { IEnedisSgeConsent } from 'src/modules/Consents/Consents'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
let mockData: IMetric[] = TEST_SUCCESS_MONTH_METRICS([
    metricTargetsEnum.consumption,
    metricTargetsEnum.eurosConsumption,
])
let mockNrlinkConsent: string
let mockSetRange = jest.fn()
let mockIsMetricsLoading = false
const HAS_MISSING_CONTRACTS_WARNING_TEXT =
    "Le coût en euros est un exemple. Vos données contractuelles de fourniture d'énergie ne sont pas disponibles sur toute la période."
const HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT = "Renseigner votre contrat d'énergie"
const MIN_CONSUMPTION_DAY_HIGHLIGHT = 'minConsumptionDay'
const MIN_CONSUMPTION_DAY_CHART = 'minConsumptionDayChart'
const MAX_CONSUMPTION_DAY_HIGHLIGHT = 'maxConsumptionDay'
const MAX_CONSUMPTION_DAY_CHART = 'maxConsumptionDayChart'
const MEAN_CONSUMPTION_DAY_HIGHLIGHT = 'meanConsumption'
const MEAN_CONSUMPTION_DAY_CHART = 'meanConsumptionDayChart'
const circularProgressClassname = '.MuiCircularProgress-root'
const analysisInformationListClassname = '.analysis-information-list'
const analysisChartClassname = '.apexcharts-svg'
const CONSENT_TEXT = "Pour voir votre consommation vous devez d'abord"
const mockRange = {
    from: '2022-05-01T00:00:00.000Z',
    to: '2022-05-31T23:59:59.999Z',
}
const REDIRECT_TEXT = 'enregistrer votre compteur et votre nrLINK'
const INCREMENT_DATE_ARROW_TEXT = 'chevron_right'
const mockTheme = createTheme()
const ANALYSIS_ENEDIS_SGE_WARNING_TEXT = 'Accéder à votre historique de consommation'

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
let mockEnedisConsent: IEnedisSgeConsent | undefined = mockEnedisSgeConsentConnected

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        isMetricsLoading: mockIsMetricsLoading,
        filters: [
            {
                key: 'meter_guid',
                operator: '=',
                value: '123456789',
            },
        ],
        range: mockRange,
        interval: '1d',
        setFilters: jest.fn(),
        setRange: mockSetRange,
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
        getConsents: jest.fn(),
    }),
}))

// Mocking AnalysisChart Component to test props passed to AnalysisChart (interaction of analysisInformationComponent when selecting element min, max or other in analysisChart)
jest.mock(
    'src/modules/Analysis/components/AnalysisChart',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => {
        return (
            <div>
                <div className="apexcharts-svg" {...props}>
                    <button onClick={() => props.getSelectedValueElementColor(mockTheme.palette.primary.light)}>
                        minConsumptionDayChart
                    </button>
                    <button onClick={() => props.getSelectedValueElementColor(mockTheme.palette.primary.dark)}>
                        maxConsumptionDayChart
                    </button>
                    <button onClick={() => props.getSelectedValueElementColor(mockTheme.palette.primary.main)}>
                        meanConsumptionDayChart
                    </button>
                    {props.children}
                </div>
            </div>
        )
    },
)

// Mock useHasMissingHousingContracts
jest.mock('src/hooks/HasMissingHousingContracts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHasMissingHousingContracts: () => ({
        hasMissingHousingContracts: true,
    }),
}))

// Mocking AnalysisChart Component to test props passed to AnalysisInformationList (The analysisInformation that is highlighted, to make it simple we just show the name of selection).
jest.mock(
    'src/modules/Analysis/components/AnalysisInformationList',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => {
        return <div>{props.activeInformationName}</div>
    },
)

describe('Analysis test', () => {
    test('When DatePicker change setRange should be called', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // HasMissingContractsExample Text
        expect(getByText(HAS_MISSING_CONTRACTS_WARNING_TEXT)).toBeTruthy()
        // Contracts Redirection URL
        expect(getByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT).parentElement!.closest('a')).toHaveAttribute(
            'href',
            `${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}/contracts`,
        )

        // INCREMENT DATE BUTTON
        userEvent.click(getByText(INCREMENT_DATE_ARROW_TEXT))
        await waitFor(() => {
            // When we increment a period, we increment "to" in range.
            expect(mockSetRange).toHaveBeenCalledWith({
                from: '2022-06-01T00:00:00.000Z',
                to: '2022-06-30T23:59:59.999Z',
            })
        })
    })
    test('when there is no nrlinkConsent and no enedisConsent, awarening text is shown', async () => {
        mockNrlinkConsent = 'NONEXISTENT'
        mockEnedisConsent = mockEnedisSgeConsentOff
        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        expect(getByText(CONSENT_TEXT)).toBeTruthy()
        expect(getByText(REDIRECT_TEXT)).toBeTruthy()
    })
    test('when data is not empty total consumption should be shown', async () => {
        mockNrlinkConsent = 'CONNECTED'
        mockEnedisConsent = mockEnedisSgeConsentConnected
        const totalDataPoints = 1000
        const TOTAL_CONSUMPTION_TEXT = `1 kWh`
        const TOTAL_EUROS_CONSUMPTION_TEXT = `1000.00 €`
        // Overriding datapoints of useMetrics for consumption target (index: 0), eurosConsumption target (index: 1).
        mockData[0].datapoints = [[totalDataPoints, 1643628944000]]
        mockData[1].datapoints = [[totalDataPoints, 1643628944000]]
        const { getByText, container } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        expect(getByText(TOTAL_CONSUMPTION_TEXT)).toBeTruthy()
        expect(getByText(TOTAL_EUROS_CONSUMPTION_TEXT)).toBeTruthy()
        expect(container.querySelector(analysisInformationListClassname)).toBeInTheDocument()
    })

    test('When selecting element in analysisChart (minConsumptionDay, maxConsumptionDay, meanConsumptionDay), it should be highlighted in analysisInformationList', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // Selecting MinConsumptionDay in analysisChart.
        userEvent.click(getByText(MIN_CONSUMPTION_DAY_CHART))
        // MinConsumptionDay Should be highlighted in AnalysisInformationList.
        await waitFor(() => {
            expect(getByText(MIN_CONSUMPTION_DAY_HIGHLIGHT)).toBeTruthy()
        })

        // Selecting MaxConsumptionDay in analysisChart.
        userEvent.click(getByText(MAX_CONSUMPTION_DAY_CHART))
        // MaxConsumptionDay Should be highlighted in AnalysisInformationList.
        await waitFor(() => {
            expect(getByText(MAX_CONSUMPTION_DAY_HIGHLIGHT)).toBeTruthy()
        })

        // Selecting MeanConsumptionDay in analysisChart.
        userEvent.click(getByText(MEAN_CONSUMPTION_DAY_CHART))
        // MeanConsumptionDay Should be highlighted in AnalysisInformationList.
        await waitFor(() => {
            expect(getByText(MEAN_CONSUMPTION_DAY_HIGHLIGHT)).toBeTruthy()
        })
    }, 50000)

    test('When enedisSgeConsent is not Connected, enedisSgeConsent warning is shown', async () => {
        mockEnedisConsent = mockEnedisSgeConsentOff

        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(getByText(ANALYSIS_ENEDIS_SGE_WARNING_TEXT)).toBeTruthy()
    })

    test('when isMetricsLoading, Spinner is shown, AnalysisChart and AnalysisInformationList are hidden', async () => {
        mockIsMetricsLoading = true
        mockNrlinkConsent = 'CONNECTED'
        mockEnedisConsent = mockEnedisSgeConsentConnected
        const { container } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
        expect(container.querySelector(analysisChartClassname)).not.toBeInTheDocument()
        expect(container.querySelector(analysisInformationListClassname)).not.toBeInTheDocument()
    })
    // test("when enedis is off, AnalysisMaxPower isn't shown", async () => {
    //     mockIsMetricsLoading = false
    //     mockEnedisConsent = mockEnedisSgeConsentOff
    //     const { getByText } = reduxedRender(
    //         <Router>
    //             <Analysis />
    //         </Router>,
    //         { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
    //     )

    //     expect(() => getByText('Pmax :')).toThrow()
    // })
    // test('when enedis is on, AnalysisMaxPower is shown', async () => {
    //     mockIsMetricsLoading = false
    //     mockEnedisConsent = mockEnedisSgeConsentConnected
    //     const { getByText } = reduxedRender(
    //         <Router>
    //             <Analysis />
    //         </Router>,
    //         { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
    //     )

    //     expect(getByText('Pmax :')).toBeTruthy()
    // })
})
