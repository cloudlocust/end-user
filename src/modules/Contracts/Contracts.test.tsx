import { reduxedRender } from 'src/common/react-platform-components/test'
import Contracts from 'src/modules/Contracts'
import { BrowserRouter as Router } from 'react-router-dom'
import { TEST_CONTRACTS as MOCK_CONTRACTS, TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { applyCamelCase } from 'src/common/react-platform-components'
import { fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const TEST_CONTRACTS = applyCamelCase(MOCK_CONTRACTS)
const EMPTY_CONTRACT_LIST_MESSAGE_TEXT =
    "Aucun contrat enregistré. Les valeurs de votre consommation exprimées en Euros proviennent d'un contrat EDF Tarif Bleu Base d'une puissance de 6kVA donnée à titre exemple."
const mockHouseId = TEST_HOUSE_ID
let mockIsContractsLoading = false
let mockContractList = [TEST_CONTRACTS[0]]
const CONTRACT_PROVIDER_TEXT = TEST_CONTRACTS[0].provider
const CONTRACT_OTHER_INFO_TEXT = `${TEST_CONTRACTS[0].offer} - ${TEST_CONTRACTS[0].tariffType} - ${TEST_CONTRACTS[0].power} kVA`
const circularProgressClassname = '.MuiCircularProgress-root'
const CONTRACT_FORM_MODAL_TEXT = 'Contrat de fourniture'
const ADD_CONTRACT_BUTTON_DATA_TESTID = 'PostAddIcon'

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
        reloadElements: jest.fn(),
    }),
}))

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
})
