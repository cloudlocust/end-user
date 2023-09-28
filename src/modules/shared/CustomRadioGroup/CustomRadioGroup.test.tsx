import { render, waitFor } from '@testing-library/react'
import { CustomRadioGroup } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup'
import userEvent from '@testing-library/user-event'

describe('CustomRadioGroup Component', () => {
    it('renders without crashing', () => {
        render(<CustomRadioGroup elements={[{ value: 'option_1', label: 'Option 1' }]} />)
    })

    it('renders children correctly', () => {
        const { getByText } = render(<CustomRadioGroup elements={[{ value: 'option_1', label: 'Option 1' }]} />)

        expect(getByText('Option 1')).toBeInTheDocument()
    })

    it('handles value change', async () => {
        const handleChange = jest.fn()
        const { getByText } = render(
            <CustomRadioGroup
                elements={[
                    { value: 'option_1', label: 'Option 1' },
                    { value: 'option_2', label: 'Option 2' },
                ]}
                defaultValue="Option 1"
                onValueChange={handleChange}
            />,
        )

        userEvent.click(getByText('Option 2'))

        // Ensure the value change callback is called with the new value
        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledWith('option_2')
        })
    })
})
