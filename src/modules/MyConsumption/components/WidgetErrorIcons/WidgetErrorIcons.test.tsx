import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { BrowserRouter as Router } from 'react-router-dom'
import {
    getWidgetEnphaseErrorIcon,
    ProductionWidgetErrorIcon,
} from 'src/modules/MyConsumption/components/WidgetErrorIcons'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

describe('WidgetErrorIcon test', () => {
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

    test('getWidgetEnphaseErrorIcon with different case', async () => {
        const cases = [
            // When target is totalProduction and not enphaseOff, then no ProductionWidgetErrorIcon
            {
                input: { target: metricTargetsEnum.totalProduction, enphaseOff: false },
                expectedResult: undefined,
            },
            // When target is not totalProduction and enphaseOff, then no ProductionWidgetErrorIcon
            {
                input: { target: metricTargetsEnum.consumption, enphaseOff: true },
                expectedResult: undefined,
            },
            // When target is totalProduction and enphaseOff, then ProductionWidgetErrorIcon
            {
                input: { target: metricTargetsEnum.totalProduction, enphaseOff: true },
                expectedResult: <ProductionWidgetErrorIcon />,
            },
        ]
        cases.forEach((testCase) => {
            expect(getWidgetEnphaseErrorIcon(testCase.input.target, testCase.input.enphaseOff)).toStrictEqual(
                testCase.expectedResult,
            )
        })
    })
})
