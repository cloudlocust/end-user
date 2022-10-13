import { reduxedRender } from 'src/common/react-platform-components/test'
import Contracts from 'src/modules/Contracts'
import { BrowserRouter as Router } from 'react-router-dom'
import { TEST_CONTRACTS as MOCK_CONTRACTS, TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { applyCamelCase } from 'src/common/react-platform-components'
import { fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContractFormProps } from './contractsTypes'
import { formatLoadContractResponseToIContract } from 'src/modules/Contracts/utils/contractsFunctions'
import { IContract, loadContractResponse } from 'src/modules/Contracts/contractsTypes'

const TEST_CONTRACTS: IContract[] = applyCamelCase(MOCK_CONTRACTS).map((contract: loadContractResponse) =>
    formatLoadContractResponseToIContract(contract),
)
const EMPTY_CONTRACT_LIST_MESSAGE_TEXT =
    "Aucun contrat enregistré. Les valeurs de votre consommation exprimées en Euros proviennent d'un contrat EDF Tarif Bleu Base d'une puissance de 6kVA donnée à titre exemple."
const mockHouseId = TEST_HOUSE_ID
let mockIsContractsLoading = false
let mockReloadContractList = jest.fn()
let mockAddContract = jest.fn()
let mockContractList = [TEST_CONTRACTS[0]]
const CONTRACT_PROVIDER_TEXT = TEST_CONTRACTS[0].provider.name
const CONTRACT_OTHER_INFO_TEXT = `${TEST_CONTRACTS[0].offer.name} - ${TEST_CONTRACTS[0].tariffType.name} - ${TEST_CONTRACTS[0].power} kVA`
const circularProgressClassname = '.MuiCircularProgress-root'
const CONTRACT_FORM_MODAL_TEXT = 'Contrat de fourniture'
const ADD_CONTRACT_BUTTON_DATA_TESTID = 'PostAddIcon'
const SUBMIT_CONTRACT_FORM_BUTTON_TEXT = 'Enregistrer'

/**
 * Mocking the react-router-dom for houseId in useParams.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams to get the houseId from url.
     *
     * @returns UseParams containing houseId.
     */
    useParams: () => ({
        houseId: `${mockHouseId}`,
    }),
}))

/**
 * Mocking the useContractList.
 */
jest.mock('src/modules/Contracts/contractsHook', () => ({
    ...jest.requireActual('src/modules/Contracts/contractsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useContractList: () => ({
        elementList: mockContractList,
        loadingInProgress: mockIsContractsLoading,
        reloadElements: mockReloadContractList,
        addElement: mockAddContract,
    }),
}))

// Mocking ContractForm, so that we don't have to do the selection to test the onSubmit.

jest.mock('src/modules/Contracts/components/ContractForm', () => (props: ContractFormProps) => {
    return (
        <form
            onSubmit={() =>
                props.onSubmit({
                    contractTypeId: 2,
                    endSubscription: '',
                    offerId: 2,
                    power: 2,
                    startSubscription: '',
                    tariffTypeId: 3,
                })
            }
        >
            <h1>{CONTRACT_FORM_MODAL_TEXT}</h1>
            <input name="test" value="test" />
            <button type="submit">Enregistrer</button>
        </form>
    )
})

describe('Test Contracts Component', () => {
    test('When contractList is valid.', async () => {
        const { getByText, container } = reduxedRender(
            <Router>
                <Contracts />
            </Router>,
        )

        expect(container.getElementsByTagName('a')[0].href).toContain(`${URL_MY_HOUSE}/${mockHouseId}`)
        expect(getByText(CONTRACT_PROVIDER_TEXT)).toBeTruthy()
        expect(getByText(CONTRACT_OTHER_INFO_TEXT)).toBeTruthy()
    })

    test('when isContractsLoading, Spinner is shown', async () => {
        mockIsContractsLoading = true
        const { container } = reduxedRender(
            <Router>
                <Contracts />
            </Router>,
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
    test('when contractList empty, Error message is shown is shown', async () => {
        mockIsContractsLoading = false
        mockContractList = []
        const { getByText } = reduxedRender(
            <Router>
                <Contracts />
            </Router>,
        )
        expect(getByText(EMPTY_CONTRACT_LIST_MESSAGE_TEXT)).toBeInTheDocument()
    })
    test('When Clicking on addContract, modal contractForm should be open, and when cancel it should close', async () => {
        mockIsContractsLoading = false
        mockContractList = TEST_CONTRACTS
        const { getAllByRole, getByText, getByTestId } = reduxedRender(
            <Router>
                <Contracts />
            </Router>,
        )
        expect(() => getByText(CONTRACT_FORM_MODAL_TEXT)).toThrow()
        userEvent.click(getByTestId(ADD_CONTRACT_BUTTON_DATA_TESTID))
        await waitFor(() => {
            expect(getByText(CONTRACT_FORM_MODAL_TEXT)).toBeTruthy()
        })
        // Click on the backdrop
        fireEvent.click(getAllByRole('presentation')[0].firstChild as HTMLDivElement)
        await waitFor(() => {
            expect(() => getByText(CONTRACT_FORM_MODAL_TEXT)).toThrow()
        })
    })

    test('When Submitting ContractForm, addContract and loadContract hook functions should be called, and modal should be closed', async () => {
        const { getByText, getByTestId } = reduxedRender(
            <Router>
                <Contracts />
            </Router>,
        )
        // OPEN MODAL
        userEvent.click(getByTestId(ADD_CONTRACT_BUTTON_DATA_TESTID))
        await waitFor(() => {
            expect(getByText(CONTRACT_FORM_MODAL_TEXT)).toBeTruthy()
        })
        // Mock ContractForm
        userEvent.click(getByText(SUBMIT_CONTRACT_FORM_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockReloadContractList).toHaveBeenCalled()
        })
        expect(mockAddContract).toHaveBeenCalled()
        // Modal should be closed
        await waitFor(() => {
            expect(() => getByText(CONTRACT_FORM_MODAL_TEXT)).toThrow()
        })
    })
})
