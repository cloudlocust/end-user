import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementStartupStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementStartupStep'

const mockStepSetter = jest.fn()

const props = {
    measurementMode: 'Measurement Mode',
    stepSetter: mockStepSetter,
}

describe('MeasurementStartupStep Component', () => {
    test('renders correctly', () => {
        reduxedRender(<MeasurementStartupStep {...props} />)

        const measurementModeText = screen.getByText((content, _) => {
            return content.startsWith("Mettez en marche l'appareil sur le mode")
        })
        expect(measurementModeText).toBeInTheDocument()

        const measurementModeValue = screen.getByText((content, _) => {
            return content.startsWith('Measurement Mode')
        })
        expect(measurementModeValue).toBeInTheDocument()

        const startButton = screen.getByRole('button', { name: 'Commencer la mesure' })
        expect(startButton).toBeInTheDocument()
    })

    test('calls stepSetter when the button Commencer la mesure is clicked', async () => {
        reduxedRender(<MeasurementStartupStep {...props} />)

        const startButton = screen.getByRole('button', { name: 'Commencer la mesure' })
        userEvent.click(startButton)

        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(3)
        })
    })
})
