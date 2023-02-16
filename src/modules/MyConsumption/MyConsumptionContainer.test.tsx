import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionContainer } from 'src/modules/MyConsumption/MyConsumptionContainer'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import { formatMetricFilter } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import userEvent from '@testing-library/user-event'
import { store } from 'src/redux'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { NRLINK_ENEDIS_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import { IEnedisSgeConsent, INrlinkConsent, IEnphaseConsent } from 'src/modules/Consents/Consents'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

// Nrlink Consent format
const nrLinkConsent: INrlinkConsent = {
    meterGuid: '133456',
    nrlinkConsentState: 'CONNECTED',
    nrlinkGuid: '12',
}

// Enedis Consent format
const enedisSGeConsent: IEnedisSgeConsent = {
    meterGuid: '133456',
    enedisSgeConsentState: 'CONNECTED',
    expiredAt: '',
}

// Enphase Consent default
const enphaseConsent: IEnphaseConsent = {
    meterGuid: '133456',
    enphaseConsentState: 'ACTIVE',
}

let mockNrlinkConsent: INrlinkConsent | undefined = nrLinkConsent
let mockEnedisConsent: IEnedisSgeConsent | undefined = enedisSGeConsent
let mockEnphaseConsent: IEnphaseConsent | undefined = enphaseConsent
const MISSING_CURRENT_HOUSING_METER_ERROR_TEXT1 = "Pour voir votre consommation vous devez d'abord"
const MISSING_CURRENT_HOUSING_METER_ERROR_TEXT2 = 'enregistrer votre compteur et votre nrLink'
let mockConsentsLoading = false
const circularProgressClassname = '.MuiCircularProgress-root'

const mockGetConsents = jest.fn()
// Mock function to check the value of filters state in MyConsumptionContainer.
const mockSetFilters = jest.fn()
const FILTERS_TEXT = 'Filters'
// Mock function to check the value of range state in MyConsumptionContainer.
const mockSetRange = jest.fn()
const RANGE_TEXT = 'Range'
// Mock function to check the value of period state in MyConsumptionContainer.
const mockSetPeriod = jest.fn()
const PERIOD_TEXT = 'Period'
const METRICS_INTERVAL_ENPHASE_ACTIVE = '30m'

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisSgeConsent: mockEnedisConsent,
        nrlinkConsent: mockNrlinkConsent,
        enphaseConsent: mockEnphaseConsent,
        getConsents: mockGetConsents,
        consentsLoading: mockConsentsLoading,
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
    'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => ({
        ...jest.requireActual('src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'),
        // eslint-disable-next-line jsdoc/require-jsdoc
        ConsumptionChartContainer: (props: ConsumptionChartContainerProps) => (
            <div>
                <p onClick={() => mockSetFilters(props.filters)}>{FILTERS_TEXT}</p>
                <p onClick={() => mockSetRange(props.range)}>{RANGE_TEXT}</p>
                <p onClick={() => mockSetPeriod(props.period)}>{PERIOD_TEXT}</p>
                <p>{props.metricsInterval}</p>
            </div>
        ),
    }),
)

// ApexCharts cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)
describe('MyConsumptionContainer test', () => {
    test('when there is no meter, a message is shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { initialState: { housingModel: { currentHousing: null } } },
        )
        expect(getByText(MISSING_CURRENT_HOUSING_METER_ERROR_TEXT1)).toBeTruthy()
        expect(getByText(MISSING_CURRENT_HOUSING_METER_ERROR_TEXT2)).toBeTruthy()
    })

    test('housesList not empty, then filters should have currentHousing of houseList, and getConsent should be called', async () => {
        // we initiate the store by adding the housing list - by default current state will be the first element
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)

        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { store },
        )

        userEvent.click(getByText(FILTERS_TEXT))
        await waitFor(() => {
            expect(mockSetFilters).toHaveBeenCalledWith(formatMetricFilter(LIST_OF_HOUSES[0]!.meter!.guid))
        })

        await waitFor(() => {
            expect(mockGetConsents).toHaveBeenCalledWith(LIST_OF_HOUSES[0]!.meter!.guid, LIST_OF_HOUSES[0]!.meter!.id)
        })
    }, 10000)

    test('when enphaseConsentState is Active, metricsIterval is related to it', async () => {
        mockEnphaseConsent!.enphaseConsentState = 'ACTIVE'
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        // Period EnphaseConsent Active
        await waitFor(() => {
            expect(getByText(METRICS_INTERVAL_ENPHASE_ACTIVE)).toBeTruthy()
        })
    })

    test('when nrLINK is off & enedisSge is off, an error message is shown', async () => {
        mockNrlinkConsent!.nrlinkConsentState = 'NONEXISTENT'
        mockEnedisConsent!.enedisSgeConsentState = 'NONEXISTENT'
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        await waitFor(() => {
            expect(mockGetConsents).toHaveBeenCalled()
        })

        expect(getByText(NRLINK_ENEDIS_OFF_MESSAGE)).toBeTruthy()
    })

    test('when getConsent request fail then error message is shown', async () => {
        mockNrlinkConsent = undefined
        mockEnedisConsent = undefined
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        await waitFor(() => {
            expect(getByText(NRLINK_ENEDIS_OFF_MESSAGE)).toBeTruthy()
        })
    })

    test('when consentLoading Spinner is shown', async () => {
        // initiate the store by adding housing list - by default current state will be the first element
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
        mockConsentsLoading = true
        const { container } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
