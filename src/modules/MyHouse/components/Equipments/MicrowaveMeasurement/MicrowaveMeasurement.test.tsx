import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'

describe('MicrowaveMeasurement', () => {
    test('renders the MicrowaveMeasurement modal and close it', async () => {
        const closeModal = jest.fn()
        reduxedRender(
            <MicrowaveMeasurement
                equipmentsNumber={1}
                isMeasurementModalOpen={true}
                onCloseMeasurementModal={closeModal}
            />,
        )

        userEvent.click(screen.getByRole('button', { name: 'close' }))
        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1)
        })
    })
})
