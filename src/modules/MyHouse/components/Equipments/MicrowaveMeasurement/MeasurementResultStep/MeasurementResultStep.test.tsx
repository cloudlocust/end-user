import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementResultStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementResultStep'

const MEASUREMENT_MODE_TEST = 'Measurement Mode'
const MEASUREMENT_RESULT_TEST = 120
const mockCloseMeasurementModal = jest.fn()
const mockNavigateToEquipmentDetailsPage = jest.fn()

const props = {
    measurementMode: MEASUREMENT_MODE_TEST,
    measurementResult: MEASUREMENT_RESULT_TEST,
    closeMeasurementModal: mockCloseMeasurementModal,
    navigateToEquipmentDetailsPage: mockNavigateToEquipmentDetailsPage,
}

describe('MeasurementResultStep Component', () => {
    test('renders correctly', () => {
        reduxedRender(<MeasurementResultStep {...props} />)

        // Assert that the headers are present
        expect(screen.getByText('Résultats')).toBeInTheDocument()
        expect(
            screen.getByText((content, _) => {
                return content.startsWith('Mode Sélectionné')
            }),
        ).toBeInTheDocument()
        expect(
            screen.getByText((content, _) => {
                return content.startsWith(MEASUREMENT_MODE_TEST)
            }),
        ).toBeInTheDocument()

        // Assert that the consumptions value are present
        expect(screen.getByText(`${MEASUREMENT_RESULT_TEST} W`)).toBeInTheDocument()

        // Assert that the the measurement ending button is present
        expect(screen.getByRole('button', { name: 'Terminer' })).toBeInTheDocument()
    })

    test('calls closeMeasurementModal & navigateToEquipmentDetailsPage when the button "Terminer" is clicked', async () => {
        reduxedRender(<MeasurementResultStep {...props} />)

        const nextButton = screen.getByRole('button', { name: 'Terminer' })
        userEvent.click(nextButton)
        await waitFor(() => {
            expect(mockCloseMeasurementModal).toHaveBeenCalled()
            expect(mockNavigateToEquipmentDetailsPage).toHaveBeenCalled()
        })
    })
})
