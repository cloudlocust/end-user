import { reduxedRender } from 'src/common/react-platform-components/test'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Contract } from 'src/modules/Onboarding/steps/Contract'
import { ContractProps } from 'src/modules/Onboarding/steps/Contract/Contract.types'
import { TEST_DATETIME } from 'src/mocks/handlers/contracts'
import { TEST_OFFERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_PROVIDERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_CONTRACT_TYPES } from 'src/mocks/handlers/commercialOffer'
import { ContractFormProps } from 'src/modules/Contracts/contractsTypes'

let mockReloadContractList = jest.fn()
const mockHandleNext = jest.fn()
let mockIsContractsLoading = false
const mockContractsList = [
    {
        id: 1,
        commercialOffer: { ...TEST_OFFERS[0], provider: TEST_PROVIDERS[0] },
        tariffType: { name: 'Jour Tempo', id: 1 },
        contractType: TEST_CONTRACT_TYPES[0],
        power: 6,
        startSubscription: TEST_DATETIME,
    },
]

let mockAddContract = jest.fn()

/**
 * Mocking the useContractList.
 */
jest.mock('src/modules/Contracts/contractsHook', () => ({
    ...jest.requireActual('src/modules/Contracts/contractsHook'),
    /**
     * Mock useContractList hook.
     *
     * @returns Mocked contract list.
     */
    useContractList: () => ({
        elementList: mockContractsList,
        loadingInProgress: mockIsContractsLoading,
        reloadElements: mockReloadContractList,
        addElement: mockAddContract,
    }),
}))

// Mocking ContractForm, so that we don't have to do the selection to test the onSubmit.
jest.mock('src/modules/Contracts/components/ContractForm', () => (props: ContractFormProps) => {
    return (
        <form
            id="contract-form"
            onSubmit={() =>
                props.onSubmit({
                    contractTypeId: '' as unknown as number,
                    endSubscription: '',
                    offerId: '' as unknown as number,
                    power: '' as unknown as number,
                    startSubscription: '',
                    tariffTypeId: '' as unknown as number,
                })
            }
        >
            <input name="test" value="test" />
        </form>
    )
})

const mockContractProps: ContractProps = {
    housingId: 123,
    onNext: mockHandleNext,
}

describe('Contract', () => {
    test('should render the component', () => {
        const { getByText, getByRole } = reduxedRender(
            <Router>
                <Contract {...mockContractProps} />
            </Router>,
        )
        expect(getByText('4/4: L’électricité... c’est de l’argent !')).toBeInTheDocument()
        expect(getByText('Pour afficher votre consommation en € choisissez votre contrat :')).toBeInTheDocument()
        expect(
            getByText(
                'Toutes les informations nécessaires sont disponibles sur votre facture ou votre contrat d’électricité.',
            ),
        ).toBeInTheDocument()
        expect(getByRole('button', { name: 'Suivant' })).toBeInTheDocument()
        // todo: to enable later when the button is enabled
        // expect(getByRole('button', { name: 'Mon contrat n’est pas dans la liste' })).toBeInTheDocument()
    })

    test('When we click on "Suivant", addContract and loadContract hook functions should be called, and onNext should be called', async () => {
        const { getByRole, container } = reduxedRender(
            <Router>
                <Contract {...mockContractProps} />
            </Router>,
        )

        fireEvent.click(getByRole('button', { name: 'Suivant' }))

        screen.debug(container)
        await waitFor(() => {
            expect(mockAddContract).toHaveBeenCalled()
            expect(mockHandleNext).toHaveBeenCalled()
        })
    })
})
