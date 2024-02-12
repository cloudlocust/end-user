import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractEstimation from 'src/modules/User/AlpiqSubscription/ContractEstimation'

describe('Test ContractEstimation', () => {
    test('component shows correctly', async () => {
        const { getByText } = reduxedRender(<ContractEstimation />)
        expect(getByText('Calculer la mensualité de mon contrat BôWatts par alpiq')).toBeInTheDocument()
        expect(getByText('Estimer ma mensualité')).toBeInTheDocument()
        expect(getByText('Mensualité calculée à partir de votre historique de consommation.')).toBeInTheDocument()
        expect(getByText('Type de contrat')).toBeInTheDocument()
        expect(getByText('Puissance')).toBeInTheDocument()
    })
})
