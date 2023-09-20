import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ConfigurationStep } from 'src/modules/MyHouse/components/MicrowaveMeasurement/ConfigurationStep'

// Mock Dispatch and StepSetterFunction
const mockDispatch = jest.fn()
const mockStepSetter = jest.fn()

const decOption = 'Décongélation'
const stanOption = 'Standard'
const grilOption = 'Grill'

const defaultProps = {
    selectedMicrowave: '',
    setSelectedMicrowave: mockDispatch,
    measurementMode: '',
    setMeasurementMode: mockDispatch,
    stepSetter: mockStepSetter,
}

describe('ConfigurationStep Component', () => {
    test('renders header correctly', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)
        const headerText = screen.getByText('Configuration')
        expect(headerText).toBeInTheDocument()
    })

    test('renders select microwave dropdown correctly', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)
        const selectLabel = screen.getByText('Selectionner le micro-onde à mesurer')
        expect(selectLabel).toBeInTheDocument()

        const selectInput = screen.getByLabelText('Mon équipement')
        expect(selectInput).toBeInTheDocument()
    })

    test('renders select measuring mode radio group correctly', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)
        const radioGroupLabel = screen.getByText('Selectionner le mode à mesurer')
        expect(radioGroupLabel).toBeInTheDocument()

        // Assuming there are three radio buttons
        const standardRadio = screen.getByText(stanOption)
        const decongelationRadio = screen.getByText(decOption)
        const grillRadio = screen.getByText(grilOption)
        expect(standardRadio).toBeInTheDocument()
        expect(decongelationRadio).toBeInTheDocument()
        expect(grillRadio).toBeInTheDocument()
    })

    test('renders warning message correctly', () => {
        reduxedRender(<ConfigurationStep {...defaultProps} />)

        const warningMessage = screen.getByText('Attention à ne pas trop perturber le flux électrique durant le test')
        expect(warningMessage).toBeInTheDocument()
    })

    test('calls setMeasurementMode when selections are made', async () => {
        const measurementMode = stanOption
        reduxedRender(<ConfigurationStep {...defaultProps} measurementMode={measurementMode} />)

        // Assuming 'Standard' is selected initially
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

        // Check if the stepSetter function was called
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
