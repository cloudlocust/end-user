import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractCard from 'src/modules/Contracts/components/ContractCard'
import { BrowserRouter as Router } from 'react-router-dom'
import { TEST_CONTRACTS, TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import userEvent from '@testing-library/user-event'
import { ConfirmProvider } from 'material-ui-confirm'

const DELETE_CONTRACT_WARNING_MESSAGE =
    'Vous êtes sur le point de supprimer un contrat. Ëtes-vous sûr de vouloir continuer ?'
const mockHouseId = TEST_HOUSE_ID
let mockIsContractsLoading = false
const CONTRACT_PROVIDER_TEXT = TEST_CONTRACTS[0].provider
const CONTRACT_OTHER_INFO_TEXT = `${TEST_CONTRACTS[0].offer} - ${TEST_CONTRACTS[0].type} - ${TEST_CONTRACTS[0].power}`
const DELETE_ICON_DATA_TESTID = 'DeleteIcon'
const circularProgressClassname = '.MuiCircularProgress-root'

/**
 * Mock for ContractCard props.
 */
const mockContractCardProps = {
    contract: TEST_CONTRACTS[0],
}

/**
 * Mocking the useContractList.
 */
// jest.mock('src/modules/Contracts/contractsHook', () => ({
// ...jest.requireActual('src/modules/Contracts/contractsHook'),
// eslint-disable-next-line jsdoc/require-jsdoc
// useContractList: () => ({
// elementList: mockContractList,
// loadingInProgress: mockIsContractsLoading,
// }),
// }))

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
        expect(getByText('qsf')).toBeTruthy()
    })
})
