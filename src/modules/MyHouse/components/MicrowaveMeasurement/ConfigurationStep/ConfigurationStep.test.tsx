import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfigurationStep from './index'

// Mock Dispatch and StepSetterFunction
const mockDispatch = jest.fn()
const mockStepSetter = jest.fn()

const decOption = 'Décongélation'
const stanOption = 'Standard'
const grilOption = 'Grill'

const defaultProps = {
    selectedMicrowave: '',
    setSelectedMicrowave: mockDispatch,
    measuringMode: '',
    setMeasuringMode: mockDispatch,
    stepSetter: mockStepSetter,
}

describe('ConfigurationStep Component', () => {
    test('renders header correctly', () => {
        render(<ConfigurationStep {...defaultProps} />)
        const headerText = screen.getByText('Configuration')
        expect(headerText).toBeInTheDocument()
    })

    test('renders select microwave dropdown correctly', () => {
        render(<ConfigurationStep {...defaultProps} />)
        const selectLabel = screen.getByText('Selectionner le micro-onde à mesurer')
        expect(selectLabel).toBeInTheDocument()

        const selectInput = screen.getByLabelText('Mon équipement')
        expect(selectInput).toBeInTheDocument()
    })

    test('renders select measuring mode radio group correctly', () => {
        render(<ConfigurationStep {...defaultProps} />)
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
        render(<ConfigurationStep {...defaultProps} />)

        const warningMessage = screen.getByText('Attention à ne pas trop perturber le flux électrique durant le test')
        expect(warningMessage).toBeInTheDocument()
    })

    test('calls setMeasuringMode when selections are made', async () => {
        const measuringMode = stanOption
        render(<ConfigurationStep {...defaultProps} measuringMode={measuringMode} />)

        // Assuming 'Standard' is selected initially
        const decongelationRadio = screen.getByText(decOption)
        userEvent.click(decongelationRadio)
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(decOption)
        })
    })

    test('calls stepSetter when the button Suivant is clicked with valid selections', async () => {
        const selectedMicrowave = 'micro-onde-1'
        const measuringMode = stanOption
        render(
            <ConfigurationStep {...defaultProps} selectedMicrowave={selectedMicrowave} measuringMode={measuringMode} />,
        )
        const button = screen.getByText('Suivant')
        userEvent.click(button)

        // Check if the stepSetter function was called
        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(2)
        })
    })

    test('disables the button Suivant when selections are not valid', () => {
        render(<ConfigurationStep {...defaultProps} />)
        const button = screen.getByText('Suivant')
        expect(button).toBeDisabled()
    })
})
