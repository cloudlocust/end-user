import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractForm from 'src/modules/Contracts/components/ContractForm'
import userEvent from '@testing-library/user-event'
import { ContractFormProps, tariffContract } from 'src/modules/Contracts/contractsTypes'
import {
    TEST_CONTRACT_TYPES,
    TEST_OFFERS,
    TEST_POWERS,
    TEST_PROVIDERS,
    TEST_TARIFFS_CONTRACT,
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
const TYPE_LABEL_TEXT = 'Contrat pro ou particulier *'
const PROVIDER_LABEL_TEXT = 'Fournisseur *'
const OFFER_LABEL_TEXT = 'Offre *'
const TARRIF_TYPE_LABEL_TEXT = 'Type de contrat *'
const POWER_LABEL_TEXT = 'Puissance *'
const OFFPEAK_HOURS_LABEL_TEXT = 'Plages heures creuses :'
const START_SUBSCRIPTION_LABEL_TEXT = 'Date de début'
const END_SUBSCRIPTION_LABEL_TEXT = 'Date de fin (Si terminé)'
const TARIFFS_SUBSCRIPTION_TEXT = 'abonnement: 36 €/mois'
const TARIFFS_KWH_PRICE_TEXT = 'prix kwh: 0.125 €/kWh'
const MUI_DISABLED = 'Mui-disabled'
const CONTRACT_FORM_FIELDS_LABEL_LIST = [
    TYPE_LABEL_TEXT,
    PROVIDER_LABEL_TEXT,
    OFFER_LABEL_TEXT,
    TARRIF_TYPE_LABEL_TEXT,
    POWER_LABEL_TEXT,
    START_SUBSCRIPTION_LABEL_TEXT,
    END_SUBSCRIPTION_LABEL_TEXT,
]

const OTHER_PROVIDER_OFFER_OPTION_MESSAGE =
    "en précisant le fournisseur et l’offre que vous souhaitez voir renseignés. Si vous le pouvez, ajoutez la grille tarifaire correspondante à votre offre. Cela nous permettra de l'enregistrer plus rapidement."
const CONTRACT_FORM_OFFPEAK_HOURS_LABEL_LIST = [
    TYPE_LABEL_TEXT,
    PROVIDER_LABEL_TEXT,
    OFFER_LABEL_TEXT,
    TARRIF_TYPE_LABEL_TEXT,
    OFFPEAK_HOURS_LABEL_TEXT,
    POWER_LABEL_TEXT,
    START_SUBSCRIPTION_LABEL_TEXT,
    END_SUBSCRIPTION_LABEL_TEXT,
]

/**
 * Function that asserts that contract form fields are hidden, when previous field is not selected.
 *
 * @param labels Unselected Fields.
 * @param getByLabelText Get All By Text jest function.
 */
const assertLabelsNotToBeInDocument = (labels: string[], getByLabelText: Function) => {
    labels.forEach((label) => {
        expect(() => getByLabelText(label, { exact: false })).toThrow()
    })
}
/**
 * Function that select first option if optionIndex is not given in the current select form.
 *
 * @param getAllByRole Get All By Text jest function.
 * @param optionIndex Indicates the Index of the option to be selected.
 * @returns Click on the option.
 */
const selectOption = (getAllByRole: Function, optionIndex?: number) => {
    return userEvent.click(getAllByRole('option')[optionIndex || 0])
}

let mockContractTypeList = TEST_CONTRACT_TYPES
let mockOfferList = TEST_OFFERS
let mockProviderList = TEST_PROVIDERS
let mockPowerList = TEST_POWERS
let mockTariffTypeList = TEST_TARIFF_TYPES
let mockMeterDetails = TEST_HOUSES[2].meter
let mockTariffs: tariffContract[] | null = TEST_TARIFFS_CONTRACT
const mockLoadContractTypes = jest.fn()
const mockLoadPowers = jest.fn()
const mockLoadProviders = jest.fn()
const mockLoadOffers = jest.fn()
const mockLoadTariffTypes = jest.fn()
const mockEditMeter = jest.fn()
const mockLoadTariffsHousingContract = jest.fn()

const mockCreateCustomProvider = jest.fn()
let mockIsTariffTypesLoading = false
let mockIsPowersLoading = false
let mockIsProvidersLoading = false
let mockIsOffersLoading = false
let mockIsContractTypesLoading = false
let mockIsMeterLoading = false
let mockIsTariffsLoading = false
const mockHouseId = TEST_HOUSE_ID
let mockManualContractFillingIsEnabled = true

/**
 * Mock for ContractForm props.
 */
const mockContractFormProps: ContractFormProps = {
    onSubmit: jest.fn(),
    isContractsLoading: false,
    houseId: mockHouseId,
}

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
        tariffs: mockTariffs,
        loadContractTypes: mockLoadContractTypes,
        loadPowers: mockLoadPowers,
        loadProviders: mockLoadProviders,
        loadTariffTypes: mockLoadTariffTypes,
        loadTariffsHousingContract: mockLoadTariffsHousingContract,
        setTariffs: jest.fn(),
        isContractTypesLoading: mockIsContractTypesLoading,
        isOffersLoading: mockIsOffersLoading,
        isPowersLoading: mockIsPowersLoading,
        isProvidersLoading: mockIsProvidersLoading,
        isTariffTypesLoading: mockIsTariffTypesLoading,
        isTariffsLoading: mockIsTariffsLoading,
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useCreateCustomProvider: () => ({
        createCustomProvider: mockCreateCustomProvider,
        isCustomProviderCreated: true,
        isCreateCustomProviderLoading: false,
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

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get manualContractFillingIsEnabled() {
        return mockManualContractFillingIsEnabled
    },
}))

