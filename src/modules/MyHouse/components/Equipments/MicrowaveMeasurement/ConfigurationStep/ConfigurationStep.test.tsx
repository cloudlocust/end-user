import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ConfigurationStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/ConfigurationStep'

// Mock Dispatch and StepSetterFunction
const mockDispatch = jest.fn()
const mockStepSetter = jest.fn()

const modeA = 'Mode A'
const modeB = 'Mode B'

const defaultProps = {
    equipmentsNumber: 1,
    selectedMicrowave: 0,
    setSelectedMicrowave: mockDispatch,
    measurementModes: [modeA, modeB],
    selectedMeasurementMode: '',
    setSelectedMeasurementMode: mockDispatch,
    stepSetter: mockStepSetter,
}

describe('ConfigurationStep Component', () => {
    test('renders correctly', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)

        expect(screen.getByText('Configuration')).toBeInTheDocument()

        expect(screen.getByText('Selectionner le micro-onde à mesurer')).toBeInTheDocument()

        expect(screen.getByLabelText('Mon équipement')).toBeInTheDocument()

        expect(screen.getByText('Selectionner le mode à mesurer')).toBeInTheDocument()

        expect(screen.getByText(modeA)).toBeInTheDocument()

        expect(screen.getByText(modeB)).toBeInTheDocument()

        expect(
            screen.getByText('Attention à ne pas trop perturber le flux électrique durant le test'),
        ).toBeInTheDocument()
    })

    test('calls setMeasurementMode when selections are made', async () => {
        reduxedRender(<ConfigurationStep {...defaultProps} selectedMeasurementMode={modeA} />)

        userEvent.click(screen.getByText(modeB))
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(modeB)
        })
    })

    test('calls stepSetter when the button Suivant is clicked with valid selections', async () => {
        reduxedRender(<ConfigurationStep {...defaultProps} selectedMicrowave={1} selectedMeasurementMode={modeA} />)

        userEvent.click(screen.getByText('Suivant'))
        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(2)
        })
    })

    test('disables the button Suivant when selections are not valid', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)

        expect(screen.getByText('Suivant')).toBeDisabled()
    })
})
