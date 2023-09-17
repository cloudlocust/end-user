import { render, waitFor } from '@testing-library/react'
import CustomRadioGroup from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import CustomRadioButton from 'src/modules/shared/CustomRadioButton/CustomRadioButton'
import userEvent from '@testing-library/user-event'

describe('CustomRadioGroup Component', () => {
    it('renders without crashing', () => {
        render(<CustomRadioGroup />)
    })

    it('renders children correctly', () => {
        const { getByText } = render(
            <CustomRadioGroup>
                <CustomRadioButton value="option_1" label="Option 1" />
                <CustomRadioButton value="option_2" label="Option 2" />
            </CustomRadioGroup>,
        )

        expect(getByText('Option 1')).toBeInTheDocument()
        expect(getByText('Option 2')).toBeInTheDocument()
    })

    it('handles value change', async () => {
        const handleChange = jest.fn()
        const { getByText } = render(
            <CustomRadioGroup defaultValue="Option 1" onValueChange={handleChange}>
                <CustomRadioButton value="option_1" label="Option 1" />
                <CustomRadioButton value="option_2" label="Option 2" />
            </CustomRadioGroup>,
        )

        userEvent.click(getByText('Option 2'))

        // Ensure the value change callback is called with the new value
        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledWith('option_2')
        })
    })
})
