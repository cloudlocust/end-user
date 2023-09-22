import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/MicrowaveMeasurement'

describe('MicrowaveMeasurement', () => {
    test('renders the MicrowaveMeasurement modal and close it', async () => {
        const closeModal = jest.fn()
        reduxedRender(<MicrowaveMeasurement modalIsOpen={true} closeModal={closeModal} />)

        userEvent.click(screen.getByRole('button', { name: 'close' }))
        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1)
        })
    })
})
