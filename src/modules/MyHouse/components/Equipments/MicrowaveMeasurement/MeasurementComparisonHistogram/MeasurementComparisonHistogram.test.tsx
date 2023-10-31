import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementComparisonHistogram } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementComparisonHistogram'

const HISTOGRAM_BAR_TEST_ID = 'histogram-bar'
const USER_CONSUMPTION_LABEL_TEXT = 'Consommation de votre micro onde'
const AVERAGE_CONSUMPTION_LABEL_TEXT = "Consommation moyenne d'un micro onde"

describe('MeasurementComparisonHistogram component', () => {
    test('renders correctly when the averageConsumption is greater than the userConsumption', () => {
        const { getByText, getByTestId, getAllByTestId } = reduxedRender(
            <MeasurementComparisonHistogram userConsumption={750} averageConsumption={1000} />,
        )

        // Assert that the consumptions labels are present
        expect(getByText(USER_CONSUMPTION_LABEL_TEXT)).toBeInTheDocument()
        expect(getByText(AVERAGE_CONSUMPTION_LABEL_TEXT)).toBeInTheDocument()

        // Assert that the consumptions values are present and correct
        expect(getByText('750 W')).toBeInTheDocument()
        expect(getByText('1000 W')).toBeInTheDocument()

        // Assert that the icons are present
        expect(getByTestId('PersonOutlineOutlinedIcon')).toBeInTheDocument()
        expect(getByTestId('GroupsOutlinedIcon')).toBeInTheDocument()

        const [userConsumptionBarElement, averageConsumptionBarElement] = getAllByTestId(HISTOGRAM_BAR_TEST_ID)

        // Assert that the userConsumption bar height and background color are correct
        expect(userConsumptionBarElement).toHaveStyle({
            height: '75%',
        })
        expect(userConsumptionBarElement).not.toHaveStyle({
            height: 'transparent',
        })

        // Assert that the averageConsumption bar height and background color are correct
        expect(averageConsumptionBarElement).toHaveStyle({
            height: '100%',
            backgroundColor: 'transparent',
        })
    })

    test('renders correctly when the averageConsumption is less than the userConsumption', () => {
        const { getAllByTestId } = reduxedRender(
            <MeasurementComparisonHistogram userConsumption={1000} averageConsumption={880} />,
        )

        const [userConsumptionBarElement, averageConsumptionBarElement] = getAllByTestId(HISTOGRAM_BAR_TEST_ID)

        // Assert that the userConsumption bar height and background color are correct
        expect(userConsumptionBarElement).toHaveStyle({
            height: '100%',
        })
        expect(userConsumptionBarElement).not.toHaveStyle({
            height: 'transparent',
        })

        // Assert that the averageConsumption bar height and background color are correct
        expect(averageConsumptionBarElement).toHaveStyle({
            height: '88%',
            backgroundColor: 'transparent',
        })
    })

    test('renders correctly when the averageConsumption is equal to the userConsumption', () => {
        const { getAllByTestId } = reduxedRender(
            <MeasurementComparisonHistogram userConsumption={578} averageConsumption={578} />,
        )

        const [userConsumptionBarElement, averageConsumptionBarElement] = getAllByTestId(HISTOGRAM_BAR_TEST_ID)

        // Assert that the userConsumption bar height and background color are correct
        expect(userConsumptionBarElement).toHaveStyle({
            height: '100%',
        })
        expect(userConsumptionBarElement).not.toHaveStyle({
            height: 'transparent',
        })

        // Assert that the averageConsumption bar height and background color are correct
        expect(averageConsumptionBarElement).toHaveStyle({
            height: '100%',
            backgroundColor: 'transparent',
        })
    })
})
