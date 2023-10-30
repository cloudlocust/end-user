import { render } from '@testing-library/react'
import {
    HistogramBar,
    HistogramBarIcon,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementComparisonHistogram/HistogramBar'

describe('HistogramBarIcon component', () => {
    test('renders the icon correctly', () => {
        const { getByTestId } = render(<HistogramBarIcon icon={<></>} />)

        const iconElement = getByTestId('histogram-bar-icon')
        expect(iconElement).toBeInTheDocument()
    })
})

const HISTOGRAM_BAR_TEST_ID = 'histogram-bar'

describe('HistogramBar component', () => {
    test('renders correctly when the HistogramBar is for the user consumption', () => {
        const { getByText, getByTestId } = render(<HistogramBar consumptionValue={800} otherConsumptionValue={1000} />)

        // Assert that the consumption value is present
        const consumptionValueElement = getByText('800 W')
        expect(consumptionValueElement).toBeInTheDocument()

        // Assert that the person icon is present
        const personIcon = getByTestId('PersonOutlineOutlinedIcon')
        expect(personIcon).toBeInTheDocument()

        // Assert that the height of the bar is calculated correctly
        const barElement = getByTestId(HISTOGRAM_BAR_TEST_ID)
        expect(barElement).toHaveStyle({
            height: '80%',
        })
    })

    test('renders correctly when the HistogramBar is for the average consumption', () => {
        const { getByText, getByTestId } = render(
            <HistogramBar consumptionValue={600} otherConsumptionValue={1000} isAverageConsumption />,
        )

        // Assert that the consumption value is present
        const consumptionValueElement = getByText('600 W')
        expect(consumptionValueElement).toBeInTheDocument()

        // Assert that the group icon is present
        const groupIcon = getByTestId('GroupsOutlinedIcon')
        expect(groupIcon).toBeInTheDocument()

        // Assert that the height of the bar is calculated correctly
        const barElement = getByTestId(HISTOGRAM_BAR_TEST_ID)
        expect(barElement).toHaveStyle({
            height: '60%',
        })
    })

    test('the height of the bar must be 100% when the consumptionValue is greater than or equal to the otherConsumptionValue', () => {
        const { getByTestId, rerender } = render(<HistogramBar consumptionValue={1400} otherConsumptionValue={50} />)
        expect(getByTestId(HISTOGRAM_BAR_TEST_ID)).toHaveStyle({
            height: '100%',
        })

        rerender(<HistogramBar consumptionValue={5800} otherConsumptionValue={5800} />)
        expect(getByTestId(HISTOGRAM_BAR_TEST_ID)).toHaveStyle({
            height: '100%',
        })
    })
})
