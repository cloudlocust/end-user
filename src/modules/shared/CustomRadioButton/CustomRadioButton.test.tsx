import { render, fireEvent } from '@testing-library/react'
import CustomRadioButton from './CustomRadioButton'

describe('CustomRadioButton', () => {
    test('renders without errors', () => {
        const { getByText } = render(<CustomRadioButton value="option1" label="Option 1" selectedValue="option1" />)
        const optionLabel = getByText('Option 1')
        expect(optionLabel).toBeInTheDocument()
    })

    test('toggles the selected state when clicked', () => {
        const setSelectedValue = jest.fn()
        const { getByText } = render(
            <CustomRadioButton
                value="option1"
                label="Option 1"
                selectedValue="option2"
                setSelectedValue={setSelectedValue}
            />,
        )
        const optionButton = getByText('Option 1')
        fireEvent.click(optionButton)
        expect(setSelectedValue).toHaveBeenCalledWith('option1')
    })

    test('applies "contained" variant when selected', () => {
        const { getByRole } = render(<CustomRadioButton value="option1" label="Option 1" selectedValue="option1" />)
        const optionButton = getByRole('button')
        expect(optionButton).toHaveClass('MuiButton-contained')
    })

    test('applies "outlined" variant when not selected', () => {
        const { getByRole } = render(<CustomRadioButton value="option1" label="Option 1" selectedValue="option2" />)
        const optionButton = getByRole('button')
        expect(optionButton).toHaveClass('MuiButton-outlined')
    })
})
