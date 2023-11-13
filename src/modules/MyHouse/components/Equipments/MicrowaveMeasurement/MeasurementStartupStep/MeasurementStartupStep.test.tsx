import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementStartupStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementStartupStep'

const mockStepSetter = jest.fn()
const MEASUREMENT_MODE_TEST = 'Measurement Mode'

const props = {
    measurementMode: MEASUREMENT_MODE_TEST,
    stepSetter: mockStepSetter,
}

describe('MeasurementStartupStep Component', () => {
    test('renders correctly', () => {
        reduxedRender(<MeasurementStartupStep {...props} />)

        // Assert that the header is present
        expect(screen.getByText('Choisissez le réglage')).toBeInTheDocument()
        expect(screen.getByText(MEASUREMENT_MODE_TEST)).toBeInTheDocument()
        expect(screen.getByText('puis mettez en marche votre appareil')).toBeInTheDocument()

        // Assert that the content is present
        expect(screen.getByText('Une fois votre appareil en marche, vous pouvez lancer la mesure.')).toBeInTheDocument()

        // Assert that the button is present
        expect(screen.getByRole('button', { name: 'Commencer la mesure' })).toBeInTheDocument()
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
