import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { InfosPage } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/InfosPage'
import { measurementStepsEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'

// Mock the function passed as a prop
const mockStepSetter = jest.fn()

describe('InfosPage Component', () => {
    test('renders correctly', () => {
        reduxedRender(<InfosPage stepSetter={mockStepSetter} />)

        // Assert that the headers are present
        expect(screen.getByText("Mesure d'appareil")).toBeInTheDocument()
        expect(screen.getByText('Micro Onde')).toBeInTheDocument()
        // Assert that the content texts are present
        expect(
            screen.getByText(
                "Cette fonctionnalité est en phase de test, ce qui signifie que vos résultats peuvent varier. Pour obtenir un résultat optimal, veuillez ne pas utiliser d'autres appareils dans les 2 à 3 minutes précédentes ou pendant le test.",
            ),
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                "Grâce à votre nrLINK, vous avez la possibilité de surveiller l'efficacité énergétique de vos appareils.",
            ),
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                'Analysons ensemble la consommation moyenne de votre appareil en suivant 3 étapes simples',
            ),
        ).toBeInTheDocument()
        expect(screen.getByText("Choisissez le réglage de l'appareil que vous souhaitez mesurer")).toBeInTheDocument()
        expect(screen.getByText('Mettez en route de votre appareil')).toBeInTheDocument()
        expect(screen.getByText('Lancez la mesure')).toBeInTheDocument()
    })

    test('calls stepSetter when the button Commencer is clicked', async () => {
        reduxedRender(<InfosPage stepSetter={mockStepSetter} />)

        const button = screen.getByText('Commencer')
        userEvent.click(button)
        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(measurementStepsEnum.CONFIGURATION_STEP)
        })
    })
})
