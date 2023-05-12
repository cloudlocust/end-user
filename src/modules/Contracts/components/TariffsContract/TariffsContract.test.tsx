import { Form } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_TARIFFS_CONTRACT } from 'src/mocks/handlers/commercialOffer'
import TariffsContract from 'src/modules/Contracts/components/TariffsContract'
import { tariffContract } from 'src/modules/Contracts/contractsTypes'

const LoadingIndicatorClass = '.MuiCircularProgress-root'

const TARIFFS_SUBSCRIPTION_TEXT = 'abonnement: 36 €/mois'
const TARIFFS_KWH_PRICE_TEXT = 'prix kwh: 0.125 €/kWh'
const NO_TARIFFS_MESSAGE = 'Aucun tarif disponible'

let mockTariffs: tariffContract[] | null = TEST_TARIFFS_CONTRACT
let mockIsTariffsLoading = false

jest.mock('src/hooks/CommercialOffer/CommercialOfferHooks', () => ({
    ...jest.requireActual('src/hooks/CommercialOffer/CommercialOfferHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useCommercialOffer: () => ({
        tariffs: mockTariffs,
        setTariffs: jest.fn(),
        loadTariffsHousingContract: jest.fn(),
        isTariffsLoading: mockIsTariffsLoading,
    }),
}))

describe('Test TariffsContract Component', () => {
    test('When tariffs is not empty, it should be shown correctly', async () => {
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <TariffsContract />
            </Form>,
        )
        expect(getByText(TARIFFS_SUBSCRIPTION_TEXT)).toBeInTheDocument()
        expect(getByText(TARIFFS_KWH_PRICE_TEXT)).toBeInTheDocument()
    })

    test('When IsTariffsLoading is true, the spinner should be shown', async () => {
        mockIsTariffsLoading = true
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <TariffsContract />
            </Form>,
        )
        expect(container.querySelector(LoadingIndicatorClass)).toBeInTheDocument()
    })

    test('When tariffs is null, nothing is shown', async () => {
        mockIsTariffsLoading = false
        mockTariffs = null
        const { queryByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <TariffsContract />
            </Form>,
        )
        expect(queryByText(TARIFFS_SUBSCRIPTION_TEXT)).not.toBeInTheDocument()
        expect(queryByText(TARIFFS_KWH_PRICE_TEXT)).not.toBeInTheDocument()
    })

    test('When tariffs is empty, an error message is shown', async () => {
        mockTariffs = []
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <TariffsContract />
            </Form>,
        )
        expect(getByText(NO_TARIFFS_MESSAGE)).toBeInTheDocument()
    })
})
