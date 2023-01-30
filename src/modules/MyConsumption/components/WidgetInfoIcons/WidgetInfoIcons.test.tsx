import { reduxedRender } from 'src/common/react-platform-components/test'
import {
    EuroWidgetInfoIcon,
    getWidgetInfoIcon,
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

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const EURO_WIDGET_INFO_TEXT = 'Ce coût est un exemple.'
const EURO_WIDGET_INFO_REDIRECT_LINK_TEXT = "Renseigner un contrat d'énergie."

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
                expectedResult: undefined,
            },
            // When target is not euroConsumption and hasMissingHousingContracts, then no EurodWidgetInfoIcon
            {
                input: { ...defaultInput, hasMissingHousingContracts: true },
                expectedResult: undefined,
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
                expectedResult: undefined,
            },
            // When target is not totalProduction and enphaseOff, then no ProductionWidgetErrorIcon
            {
                input: { ...defaultInput, enphaseOff: true },
                expectedResult: undefined,
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
                getWidgetInfoIcon(
                    testCase.input.target,
                    testCase.input.hasMissingHousingContracts,
                    testCase.input.enphaseOff,
                ),
            ).toStrictEqual(testCase.expectedResult)
        })
    })
})
