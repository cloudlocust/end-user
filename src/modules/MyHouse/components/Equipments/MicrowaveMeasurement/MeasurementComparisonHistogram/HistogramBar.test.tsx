import { render } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
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

describe('HistogramBar component', () => {
    const HISTOGRAM_BAR_TEST_ID = 'histogram-bar'
    const AVERAGE_CONSUMPTION_LABEL_TEXT = "Consommation moyenne d'un micro onde"
    const USER_CONSUMPTION_LABEL_TEXT = 'Consommation de votre micro onde'

    test('renders correctly when the HistogramBar is for the average consumption', () => {
        const { getByText, getByTestId } = reduxedRender(
            <HistogramBar
                consumptionValue={600}
                height={74}
                label={AVERAGE_CONSUMPTION_LABEL_TEXT}
                isAverageConsumption
            />,
        )

        // Assert that the consumption value is present and correct
        expect(getByText('600 W')).toBeInTheDocument()

        // Assert that the group icon is present
        expect(getByTestId('GroupsOutlinedIcon')).toBeInTheDocument()

        // Assert that the bar height and background color are correct
        expect(getByTestId(HISTOGRAM_BAR_TEST_ID)).toHaveStyle({
            height: '74%',
            backgroundColor: 'transparent',
        })

        // Assert that the text label is present
        expect(getByText(AVERAGE_CONSUMPTION_LABEL_TEXT)).toBeInTheDocument()
    })

    test('renders correctly when the HistogramBar is for the user consumption', () => {
        const { getByText, getByTestId } = reduxedRender(
            <HistogramBar consumptionValue={800} height={36} label={USER_CONSUMPTION_LABEL_TEXT} />,
        )

        // Assert that the consumption value is present and correct
        expect(getByText('800 W')).toBeInTheDocument()

        // Assert that the person icon is present
        expect(getByTestId('PersonOutlineOutlinedIcon')).toBeInTheDocument()

        // Assert that the bar height and background color are correct
        const histogramBar = getByTestId(HISTOGRAM_BAR_TEST_ID)
        expect(histogramBar).toHaveStyle({
            height: '36%',
        })
        expect(histogramBar).not.toHaveStyle({
            height: 'transparent',
        })

        // Assert that the text label is present
        expect(getByText(USER_CONSUMPTION_LABEL_TEXT)).toBeInTheDocument()
    })
})
