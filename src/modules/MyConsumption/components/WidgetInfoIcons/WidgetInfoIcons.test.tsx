import { reduxedRender } from 'src/common/react-platform-components/test'
import {
    EuroWidgetInfoIcon,
    getWidgetInfoIcon,
    PMaxWidgetInfoIcon,
    ProductionWidgetErrorIcon,
} from 'src/modules/MyConsumption/components/WidgetInfoIcons'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { IEnedisSgeConsent } from 'src/modules/Consents/Consents'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const EURO_WIDGET_INFO_TEXT = 'Ce coût est un exemple.'
const PMAX_TOOLTIP_ICON = 'ErrorOutlineIcon'
const EURO_WIDGET_INFO_REDIRECT_LINK_TEXT = "Renseigner un contrat d'énergie."
let mockSgeConsentFeatureState = true

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get sgeConsentFeatureState() {
        return mockSgeConsentFeatureState
    },
}))

// Enedis Consent format
const mockEnedisSgeConsentConnected: IEnedisSgeConsent = {
    meterGuid: '133456',
    enedisSgeConsentState: 'CONNECTED',
    expiredAt: '',
}

let mockEnedisConsent: IEnedisSgeConsent | undefined = mockEnedisSgeConsentConnected

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisSgeConsent: mockEnedisConsent,
    }),
}))
describe('WidgetInfoIcon test', () => {
    test('EuroWidgetInfoIcon component', async () => {
        const { getByText, getByRole } = reduxedRender(
            <Router>
                <EuroWidgetInfoIcon />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )
        // Hovering the tooltip
        userEvent.hover(getByRole('button'))
        await waitFor(() => {
            expect(getByText(EURO_WIDGET_INFO_TEXT)).toBeTruthy()
        })

        // Contracts Redirection URL
        expect(getByText(EURO_WIDGET_INFO_REDIRECT_LINK_TEXT).parentElement!.closest('a')).toHaveAttribute(
            'href',
            `${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}/contracts`,
        )
    })

    test('ProductionWidgetErrorInfoIcon component', async () => {
        const { getByTestId } = reduxedRender(
            <Router>
                <ProductionWidgetErrorIcon />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )

        // House Redirection URL
        expect(getByTestId('ErrorOutlineIcon').parentElement!.closest('a')).toHaveAttribute(
            'href',
            `${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}`,
        )
    })

    test('PMaxWidgetInfoIcon component', async () => {
        const { getByTestId } = reduxedRender(
            <Router>
                <PMaxWidgetInfoIcon />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )
        expect(getByTestId(PMAX_TOOLTIP_ICON)).toBeTruthy()
    })

    test('getWidgetInfoIcon with different case', async () => {
        const defaultInput = {
            target: metricTargetsEnum.consumption,
            hasMissingHousingContracts: false,
            enphaseOff: false,
        }

        const cases = [
            // When target is euroConsumption and not hasMissingHousingContracts, then no EurodWidgetInfoIcon
            {
                input: {
                    ...defaultInput,
                    target: metricTargetsEnum.eurosConsumption,
                    hasMissingHousingContracts: false,
                },
                expectedResult: null,
            },
            // When target is not euroConsumption and hasMissingHousingContracts, then no EurodWidgetInfoIcon
            {
                input: { ...defaultInput, hasMissingHousingContracts: true },
                expectedResult: null,
            },
            // When target is euroConsumption and hasMissingHousingContracts, then EurodWidgetInfoIcon
            {
                input: {
                    ...defaultInput,
                    target: metricTargetsEnum.eurosConsumption,
                    hasMissingHousingContracts: true,
                },
                expectedResult: <EuroWidgetInfoIcon />,
            },
            // When target is totalProduction and not enphaseOff, then no ProductionWidgetErrorIcon
            {
                input: {
                    ...defaultInput,
                    target: metricTargetsEnum.totalProduction,
                    enphaseOff: false,
                },
                expectedResult: null,
            },
            // When target is not totalProduction and enphaseOff, then no ProductionWidgetErrorIcon
            {
                input: { ...defaultInput, enphaseOff: true },
                expectedResult: null,
            },
            // When target is totalProduction and enphaseOff, then ProductionWidgetErrorIcon
            {
                input: {
                    ...defaultInput,
                    target: metricTargetsEnum.totalProduction,
                    enphaseOff: true,
                },
                expectedResult: <ProductionWidgetErrorIcon />,
            },
        ]
        cases.forEach((testCase) => {
            expect(
                getWidgetInfoIcon({
                    widgetTarget: testCase.input.target,
                    hasMissingContracts: testCase.input.hasMissingHousingContracts,
                    enphaseOff: testCase.input.enphaseOff,
                }),
            ).toStrictEqual(testCase.expectedResult)
        })
    })
})
