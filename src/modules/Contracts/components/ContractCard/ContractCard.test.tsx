import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractCard from 'src/modules/Contracts/components/ContractCard'
import { TEST_CONTRACTS } from 'src/mocks/handlers/contracts'
import userEvent from '@testing-library/user-event'
import { ConfirmProvider } from 'material-ui-confirm'
import { waitFor } from '@testing-library/react'
import { ContractCardProps } from 'src/modules/Contracts/contractsTypes'

const DELETE_CONTRACT_WARNING_MESSAGE =
    'Vous êtes sur le point de supprimer un contrat. Ëtes-vous sûr de vouloir continuer ?'
const CONFIRM_BUTTON_TEXT = 'Continuer'
const CANCEL_BUTTON_TEXT = 'Annuler'
const DELETE_ICON_DATA_TESTID = 'DeleteIcon'
const circularProgressClassname = '.MuiCircularProgress-root'
let mockIsContractsLoading = false
let mockRemoveElementDetails = jest.fn()

/**
 * Mock for ContractCard props.
 */
const mockContractCardProps: ContractCardProps = {
    contract: TEST_CONTRACTS[0],
}

/**
 * Mocking the useContractDetails.
 */
jest.mock('src/modules/Contracts/contractsHook', () => ({
    ...jest.requireActual('src/modules/Contracts/contractsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useContractDetails: () => ({
        loadingInProgress: mockIsContractsLoading,
        removeElementDetails: mockRemoveElementDetails,
    }),
}))

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

    test('When on Confirm of warning popup, removeContractDetails should be called and onAfterDeleteUpdateSucces.', async () => {
        const mockOnAfterDeleteUpdateSuccess = jest.fn()
        mockContractCardProps.onAfterDeleteUpdateSuccess = mockOnAfterDeleteUpdateSuccess
        const { getByText, getByTestId } = reduxedRender(
            <ConfirmProvider>
                <ContractCard {...mockContractCardProps} />
            </ConfirmProvider>,
        )

        const deleteButton = getByTestId(DELETE_ICON_DATA_TESTID)!.parentElement!
        userEvent.click(deleteButton)
        userEvent.click(getByText(CONFIRM_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockRemoveElementDetails).toHaveBeenCalled()
        })
        expect(mockOnAfterDeleteUpdateSuccess).toHaveBeenCalled()
    })
    test('When isContractLoadingInProgress spinner should be shown', async () => {
        mockIsContractsLoading = true
        const { container, getByTestId } = reduxedRender(
            <ConfirmProvider>
                <ContractCard {...mockContractCardProps} />
            </ConfirmProvider>,
        )

        expect(() => getByTestId(DELETE_ICON_DATA_TESTID)).toThrow()
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
