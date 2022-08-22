import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractCard from 'src/modules/Contracts/components/ContractCard'
import { TEST_CONTRACTS as MOCK_CONTRACTS } from 'src/mocks/handlers/contracts'
import userEvent from '@testing-library/user-event'
import { ConfirmProvider } from 'material-ui-confirm'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'

const TEST_CONTRACTS = applyCamelCase(MOCK_CONTRACTS)
const DELETE_CONTRACT_WARNING_MESSAGE =
    'Vous êtes sur le point de supprimer un contrat. Ëtes-vous sûr de vouloir continuer ?'
const CONFIRM_BUTTON_TEXT = 'Continuer'
const CANCEL_BUTTON_TEXT = 'Annuler'
const DELETE_ICON_DATA_TESTID = 'DeleteIcon'
const mockHouseId = TEST_HOUSE_ID

/**
 * Mocking the react-router-dom used in contractsHooks.
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
 * Mock for ContractCard props.
 */
const mockContractCardProps = {
    contract: TEST_CONTRACTS[0],
}

describe('Test ContractCard Component', () => {
    test('When clicking on delete icon warning popup opens.', async () => {
        const { getByText, getByTestId } = reduxedRender(
            <ConfirmProvider>
                <ContractCard {...mockContractCardProps} />
            </ConfirmProvider>,
        )

        const deleteButton = getByTestId(DELETE_ICON_DATA_TESTID)!.parentElement!
        userEvent.click(deleteButton)
        expect(getByText(DELETE_CONTRACT_WARNING_MESSAGE)).toBeTruthy()
        expect(getByText(CONFIRM_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(CANCEL_BUTTON_TEXT)).toBeTruthy()
    })
})
