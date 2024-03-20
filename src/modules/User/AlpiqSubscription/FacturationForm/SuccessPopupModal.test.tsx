import { reduxedRender } from 'src/common/react-platform-components/test'
import { SuccessPopupModal } from 'src/modules/User/AlpiqSubscription/FacturationForm/SuccessPopupModal'
import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'

const mockOnClickNext = jest.fn()

describe('SuccessPopupModal', () => {
    test('renders without crashing', () => {
        const { getByText } = reduxedRender(<SuccessPopupModal modalOpen={true} onClickNext={mockOnClickNext} />)

        expect(getByText("L'électricité verte du beaujolais")).toBeInTheDocument()
        expect(
            getByText("Notre équipe BôWatts | Alpiq s'occupe de la mise en service de votre nouvel abonnement."),
        ).toBeInTheDocument()

        expect(
            getByText('Vous allez prochainement recevoir par email toutes les informations pour :'),
        ).toBeInTheDocument()

        expect(getByText('► récupérer votre nrLINK pour faire des économies')).toBeInTheDocument()

        expect(
            getByText('► accéder à votre plateforme BôWatts pour vous permettre de suivre vos consommations'),
        ).toBeInTheDocument()

        expect(
            getByText(
                '► créer votre compte client chez Alpiq pour suivre la mise en route de votre contrat et télécharger vos futures factures',
            ),
        ).toBeInTheDocument()

        expect(getByText("C'EST LE DÉBUT D'UNE BELLE AVENTURE !")).toBeInTheDocument()

        expect(getByText('Accéder à la plateforme BôWatts')).toBeInTheDocument()
    })
    test('OnClick acceder a la plateforme bowatts', () => {
        const { getByText } = reduxedRender(<SuccessPopupModal modalOpen={true} onClickNext={mockOnClickNext} />)

        act(() => {
            fireEvent.click(getByText('Accéder à la plateforme BôWatts'))
        })

        expect(mockOnClickNext).toHaveBeenCalled()
    })
})
