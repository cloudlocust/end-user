import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EquipmentStartupStep from './index'

const mockStepSetter = jest.fn()

const props = {
    testMode: 'Test Mode',
    stepSetter: mockStepSetter,
}

describe('EquipmentStartupStep Component', () => {
    test('renders correctly', () => {
        render(<EquipmentStartupStep {...props} />)

        // Check if the component renders the header correctly
        const testModeText = screen.getByText((content, _) => {
            return content.startsWith("Mettez en marche l'appareil sur le mode")
        })
        const testModeValue = screen.getByText((content, _) => {
            return content.startsWith('Test Mode')
        })
        expect(testModeText).toBeInTheDocument()
        expect(testModeValue).toBeInTheDocument()

        // Check if the button Commencer la mesure is displayed
        const startButton = screen.getByRole('button', { name: 'Commencer la mesure' })
        expect(startButton).toBeInTheDocument()
    })

    test('calls stepSetter when the button Commencer la mesure is clicked', async () => {
        render(<EquipmentStartupStep {...props} />)

        const startButton = screen.getByRole('button', { name: 'Commencer la mesure' })
        userEvent.click(startButton)
        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(3)
        })
    })
})
