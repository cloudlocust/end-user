import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { InfosPage } from 'src/modules/MyHouse/components/MicrowaveMeasurement/InfosPage'

// Mock the function passed as a prop
const mockStepSetter = jest.fn()

describe('InfosPage Component', () => {
    test('renders header correctly', () => {
        reduxedRender(<InfosPage stepSetter={mockStepSetter} />)

        const headerText = screen.getByText("Mesure d'appareil")
        expect(headerText).toBeInTheDocument()

        const subHeaderText = screen.getByText('Micro Onde')
        expect(subHeaderText).toBeInTheDocument()
    })

    test('renders test benefits and steps correctly', () => {
        reduxedRender(<InfosPage stepSetter={mockStepSetter} />)

        const benefitText = screen.getByText((content, _) => {
            return content.startsWith('Tester votre appareil vous permet de')
        })
        expect(benefitText).toBeInTheDocument()

        const stepText = screen.getByText((content, _) => {
            return content.startsWith('Le test se déroule en 4 étapes')
        })
        expect(stepText).toBeInTheDocument()
    })

    test('calls stepSetter when the button Commencer is clicked', async () => {
        reduxedRender(<InfosPage stepSetter={mockStepSetter} />)

        const button = screen.getByText('Commencer')
        userEvent.click(button)

        // Check if the stepSetter function was called
        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(1)
        })
    })
})
