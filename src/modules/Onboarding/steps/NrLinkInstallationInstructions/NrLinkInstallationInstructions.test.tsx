import { reduxedRender } from 'src/common/react-platform-components/test'
import { NrLinkInstallationInstructions } from 'src/modules/Onboarding/steps/NrLinkInstallationInstructions'

describe('NrLinkInstallationInstructions test', () => {
    test('renders component correctly', () => {
        const { getByText } = reduxedRender(<NrLinkInstallationInstructions onNext={jest.fn()} />)

        // Assert that the title is rendered correctly
        expect(getByText('1/4: Le commencement...')).toBeInTheDocument()

        // Assert that the content is rendered correctly
        expect(getByText('Prêt à rendre visible votre consommation d’électricité ?')).toBeInTheDocument()
        expect(getByText('Allumez votre nrLINK il va vous guider pour son installation ;)')).toBeInTheDocument()

        expect(getByText('Terminé ?')).toBeInTheDocument()

        expect(getByText("C'est fait !")).toBeInTheDocument()
    })

    test('calls onNext when button is clicked', () => {
        const onNextMock = jest.fn()
        const { getByText } = reduxedRender(<NrLinkInstallationInstructions onNext={onNextMock} />)

        // Simulate a click on the button
        getByText("C'est fait !").click()

        // Assert that onNext is called
        expect(onNextMock).toHaveBeenCalled()
    })
})
