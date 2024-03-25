import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonsSwitcher } from 'src/modules/shared/ButtonsSwitcher'
import { ButtonSwitcherParamsType } from 'src/modules/shared/ButtonsSwitcher/ButtonsSwitcher'

describe('ButtonsSwitcher', () => {
    test('renders the buttons and handles clicks', async () => {
        const mockClickHandler1 = jest.fn()
        const mockClickHandler2 = jest.fn()

        const buttonsSwitcherParams: ButtonSwitcherParamsType[] = [
            {
                buttonText: 'Button 1',
                clickHandler: mockClickHandler1,
            },
            {
                buttonText: 'Button 2',
                clickHandler: mockClickHandler2,
            },
        ]

        const { getByText } = render(<ButtonsSwitcher buttonsSwitcherParams={buttonsSwitcherParams} />)

        const button1 = getByText('Button 1')
        const button2 = getByText('Button 2')

        // Check if the buttons are rendered
        expect(button1).toBeInTheDocument()
        expect(button2).toBeInTheDocument()

        // Simulate clicks on the buttons
        userEvent.click(button1)
        await waitFor(() => {
            // The button should be initially selected (active). Clicking it again should have no effect (or toggle its selection state depending on your desired behavior).
            expect(mockClickHandler1).toHaveBeenCalledTimes(0)
        })
        userEvent.click(button2)
        await waitFor(() => {
            expect(mockClickHandler2).toHaveBeenCalledTimes(1)
        })
    })
})
