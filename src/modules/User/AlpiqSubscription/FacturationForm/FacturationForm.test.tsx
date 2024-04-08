import { FacturationForm } from 'src/modules/User/AlpiqSubscription/FacturationForm/index'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { addDays, format } from 'date-fns'

let mockFacturationFormProps = {
    handleBack: jest.fn(),
}

const MUI_TEXTFIELD = 'MuiOutlinedInput-input'

describe('Test FacturationForm', () => {
    test('component shows correctly', async () => {
        const { getByText, container } = reduxedRender(<FacturationForm {...mockFacturationFormProps} />)
        expect(getByText('Mode de facturation')).toBeInTheDocument()
        expect(
            getByText(
                'Je paie chaque mois le même montant basé sur mon estimation annuelle. A terme, je reçois une facture de régularisation.',
            ),
        ).toBeInTheDocument()
        expect(
            getByText(
                "Je paie chaque mois le montant réel de ma consommation. Ce montant est généralement plus élevé en hiver qu'en été.",
            ),
        ).toBeInTheDocument()
        expect(getByText('Je souhaite être prélevé le :')).toBeInTheDocument()
        expect(getByText('Adresse de facturation')).toBeInTheDocument()
        expect(getByText('Mon adresse de facturation est différente de celle de mon logement.')).toBeInTheDocument()
        expect(
            getByText(
                "Je demande expressément à Alpiq d'activer mon contrat avant l'expiration de mon délai de rétraction de 14 jours à compter de la souscription du contrat. Si je me rétracte, je serai redevable des frais de l'électricité consommée dans mon logement.",
            ),
        ).toBeInTheDocument()
        expect(getByText('Coordonnées bancaires')).toBeInTheDocument()

        const textFieldMuiElements = container.getElementsByClassName(MUI_TEXTFIELD)
        expect(textFieldMuiElements.length).toBe(7)

        const afterTomorrow = addDays(new Date(), 2) // Get the day after tomorrow
        const formattedAfterTomorrow = format(afterTomorrow, 'dd/MM/yyyy')

        const dateDebutContratInputValue = textFieldMuiElements[3].getAttribute('value') ?? ''
        expect(dateDebutContratInputValue).toBe(formattedAfterTomorrow)

        const ibanInputValue = textFieldMuiElements[4].getAttribute('value') ?? ''
        expect(ibanInputValue).toBe('FR')

        expect(getByText('Retour')).toBeInTheDocument()
        expect(getByText('Souscrire')).toBeInTheDocument()
    })
})
