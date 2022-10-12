import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractCard from 'src/modules/Contracts/components/ContractCard'
import { TEST_CONTRACTS as MOCK_CONTRACTS } from 'src/mocks/handlers/contracts'
import userEvent from '@testing-library/user-event'
import { ConfirmProvider } from 'material-ui-confirm'
import { fireEvent, waitFor } from '@testing-library/react'
import {
    ContractCardProps,
    ContractFormProps,
    IContract,
    loadContractResponse,
} from 'src/modules/Contracts/contractsTypes'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { formatLoadContractResponseToIContract } from 'src/modules/Contracts/utils/contractsFunctions'
import {
    TEST_CONTRACT_TYPES,
    TEST_OFFERS,
    TEST_POWERS,
    TEST_PROVIDERS,
    TEST_TARIFF_TYPES,
} from 'src/mocks/handlers/commercialOffer'

const TEST_CONTRACTS: IContract[] = applyCamelCase(MOCK_CONTRACTS).map((contract: loadContractResponse) =>
    formatLoadContractResponseToIContract(contract),
)
const DELETE_CONTRACT_WARNING_MESSAGE =
    'Vous êtes sur le point de supprimer un contrat. Ëtes-vous sûr de vouloir continuer ?'
const CONFIRM_BUTTON_TEXT = 'Continuer'
const CANCEL_BUTTON_TEXT = 'Annuler'
const DELETE_ICON_DATA_TESTID = 'DeleteIcon'
const circularProgressClassname = '.MuiCircularProgress-root'
let mockIsContractsLoading = false
let mockRemoveElementDetails = jest.fn()
let mockEditElementDetails = jest.fn()
const mockHouseId = TEST_HOUSE_ID
const CONTRACT_FORM_MODAL_TEXT = 'Contrat de fourniture'
const EDIT_CONTRACT_BUTTON_DATA_TESTID = 'EditIcon'
const SUBMIT_CONTRACT_FORM_BUTTON_TEXT = 'Enregistrer'

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
        editElementDetails: mockEditElementDetails,
    }),
}))

let mockContractTypeList = TEST_CONTRACT_TYPES
let mockOfferList = TEST_OFFERS
let mockProviderList = TEST_PROVIDERS
let mockPowerList = TEST_POWERS
let mockTariffTypeList = TEST_TARIFF_TYPES
const mockLoadContractTypes = jest.fn()
const mockLoadPowers = jest.fn()
const mockLoadProviders = jest.fn()
const mockLoadOffers = jest.fn()
const mockLoadTariffTypes = jest.fn()

/**
 * Mocking the useCommercialOffer.
 */
jest.mock('src/hooks/CommercialOffer/CommercialOfferHooks', () => ({
    ...jest.requireActual('src/hooks/CommercialOffer/CommercialOfferHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useCommercialOffer: () => ({
        contractTypeList: mockContractTypeList,
        offerList: mockOfferList,
        loadOffers: mockLoadOffers,
        providerList: mockProviderList,
        powerList: mockPowerList,
        tariffTypeList: mockTariffTypeList,
        loadContractTypes: mockLoadContractTypes,
        loadPowers: mockLoadPowers,
        loadProviders: mockLoadProviders,
        loadTariffTypes: mockLoadTariffTypes,
        isContractTypesLoading: false,
        isOffersLoading: false,
        isPowersLoading: false,
        isProvidersLoading: false,
        isTariffTypesLoading: false,
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

    test('When Clicking on editContract, modal contractForm should be open, and when cancel it should close', async () => {
        const { getAllByRole, getByText, getByTestId } = reduxedRender(<ContractCard {...mockContractCardProps} />)
        expect(() => getByText(CONTRACT_FORM_MODAL_TEXT)).toThrow()
        userEvent.click(getByTestId(EDIT_CONTRACT_BUTTON_DATA_TESTID))
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
        mockIsContractsLoading = true
        const mockOnAfterDeleteUpdateSuccess = jest.fn()
        mockContractCardProps.onAfterDeleteUpdateSuccess = mockOnAfterDeleteUpdateSuccess
        const { getByText, getByTestId } = reduxedRender(<ContractCard {...mockContractCardProps} />)

        // Open Modal
        expect(() => getByText(CONTRACT_FORM_MODAL_TEXT)).toThrow()
        userEvent.click(getByTestId(EDIT_CONTRACT_BUTTON_DATA_TESTID))
        await waitFor(() => {
            expect(getByText(CONTRACT_FORM_MODAL_TEXT)).toBeTruthy()
        })

        // Click on Modify
        userEvent.click(getByText(SUBMIT_CONTRACT_FORM_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockOnAfterDeleteUpdateSuccess).toHaveBeenCalled()
        })
        expect(mockEditElementDetails).toHaveBeenCalled()
        // Contract Form should be closed
        await waitFor(() => {
            expect(() => getByText(CONTRACT_FORM_MODAL_TEXT)).toThrow()
        })
    })
})
