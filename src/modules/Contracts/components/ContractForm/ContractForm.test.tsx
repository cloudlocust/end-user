import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractForm from 'src/modules/Contracts/components/ContractForm'
import userEvent from '@testing-library/user-event'
import { ContractFormProps } from 'src/modules/Contracts/contractsTypes'
import {
    TEST_CONTRACT_TYPES,
    TEST_OFFERS,
    TEST_POWERS,
    TEST_PROVIDERS,
    TEST_TARIFF_TYPES,
} from 'src/mocks/handlers/commercialOffer'
import { waitFor } from '@testing-library/react'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { TEST_HOUSES as MOCK_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

// List of houses to add to the redux state
const TEST_HOUSES: IHousing[] = applyCamelCase(MOCK_HOUSES)

const SUBMIT_BUTTON_TEXT = 'Enregistrer'
const TYPE_LABEL_TEXT = 'Type *'
const PROVIDER_LABEL_TEXT = 'Fournisseur *'
const OFFER_LABEL_TEXT = 'Offre *'
const TARRIF_TYPE_LABEL_TEXT = 'Type de contrat *'
const POWER_LABEL_TEXT = 'Puissance *'
const OFFPEAK_HOURS_LABEL_TEXT = 'Plages heures creuses :'
const START_SUBSCRIPTION_LABEL_TEXT = 'Date de début'
const END_SUBSCRIPTION_LABEL_TEXT = 'Date de fin (Si terminé)'
let CONTRACT_FORM_FIELDS_LABELS = [
    TYPE_LABEL_TEXT,
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
        expect(() => getByLabelText(label, { exact: false })).toThrow()
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

/**
 * Mock for ContractForm props.
 */
const mockContractFormProps: ContractFormProps = {
    onSubmit: jest.fn(),
    isContractsLoading: false,
}

let mockContractTypeList = TEST_CONTRACT_TYPES
let mockOfferList = TEST_OFFERS
let mockProviderList = TEST_PROVIDERS
let mockPowerList = TEST_POWERS
let mockTariffTypeList = TEST_TARIFF_TYPES
let mockMeterDetails = TEST_HOUSES[2].meter
const mockLoadContractTypes = jest.fn()
const mockLoadPowers = jest.fn()
const mockLoadProviders = jest.fn()
const mockLoadOffers = jest.fn()
const mockLoadTariffTypes = jest.fn()
const mockEditMeter = jest.fn()
let mockIsTariffTypesLoading = false
let mockIsPowersLoading = false
let mockIsProvidersLoading = false
let mockIsOffersLoading = false
let mockIsContractTypesLoading = false
let mockIsMeterLoading = false
const mockHouseId = TEST_HOUSE_ID

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
        isContractTypesLoading: mockIsContractTypesLoading,
        isOffersLoading: mockIsOffersLoading,
        isPowersLoading: mockIsPowersLoading,
        isProvidersLoading: mockIsProvidersLoading,
        isTariffTypesLoading: mockIsTariffTypesLoading,
    }),
}))

/**
 * Mocking the metersHook.
 */
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHousingMeterDetails: () => ({
        elementDetails: mockMeterDetails,
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterForHousing: () => ({
        loadingInProgress: mockIsMeterLoading,
        editMeter: mockEditMeter,
    }),
}))

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
describe('Test ContractFormSelect Component', () => {
    test('Filling fields should show according to the previous one, and submitting works', async () => {
        const mockOnSubmit = jest.fn()
        mockContractFormProps.onSubmit = mockOnSubmit
        const { getByText, getByLabelText, getAllByRole } = reduxedRender(<ContractForm {...mockContractFormProps} />)

        // Initially only Type is shown
        expect(getByLabelText(TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        await waitFor(() => {
            expect(mockLoadContractTypes).toHaveBeenCalled()
        })
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByLabelText)

        // When selecting Type, provider is shown
        userEvent.click(getByLabelText(TYPE_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        CONTRACT_FORM_FIELDS_LABELS.shift()
        expect(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadProviders).toHaveBeenCalled()
        })
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting provider, offer is shown
        userEvent.click(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(OFFER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadOffers).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting offer, tariffType is shown
        userEvent.click(getByLabelText(OFFER_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadTariffTypes).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting tariffType, power is shown
        userEvent.click(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(POWER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadPowers).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting power, startSubscription is shown
        userEvent.click(getByLabelText(POWER_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting startSubscription, endSubscription is shown
        userEvent.click(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT))
        userEvent.click(getByText('1'))
        userEvent.click(getByText('OK'))
        await waitFor(() => {
            expect(() => getByText('OK')).toThrow()
        })

        // Fill endSubscription
        userEvent.click(getByLabelText(END_SUBSCRIPTION_LABEL_TEXT, { exact: true }))
        userEvent.click(getByText('1'))
        userEvent.click(getByText('OK'))
        await waitFor(() => {
            expect(() => getByText('OK')).toThrow()
        })
        expect(getByLabelText(END_SUBSCRIPTION_LABEL_TEXT, { exact: true })).toBeTruthy()

        userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

        userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled()
        })
    }, 30000)

    test('Submitting form with offPeakhours', async () => {
        const mockOnSubmit = jest.fn()
        mockContractFormProps.onSubmit = mockOnSubmit
        mockTariffTypeList = [
            {
                id: 2,
                name: 'Heures Pleines / Heures Creuses',
            },
        ]

        const { getByText, getByLabelText, getAllByRole } = reduxedRender(<ContractForm {...mockContractFormProps} />)

        // Initially only Type is shown
        expect(getByLabelText(TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        await waitFor(() => {
            expect(mockLoadContractTypes).toHaveBeenCalled()
        })
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByLabelText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting Type, provider is shown
        userEvent.click(getByLabelText(TYPE_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        CONTRACT_FORM_FIELDS_LABELS.shift()
        expect(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadProviders).toHaveBeenCalled()
        })
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting provider, offer is shown
        userEvent.click(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(OFFER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadOffers).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting offer, tariffType is shown
        userEvent.click(getByLabelText(OFFER_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadTariffTypes).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting tariffType option offpeakHours, then offpeakHours Field is shown
        userEvent.click(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        await waitFor(() => {
            expect(getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toBeTruthy()
        })
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting offPeak Hours.
        expect(getByLabelText(POWER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadPowers).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting power, startSubscription is shown
        userEvent.click(getByLabelText(POWER_LABEL_TEXT, { exact: false }))
        selectFirstOption(getAllByRole)
        expect(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        LabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting startSubscription, endSubscription is shown
        userEvent.click(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT))
        userEvent.click(getByText('1'))
        userEvent.click(getByText('OK'))
        await waitFor(() => {
            expect(() => getByText('OK')).toThrow()
        })

        // Fill endSubscription
        userEvent.click(getByLabelText(END_SUBSCRIPTION_LABEL_TEXT, { exact: true }))
        userEvent.click(getByText('1'))
        userEvent.click(getByText('OK'))
        await waitFor(() => {
            expect(() => getByText('OK')).toThrow()
        })
        expect(getByLabelText(END_SUBSCRIPTION_LABEL_TEXT, { exact: true })).toBeTruthy()

        userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

        userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled()
        })
        expect(mockEditMeter).toHaveBeenCalled()
    }, 30000)
})
