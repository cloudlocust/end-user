import { reduxedRender } from 'src/common/react-platform-components/test'
import SgeConsentStep from 'src/modules/User/AlpiqSubscription/SgeConsentStep'
import userEvent from '@testing-library/user-event'

const BACK_TEXT = 'Retour'
const SGE_POPUP_BUTTON_TEXT = 'Récupérer mes données'
const mockHandleBack = jest.fn()
const mockSgeConsentStepProps = {
    handleBack: mockHandleBack,
}

describe('Test SgeConsentStepProps', () => {
    test('component shows correctly', async () => {
        const { getByText } = reduxedRender(<SgeConsentStep {...mockSgeConsentStepProps} />)
        expect(getByText('Intégrons votre historique de consommation à votre espace personnel')).toBeInTheDocument()
        expect(
            getByText(
                'Pour afficher vos consommations passées dans votre espace personnel, nous avons besoins que vous activiez la récupération de votre historique :',
            ),
        ).toBeInTheDocument()
        expect(
            getByText(
                '* Pas d’inquiétude, vos données restent entre vous et nous, elles ne seront jamais transmises à des tiers.',
            ),
        ).toBeInTheDocument()
        expect(getByText(BACK_TEXT)).toBeInTheDocument()
        expect(getByText(SGE_POPUP_BUTTON_TEXT)).toBeInTheDocument()
    })
    test('Going back when clicking on button', async () => {
        const { getByText } = reduxedRender(<SgeConsentStep {...mockSgeConsentStepProps} />)
        userEvent.click(getByText(BACK_TEXT))
        expect(mockHandleBack).toBeCalledTimes(1)
    })
    // TODO - ADD TEST FOR WHEN SGE SUCCESSFULL, NEXT FUNCTION IS CALLED
})
