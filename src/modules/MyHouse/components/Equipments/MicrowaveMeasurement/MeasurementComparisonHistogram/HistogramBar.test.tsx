import { render } from '@testing-library/react'
import {
    HistogramBar,
    HistogramBarIcon,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementComparisonHistogram/HistogramBar'

describe('HistogramBarIcon component', () => {
    test('renders the icon correctly', () => {
        const { getByTestId } = render(<HistogramBarIcon icon={<></>} />)

        // Assert that the HistogramBar Icon is present
        expect(getByTestId('histogram-bar-icon')).toBeInTheDocument()
    })
})

const HISTOGRAM_BAR_TEST_ID = 'histogram-bar'

describe('HistogramBar component', () => {
    test('renders correctly when the HistogramBar is for the average consumption', () => {
        const { getByText, getByTestId } = render(
            <HistogramBar consumptionValue={600} otherConsumptionValue={1000} isAverageConsumption />,
        )

        // Assert that the consumption value is present and correct
        expect(getByText('600 W')).toBeInTheDocument()

        // Assert that the group icon is present
        expect(getByTestId('GroupsOutlinedIcon')).toBeInTheDocument()

        // Assert that the bar height and background color are correct
        expect(getByTestId(HISTOGRAM_BAR_TEST_ID)).toHaveStyle({
            height: '60%',
            backgroundColor: 'transparent',
        })
    })

    test('renders correctly when the HistogramBar is for the user consumption', () => {
        const { getByText, getByTestId } = render(<HistogramBar consumptionValue={800} otherConsumptionValue={1000} />)

        // Assert that the consumption value is present and correct
        expect(getByText('800 W')).toBeInTheDocument()

        // Assert that the person icon is present
        expect(getByTestId('PersonOutlineOutlinedIcon')).toBeInTheDocument()

        // Assert that the bar height and background color are correct
        const histogramBar = getByTestId(HISTOGRAM_BAR_TEST_ID)
        expect(histogramBar).toHaveStyle({
            height: '80%',
        })
        expect(histogramBar).not.toHaveStyle({
            height: 'transparent',
        })
    })

    test('the height of the bar must be 100% when the consumptionValue is greater than or equal to the otherConsumptionValue', () => {
        const { getByTestId, rerender } = render(<HistogramBar consumptionValue={1400} otherConsumptionValue={50} />)

        // Assert that the height of the bar is equal to 100%
        expect(getByTestId(HISTOGRAM_BAR_TEST_ID)).toHaveStyle({
            height: '100%',
        })

        rerender(<HistogramBar consumptionValue={5800} otherConsumptionValue={5800} />)

        // Assert that the height of the bar is equal to 100%
        expect(getByTestId(HISTOGRAM_BAR_TEST_ID)).toHaveStyle({
            height: '100%',
        })
    })
})