let mockHouse = TEST_HOUSES[0]

jest.mock('src/hooks/CurrentHousing', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useCurrentHousing: () => mockHouse,
}))

describe('Test ContractFormSelect Component', () => {
    test('Filling fields should show according to the previous one, and submitting works', async () => {
        const CONTRACT_FORM_FIELDS_LABELS = [...CONTRACT_FORM_FIELDS_LABEL_LIST]
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
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByLabelText)

        // When selecting Type, provider is shown
        userEvent.click(getByLabelText(TYPE_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        CONTRACT_FORM_FIELDS_LABELS.shift()
        expect(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadProviders).toHaveBeenCalled()
        })
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting provider, offer is shown
        userEvent.click(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        expect(getByLabelText(OFFER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadOffers).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting offer, tariffType is shown
        userEvent.click(getByLabelText(OFFER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        expect(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadTariffTypes).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting tariffType, power is shown
        userEvent.click(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        expect(getByLabelText(POWER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadPowers).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting power, startSubscription is shown
        userEvent.click(getByLabelText(POWER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        expect(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting startSubscription, tariffs & endSubscription is shown
        userEvent.click(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT))
        userEvent.click(getByText('1'))
        userEvent.click(getByText('OK'))
        await waitFor(() => {
            expect(() => getByText('OK')).toThrow()
            expect(mockLoadTariffsHousingContract).toHaveBeenCalled()
        })
        expect(getByText(TARIFFS_SUBSCRIPTION_TEXT)).toBeTruthy()
        expect(getByText(TARIFFS_KWH_PRICE_TEXT)).toBeTruthy()

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

    test('When Selecting OtherOffer option, a message is shown and tariffType not shown', async () => {
        const CONTRACT_FORM_FIELDS_LABELS = [...CONTRACT_FORM_FIELDS_LABEL_LIST]

        const { getByText, getByLabelText, getAllByRole } = reduxedRender(<ContractForm {...mockContractFormProps} />)

        // Initially only Type is shown
        expect(getByLabelText(TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        await waitFor(() => {
            expect(mockLoadContractTypes).toHaveBeenCalled()
        })
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByLabelText)

        // When selecting Type, provider is shown
        userEvent.click(getByLabelText(TYPE_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        CONTRACT_FORM_FIELDS_LABELS.shift()
        expect(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadProviders).toHaveBeenCalled()
        })
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting provider, offer is shown
        userEvent.click(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        expect(getByLabelText(OFFER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadOffers).toHaveBeenCalled()
        })
        CONTRACT_FORM_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)

        // When selecting other offer, tariffType is not shown
        userEvent.click(getByLabelText(OFFER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole, TEST_OFFERS.length)
        expect(getByText(OTHER_PROVIDER_OFFER_OPTION_MESSAGE, { exact: false })).toBeTruthy()
        expect(() => getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false })).toThrow()
        await waitFor(() => {
            expect(mockLoadTariffTypes).not.toHaveBeenCalled()
        })
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByText)
    }, 30000)

    test('When Autre fournisseur is selected, the ContractOtherField component is rendered', async () => {
        const CONTRACT_FORM_FIELDS_LABELS = [...CONTRACT_FORM_FIELDS_LABEL_LIST]
        const { getByText, getByLabelText, getAllByRole, getByRole } = reduxedRender(
            <ContractForm {...mockContractFormProps} />,
        )

        // Initially only contact type is shown
        expect(getByLabelText(TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        CONTRACT_FORM_FIELDS_LABELS.shift()
        await waitFor(() => {
            expect(mockLoadContractTypes).toHaveBeenCalled()
        })
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_FIELDS_LABELS, getByLabelText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting contrac type, provider is shown
        userEvent.click(getByLabelText(TYPE_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        CONTRACT_FORM_FIELDS_LABELS.shift()
        expect(getByLabelText(PROVIDER_LABEL_TEXT)).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadProviders).toHaveBeenCalled()
        })

        // Select "Autre fournisseur" option
        userEvent.click(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole, TEST_PROVIDERS.length)

        const OTHER_PROVIDER_TEXTFIELD = getByRole('textbox')

        expect(OTHER_PROVIDER_TEXTFIELD).toBeTruthy()

        userEvent.click(getByText('Créer le fournisseur'))

        userEvent.type(getByLabelText('Votre fournisseur *'), 'custom')

        await waitFor(() => expect(mockCreateCustomProvider).toHaveBeenCalled(), {
            timeout: 6000,
        })
    }, 30000)

    test('Submitting form with offPeakhours', async () => {
        const CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS = [...CONTRACT_FORM_OFFPEAK_HOURS_LABEL_LIST]
        const mockOnSubmit = jest.fn()
        mockContractFormProps.onSubmit = mockOnSubmit
        const { getByText, getByLabelText, getAllByRole } = reduxedRender(<ContractForm {...mockContractFormProps} />)

        // Initially only Type is shown
        expect(getByLabelText(TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS.shift()
        await waitFor(() => {
            expect(mockLoadContractTypes).toHaveBeenCalled()
        })
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS, getByLabelText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting Type, provider is shown
        userEvent.click(getByLabelText(TYPE_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS.shift()
        expect(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadProviders).toHaveBeenCalled()
        })
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS, getByText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting provider, offer is shown
        userEvent.click(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        expect(getByLabelText(OFFER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadOffers).toHaveBeenCalled()
        })
        CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS, getByText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting offer, tariffType is shown
        userEvent.click(getByLabelText(OFFER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole, 1)
        expect(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadTariffTypes).toHaveBeenCalled()
        })
        CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS, getByText)
        expect(() => getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toThrow()

        // When selecting tariffType option offpeakHours, then offpeakHours Field is shown
        userEvent.click(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole, 1)
        await waitFor(() => {
            expect(getByText(OFFPEAK_HOURS_LABEL_TEXT, { exact: false })).toBeTruthy()
        })
        CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS.shift()
        // OffPeak Hours already filled Hours.
        expect(getByLabelText(POWER_LABEL_TEXT, { exact: false })).toBeTruthy()
        await waitFor(() => {
            expect(mockLoadPowers).toHaveBeenCalled()
        })
        CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS, getByText)

        // When selecting power, startSubscription is shown
        userEvent.click(getByLabelText(POWER_LABEL_TEXT, { exact: false }))
        selectOption(getAllByRole)
        expect(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT)).toBeTruthy()
        CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS.shift()
        // Other fields are not shown
        assertLabelsNotToBeInDocument(CONTRACT_FORM_OFFPEAK_HOURS_FIELDS_LABELS, getByText)

        // When selecting startSubscription, tariffs & endSubscription is shown
        userEvent.click(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT))
        userEvent.click(getByText('1'))
        userEvent.click(getByText('OK'))
        await waitFor(() => {
            expect(() => getByText('OK')).toThrow()
            expect(mockLoadTariffsHousingContract).toHaveBeenCalled()
        })
        expect(getByText(TARIFFS_SUBSCRIPTION_TEXT)).toBeTruthy()
        expect(getByText(TARIFFS_KWH_PRICE_TEXT)).toBeTruthy()

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

        await waitFor(
            () => {
                expect(mockOnSubmit).toHaveBeenCalled()
            },
            { timeout: 10000 },
        )
        expect(mockEditMeter).toHaveBeenCalled()
    }, 35000)

    test('When manual contract filling is disabled, all the field are disabled', async () => {
        const mockFilledContractFormProps: ContractFormProps = {
            ...mockContractFormProps,
            defaultValues: {
                contractTypeId: 1,
                endSubscription: '2023-06-12',
                offerId: 1,
                power: 5,
                providerId: 1,
                startSubscription: '2023-06-12',
                tariffTypeId: 1,
            },
        }
        mockManualContractFillingIsEnabled = false
        const { queryByText, getByLabelText } = reduxedRender(<ContractForm {...mockFilledContractFormProps} />)

        // Check that all the fields are disabled
        expect(getByLabelText(TYPE_LABEL_TEXT, { exact: false })).toHaveClass(MUI_DISABLED)
        expect(getByLabelText(PROVIDER_LABEL_TEXT, { exact: false })).toHaveClass(MUI_DISABLED)
        expect(getByLabelText(OFFER_LABEL_TEXT, { exact: false })).toHaveClass(MUI_DISABLED)
        expect(getByLabelText(TARRIF_TYPE_LABEL_TEXT, { exact: false })).toHaveClass(MUI_DISABLED)
        expect(getByLabelText(POWER_LABEL_TEXT, { exact: false })).toHaveClass(MUI_DISABLED)
        expect(getByLabelText(START_SUBSCRIPTION_LABEL_TEXT)).toHaveClass(MUI_DISABLED)
        expect(getByLabelText(END_SUBSCRIPTION_LABEL_TEXT, { exact: true })).toHaveClass(MUI_DISABLED)

        // Check that submit button doesn't be shown.
        expect(queryByText(SUBMIT_BUTTON_TEXT)).not.toBeInTheDocument()
    })
})
