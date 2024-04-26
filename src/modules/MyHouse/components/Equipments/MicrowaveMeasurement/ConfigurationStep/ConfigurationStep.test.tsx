import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ConfigurationStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/ConfigurationStep'
import { measurementStepsEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement.d'

// Mock Dispatch and StepSetterFunction
const mockDispatch = jest.fn()
const mockStepSetter = jest.fn()

const modeA = 'Mode A'
const modeB = 'Mode B'

const defaultProps = {
    equipmentsNumber: 2,
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

        expect(screen.getByText('Sélectionner le micro-onde à mesurer')).toBeInTheDocument()

        expect(screen.getByLabelText('Mon équipement')).toBeInTheDocument()

        expect(screen.getByText('Choisir le réglage à mesurer')).toBeInTheDocument()

        expect(screen.getByText(modeA)).toBeInTheDocument()

        expect(screen.getByText(modeB)).toBeInTheDocument()

        expect(
            screen.getByText(
                'Attention : si vous lancez un autre appareil au même moment, cela risque de fausser la mesure.',
            ),
        ).toBeInTheDocument()
    })

    test('do not display the microwave select when there is only one microwave', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} equipmentsNumber={1} />)

        expect(screen.queryByText('Sélectionner le micro-onde à mesurer')).toBeNull()
        expect(screen.queryByText('Mon équipement')).toBeNull()
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
            expect(mockStepSetter).toHaveBeenCalledWith(measurementStepsEnum.STARTUP_STEP)
        })
    })

    test('disables the button Suivant when selections are not valid', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)

        expect(screen.getByText('Suivant')).toBeDisabled()
    })
})
