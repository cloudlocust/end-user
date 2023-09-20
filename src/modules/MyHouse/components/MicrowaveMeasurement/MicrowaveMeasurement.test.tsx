import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/MicrowaveMeasurement'

describe('MicrowaveMeasurement', () => {
    test('renders the component and interacts with it', async () => {
        // Mock modal close functions
        const closeModal = jest.fn()

        reduxedRender(<MicrowaveMeasurement modalIsOpen={true} closeModal={closeModal} />)

        // Close modal
        userEvent.click(screen.getByRole('button', { name: 'close' }))
        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1)
        })
    })
})
