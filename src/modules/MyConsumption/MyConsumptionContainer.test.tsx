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
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { IEnedisSgeConsent, INrlinkConsent, IEnphaseConsent } from 'src/modules/Consents/Consents'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import { SwitchConsumptionButtonLabelEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { ECOWATT_TITLE } from 'src/modules/Ecowatt/EcowattWidget'

// List of houses to add to the redux state
const MOCK_TEST_CONNECTED_PLUGS: IConnectedPlug[] = applyCamelCase(TEST_CONNECTED_PLUGS)
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
const MISSING_CURRENT_HOUSING_METER_ERROR_TEXT2 = 'enregistrer votre compteur et votre nrLINK'
const LIST_WIDGETS_TEXT = 'Chiffres clés'
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
const METRICS_INTERVAL_PRODUCTION_ACTIVE = '30m'

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

let mockConnectedPlugLoadingInProgress = false
let mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS
// eslint-disable-next-line jsdoc/require-jsdoc
let mockGetProductionConnectedPlug: () => IConnectedPlug | undefined = () => undefined

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConnectedPlugList: () => ({
        connectedPlugList: mockConnectedPlugsList,
        loadingInProgress: mockConnectedPlugLoadingInProgress,
        // eslint-disable-next-line jsdoc/require-jsdoc
        getProductionConnectedPlug: mockGetProductionConnectedPlug,
        loadConnectedPlugList: jest.fn(),
    }),
}))

// eslint-disable-next-line jsdoc/require-jsdoc
let mockIsProductionActiveAndHousingHasAccess = () => true

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    isProductionActiveAndHousingHasAccess: () => mockIsProductionActiveAndHousingHasAccess(),
}))

describe('MyConsumptionContainer test', () => {
    afterEach(() => {
        // reset all the mock variables into their initial state
        mockNrlinkConsent = { ...nrLinkConsent }
        mockEnedisConsent = { ...enedisSGeConsent }
        mockEnphaseConsent = { ...enphaseConsent }
        mockConsentsLoading = false
        mockConnectedPlugLoadingInProgress = false
        mockConnectedPlugsList = [...MOCK_TEST_CONNECTED_PLUGS]
        // eslint-disable-next-line jsdoc/require-jsdoc
        mockGetProductionConnectedPlug = () => undefined
        // eslint-disable-next-line jsdoc/require-jsdoc
        mockIsProductionActiveAndHousingHasAccess = () => true
        mockSetFilters.mockClear()
        mockSetRange.mockClear()
        mockSetPeriod.mockClear()
        mockGetConsents.mockClear()
    })
    test('when there is a meter, the consumption chart is shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        expect(getByText(FILTERS_TEXT)).toBeTruthy()
        expect(getByText(RANGE_TEXT)).toBeTruthy()
        expect(getByText(PERIOD_TEXT)).toBeTruthy()
    })
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
            expect(mockSetFilters).toHaveBeenCalledWith(formatMetricFilter(LIST_OF_HOUSES[0]!.id))
        })

        await waitFor(() => {
            expect(mockGetConsents).toHaveBeenCalledWith(LIST_OF_HOUSES[0]!.meter!.id)
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
            expect(getByText(METRICS_INTERVAL_PRODUCTION_ACTIVE)).toBeTruthy()
        })
    })
    test('When connected plug production, metricsIterval is related to it', async () => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        mockGetProductionConnectedPlug = () => MOCK_TEST_CONNECTED_PLUGS[0]
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )
        await waitFor(() => {
            expect(getByText(METRICS_INTERVAL_PRODUCTION_ACTIVE)).toBeTruthy()
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

    describe('when there nrlink is EXISTENT or endisSge is connected', () => {
        test('normal case, switch consumption button and the parts of (Widgets & ChartFAQ & Ecowatt) are shown', async () => {
            const { getByText, getByTestId, queryByText } = reduxedRender(
                <Router>
                    <MyConsumptionContainer />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
            expect(getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toBeInTheDocument()
            expect(queryByText(SwitchConsumptionButtonLabelEnum.Idle)).not.toBeInTheDocument()
            expect(getByText(LIST_WIDGETS_TEXT)).toBeInTheDocument()
            expect(getByTestId('faq')).toBeInTheDocument()
            expect(getByText(ECOWATT_TITLE)).toBeInTheDocument()
        })
        test('when enphase is off, idle button should also be shown', async () => {
            // we mock enphase consent to be off, to show the idle button also.
            mockEnphaseConsent!.enphaseConsentState = 'EXPIRED'
            const { getByText } = reduxedRender(
                <Router>
                    <MyConsumptionContainer />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            expect(getByText(SwitchConsumptionButtonLabelEnum.Idle)).toBeInTheDocument()
            expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
            expect(getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toBeInTheDocument()
        })
        test('production is not active, "Autoconso & Production" button should not be shown', async () => {
            // we mock enphase consent to be off, to show the idle button also.
            mockEnphaseConsent!.enphaseConsentState = 'EXPIRED'
            // eslint-disable-next-line jsdoc/require-jsdoc
            mockIsProductionActiveAndHousingHasAccess = () => false
            const { getByText, queryByText } = reduxedRender(
                <Router>
                    <MyConsumptionContainer />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )

            expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
            expect(getByText(SwitchConsumptionButtonLabelEnum.Idle)).toBeInTheDocument()
            expect(queryByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).not.toBeInTheDocument()
        })
        test('when enphase is off, and "Autoconso & Production" has is toggled, links part to add prod consent should be shown', async () => {
            // we mock enphase consent to be off, to show the idle button also.
            mockEnphaseConsent!.enphaseConsentState = 'EXPIRED'
            const { getByText, queryByText, queryByTestId } = reduxedRender(
                <Router>
                    <MyConsumptionContainer />
                </Router>,
                { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
            )
            userEvent.click(getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction))

            expect(queryByText(LIST_WIDGETS_TEXT)).not.toBeInTheDocument()
            expect(queryByTestId('faq')).not.toBeInTheDocument()
            expect(queryByText(ECOWATT_TITLE)).not.toBeInTheDocument()

            // TODO: this will be updated in the next PR.
            expect(getByText('Add links here to add production -in the next PR-')).toBeInTheDocument()
        })
    })
})
