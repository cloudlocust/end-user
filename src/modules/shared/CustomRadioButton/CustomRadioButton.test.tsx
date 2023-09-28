import { render, waitFor } from '@testing-library/react'
import { CustomRadioButton } from './CustomRadioButton'
import userEvent from '@testing-library/user-event'

describe('CustomRadioButton', () => {
    test('renders without errors', () => {
        const { getByText } = render(<CustomRadioButton value="option1" label="Option 1" selectedValue="option1" />)
        const optionLabel = getByText('Option 1')
        expect(optionLabel).toBeInTheDocument()
    })

    test('toggles the selected state when clicked', async () => {
        const handleRadioBtnClick = jest.fn()
        const { getByText } = render(
            <CustomRadioButton
                value="option1"
                label="Option 1"
                selectedValue="option2"
                handleRadioBtnClick={handleRadioBtnClick}
            />,
        )
        const optionButton = getByText('Option 1')
        userEvent.click(optionButton)
        await waitFor(() => {
            expect(handleRadioBtnClick).toHaveBeenCalledWith('option1')
        })
    })

    test('applies contained variant when selected', () => {
        const { getByRole } = render(<CustomRadioButton value="option1" label="Option 1" selectedValue="option1" />)
        const optionButton = getByRole('button')
        expect(optionButton).toHaveClass('MuiButton-contained')
    })

    test('applies outlined variant when not selected', () => {
        const { getByRole } = render(<CustomRadioButton value="option1" label="Option 1" selectedValue="option2" />)
        const optionButton = getByRole('button')
        expect(optionButton).toHaveClass('MuiButton-outlined')
    })
})
