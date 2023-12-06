import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementResultStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementResultStep'
import { MeasurementResultStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementResultStep/MeasurementResultStep'

const MICROWAVE_NUMBER_TEST = 1
const MEASUREMENT_MODE_TEST = 'Measurement Mode'
const MEASUREMENT_RESULT_TEST = 120
const mockCloseMeasurementModal = jest.fn()
const mockNavigateToEquipmentDetailsPage = jest.fn()
const mockRestartMeasurementFromBeginning = jest.fn()

const props: MeasurementResultStepProps = {
    microwaveNumber: MICROWAVE_NUMBER_TEST,
    measurementMode: MEASUREMENT_MODE_TEST,
    measurementResult: MEASUREMENT_RESULT_TEST,
    closeMeasurementModal: mockCloseMeasurementModal,
    navigateToEquipmentDetailsPage: mockNavigateToEquipmentDetailsPage,
    restartMeasurementFromBeginning: mockRestartMeasurementFromBeginning,
}

describe('MeasurementResultStep Component', () => {
    describe('when showing new test result', () => {
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

            // Assert that the measurement ending button is present
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

    describe('when showing an old test result', () => {
        beforeEach(() => {
            props.showingOldResult = true
        })

        test('renders correctly', () => {
            reduxedRender(<MeasurementResultStep {...props} showingOldResult />)

            // Assert that the headers are present
            expect(screen.getByText('Résultats')).toBeInTheDocument()
            expect(
                screen.getByText('*La consommation active représente la puissance en Watt de votre appareil'),
            ).toBeInTheDocument()
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

            // Assert that the redoing button is present
            expect(screen.getByRole('button', { name: 'Recommencer le test' })).toBeInTheDocument()
        })

        test('calls restartMeasurementFromBeginning when the button "Recommencer le test" is clicked', async () => {
            reduxedRender(<MeasurementResultStep {...props} />)

            const redoingButton = screen.getByRole('button', { name: 'Recommencer le test' })
            userEvent.click(redoingButton)
            await waitFor(() => {
                expect(mockRestartMeasurementFromBeginning).toHaveBeenCalledWith(
                    MICROWAVE_NUMBER_TEST,
                    MEASUREMENT_MODE_TEST,
                )
            })
        })
    })
})
