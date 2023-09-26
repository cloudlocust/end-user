import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ConfigurationStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/ConfigurationStep'

// Mock Dispatch and StepSetterFunction
const mockDispatch = jest.fn()
const mockStepSetter = jest.fn()

const decOption = 'Décongélation'
const stanOption = 'Standard'
const grilOption = 'Grill'

const defaultProps = {
    equipmentsNumber: 1,
    selectedMicrowave: '',
    setSelectedMicrowave: mockDispatch,
    measurementMode: '',
    setMeasurementMode: mockDispatch,
    stepSetter: mockStepSetter,
}

describe('ConfigurationStep Component', () => {
    test('renders correctly', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)

        const headerText = screen.getByText('Configuration')
        expect(headerText).toBeInTheDocument()

        const selectLabel = screen.getByText('Selectionner le micro-onde à mesurer')
        expect(selectLabel).toBeInTheDocument()

        const selectInput = screen.getByLabelText('Mon équipement')
        expect(selectInput).toBeInTheDocument()

        const radioGroupLabel = screen.getByText('Selectionner le mode à mesurer')
        expect(radioGroupLabel).toBeInTheDocument()

        const standardRadio = screen.getByText(stanOption)
        expect(standardRadio).toBeInTheDocument()

        const decongelationRadio = screen.getByText(decOption)
        expect(decongelationRadio).toBeInTheDocument()

        const grillRadio = screen.getByText(grilOption)
        expect(grillRadio).toBeInTheDocument()

        const warningMessage = screen.getByText('Attention à ne pas trop perturber le flux électrique durant le test')
        expect(warningMessage).toBeInTheDocument()
    })

    test('calls setMeasurementMode when selections are made', async () => {
        const measurementMode = stanOption
        reduxedRender(<ConfigurationStep {...defaultProps} measurementMode={measurementMode} />)

        const decongelationRadio = screen.getByText(decOption)
        userEvent.click(decongelationRadio)
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(decOption)
        })
    })

    test('calls stepSetter when the button Suivant is clicked with valid selections', async () => {
        const selectedMicrowave = 'micro-onde-1'
        const measurementMode = stanOption
        reduxedRender(
            <ConfigurationStep
                {...defaultProps}
                selectedMicrowave={selectedMicrowave}
                measurementMode={measurementMode}
            />,
        )

        const button = screen.getByText('Suivant')
        userEvent.click(button)
        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(2)
        })
    })

    test('disables the button Suivant when selections are not valid', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)

        const button = screen.getByText('Suivant')
        expect(button).toBeDisabled()
    })
})
