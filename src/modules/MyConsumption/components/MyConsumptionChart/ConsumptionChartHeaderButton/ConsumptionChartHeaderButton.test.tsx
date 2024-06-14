import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ConsumptionChartHeaderButton } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartHeaderButton'
import { ConsumptionChartHeaderButtonProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartHeaderButton/ConsumptionChartHeaderButton.types'

const ICON_TEST = 'Icon'
const TEXT_TEST = 'Button Text'
const BUTTON_COLOR_TEST = '#FF5733'
const TEXT_COLOR_TEST = '#FFFFFF'
const BORDER_COLOR_TEST = '#000000'
const mockClickHandler = jest.fn()

const props: ConsumptionChartHeaderButtonProps = {
    icon: ICON_TEST,
    text: TEXT_TEST,
    buttonColor: BUTTON_COLOR_TEST,
    textColor: TEXT_COLOR_TEST,
    hasBorder: true,
    borderColor: BORDER_COLOR_TEST,
    clickHandler: mockClickHandler,
}

describe('ConsumptionChartHeaderButton Component', () => {
    test('renders correctly', () => {
        const { getByText, getByRole } = reduxedRender(<ConsumptionChartHeaderButton {...props} />)

        // Assert that the button is rendered with correct text and icon
        expect(getByText(TEXT_TEST)).toBeInTheDocument()
        expect(getByText(ICON_TEST)).toBeInTheDocument()

        // Assert button styles
        const button = getByRole('button')
        expect(button).toHaveStyle(`background-color: ${BUTTON_COLOR_TEST}`)
        expect(button).toHaveStyle(`color: ${TEXT_COLOR_TEST}`)
        expect(button).toHaveStyle(`border: 1px solid`)
        expect(button).toHaveStyle(`border-color: ${BORDER_COLOR_TEST}`)
    })

    test('calls clickHandler when the button is clicked', async () => {
        const { getByRole } = reduxedRender(<ConsumptionChartHeaderButton {...props} />)

        const button = getByRole('button')
        userEvent.click(button)
        await waitFor(() => {
            expect(mockClickHandler).toHaveBeenCalledTimes(1)
        })
    })
})
