import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'

const mockOnCloseMeasurementModal = jest.fn()
const mockNavigateToEquipmentDetailsPage = jest.fn()

describe('MicrowaveMeasurement tests', () => {
    test('renders the MicrowaveMeasurement modal and close it', async () => {
        reduxedRender(
            <MicrowaveMeasurement
                housingEquipmentId={25}
                equipmentsNumber={1}
                measurementModes={['A', 'B']}
                isMeasurementModalOpen={true}
                onCloseMeasurementModal={mockOnCloseMeasurementModal}
                navigateToEquipmentDetailsPage={mockNavigateToEquipmentDetailsPage}
            />,
        )

        userEvent.click(screen.getByRole('button', { name: 'close' }))
        await waitFor(() => {
            expect(mockOnCloseMeasurementModal).toHaveBeenCalledTimes(1)
        })
    })
})
