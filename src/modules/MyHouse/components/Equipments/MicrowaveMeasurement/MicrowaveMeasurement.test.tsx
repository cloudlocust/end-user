import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { MicrowaveMeasurementProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'

const HOUSING_EQUIPMENT_ID_TEST = 25
const EQUIPMENT_NUMBER_TEST = 1
const MEASUREMENT_MODES_TEST = ['mode A', 'mode B']
const mockOnCloseMeasurementModal = jest.fn()
const mockNavigateToEquipmentDetailsPage = jest.fn()
const mockUpdateEquipmentMeasurementResults = jest.fn()

const props: MicrowaveMeasurementProps = {
    housingEquipmentId: HOUSING_EQUIPMENT_ID_TEST,
    equipmentsNumber: EQUIPMENT_NUMBER_TEST,
    measurementModes: MEASUREMENT_MODES_TEST,
    isMeasurementModalOpen: true,
    onCloseMeasurementModal: mockOnCloseMeasurementModal,
    navigateToEquipmentDetailsPage: mockNavigateToEquipmentDetailsPage,
    updateEquipmentMeasurementResults: mockUpdateEquipmentMeasurementResults,
}

describe('MicrowaveMeasurement tests', () => {
    test('renders correctly when starting new mesurement test', async () => {
        reduxedRender(<MicrowaveMeasurement {...props} />)

        expect(screen.getByText("Mesure d'appareil")).toBeInTheDocument()
    })

    test('renders correctly when showing an old mesurement test result', async () => {
        reduxedRender(<MicrowaveMeasurement {...props} stepToStartFrom={4} />)

        expect(screen.getByText('Résultats')).toBeInTheDocument()
    })

    test('renders correctly when we start the mesurement from EquipmentsDetails Page', async () => {
        reduxedRender(<MicrowaveMeasurement {...props} stepToStartFrom={1} />)

        expect(screen.getByText('Configuration')).toBeInTheDocument()
    })

    test('call the onCloseMeasurementModal and updateEquipmentMeasurementResults functions on clicking on the close button', async () => {
        reduxedRender(<MicrowaveMeasurement {...props} />)

        userEvent.click(screen.getByRole('button', { name: 'close' }))
        await waitFor(() => {
            expect(mockOnCloseMeasurementModal).toHaveBeenCalledTimes(1)
            expect(mockUpdateEquipmentMeasurementResults).toHaveBeenCalledTimes(1)
        })
    })
})
