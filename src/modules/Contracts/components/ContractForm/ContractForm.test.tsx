import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractForm from 'src/modules/Contracts/components/ContractForm'
import userEvent from '@testing-library/user-event'
import { fireEvent, screen } from '@testing-library/react'
import { ContractFormProps } from 'src/modules/Contracts/contractsTypes'

const PROVIDER_LABEL_TEXT = 'Fournisseur'
const OFFER_LABEL_TEXT = 'Offre'
const TARRIF_TYPE_LABEL_TEXT = 'Type de contrat'
const POWER_LABEL_TEXT = 'Puissance'
const START_SUBSCRIPTION_LABEL_TEXT = 'Date de début'
const END_SUBSCRIPTION_LABEL_TEXT = 'Date de fin'
const CONTRACT_FORM_FIELDS_LABELS = [
    PROVIDER_LABEL_TEXT,
    OFFER_LABEL_TEXT,
    TARRIF_TYPE_LABEL_TEXT,
    POWER_LABEL_TEXT,
    START_SUBSCRIPTION_LABEL_TEXT,
    END_SUBSCRIPTION_LABEL_TEXT,
]

/**
 * Function that asserts that contract form fields are hidden, when previous field is not selected.
 *
 * @param LABELS Unselected Fields.
 * @param getByLabelText Get All By Text jest function.
 */
const LabelsNotToBeInDocument = (LABELS: string[], getByLabelText: any) => {
    LABELS.forEach((label) => {
        expect(() => getByLabelText(label, { exact: true })).toThrow()
    })
}
/**
 * Function that select first option in all select.
 *
 * @param getAllByRole Get All By Text jest function.
 */
const selectFirstOption = (getAllByRole: any) => {
    userEvent.click(getAllByRole('option')[0])
}
const LoadingIndicatorClass = '.MuiLoadingButton-loadingIndicator'

/**
 * Mock for ContractForm props.
 */
const mockContractFormProps: ContractFormProps = {
    onSubmit: jest.fn(),
    isContractsLoading: false,
}

describe('Test ContractForm Component', () => {
    test('Different fields should show according to the previous one', async () => {
        const { getByText, getByLabelText, getAllByRole } = reduxedRender(<ContractForm {...mockContractFormProps} />)

        // Initially on Provider is shown
        expect(getByLabelText(PROVIDER_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByLabelText)

        // When selecting provider, offer is shown
        userEvent.click(getByLabelText(PROVIDER_LABEL_TEXT))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(OFFER_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting offer, tariffType is shown
        userEvent.click(getByLabelText(OFFER_LABEL_TEXT))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(TARRIF_TYPE_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting tariffType, power is shown
        userEvent.click(getByLabelText(TARRIF_TYPE_LABEL_TEXT))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(POWER_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting power, startSubscription is shown
        userEvent.click(getByLabelText(POWER_LABEL_TEXT))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)
    }, 30000)

    test('When isContractLoadingInProgress spinner should be shown', async () => {
        mockContractFormProps.isContractsLoading = true
        const { container } = reduxedRender(<ContractForm {...mockContractFormProps} />)

        expect(container.querySelector(LoadingIndicatorClass)).toBeInTheDocument()
    })
})
