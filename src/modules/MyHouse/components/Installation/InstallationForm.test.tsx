import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { InstallationTab, SOLAR_PANEL_TYPES } from 'src/modules/MyHouse/components/Installation/InstallationForm'
import { applyCamelCase } from 'src/common/react-platform-components'
import { installationInfosType } from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { TEST_NEW_INSTALLATION } from 'src/mocks/handlers/installation'

/**
 * Mocking the useParams used in "InstallationForm" to get the house id based on url /houses/:houseId/equipements {houseId} params.
 */
const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
let mockHouseId = TEST_MOCKED_HOUSES[0].id

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the react-router useParams hooks.
     *
     * @returns The react-router useParams hook.
     */
    useParams: () => ({
        houseId: mockHouseId,
    }),
}))

/**
 * Mocking the useSnackbar used in InstallationForm.
 */
const mockEnqueueSnackbar = jest.fn()

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    /**
     * Mock the notistack useSnackbar hooks.
     *
     * @returns The notistack useSnackbar hook.
     */
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

/**
 * Mocking the useEquipmentList and useInstallation hooks.
 */
const CAMEL_CASED_TEST_INSTALLATION = applyCamelCase(TEST_NEW_INSTALLATION)
let mockIsEquipmentMeterListEmpty = false
let mockInstallationInfos: installationInfosType = CAMEL_CASED_TEST_INSTALLATION
let mockGetInstallationInfosInProgress = false
let mockAddUpdateInstallationInfosInProgress = false
let mockGetInstallationInfos = jest.fn()
let mockAddUpdateInstallationInfos = jest.fn()

jest.mock('src/modules/MyHouse/components/Installation/installationHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Installation/installationHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEquipmentList: () => ({
        isEquipmentMeterListEmpty: mockIsEquipmentMeterListEmpty,
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useInstallation: () => ({
        installationInfos: mockInstallationInfos,
        getInstallationInfosInProgress: mockGetInstallationInfosInProgress,
        addUpdateInstallationInfosInProgress: mockAddUpdateInstallationInfosInProgress,
        getInstallationInfos: mockGetInstallationInfos,
        addUpdateInstallationInfos: mockAddUpdateInstallationInfos,
    }),
}))

const HOUSING_POWER_USE_TITLE_TEXT = "Utilisation de l'énergie dans mon domicile"
const HEATER_TEXT = 'Type de chauffage :'
const SANITARY_INFO_TEXT = 'Eau chaude sanitaire :'
const HOTPLATE_INFO_TEXT = 'Type de plaques de cuisson :'
const COLLECTIF_VALUE_TEXT = 'Collectif'
const ELECTRIQUE_INDIVIDUEL_VALUE_TEXT = 'Individuel Electrique'
const AUTRE_VALUE_TEXT = 'Autre'
const INDUCTION_VALUE_TEXT = 'Induction'
const ELECTRIQUE_FONTE_VALUE_TEXT = 'Électrique (fonte)'
const VITROCERAMIQUE_VALUE_TEXT = 'Vitrocéramique'
const POWER_PRODUCTION_TITLE_TEXT = "Ma production d'énergie"
const SOLAR_PANEL_TEXT = 'Je dispose de panneaux solaires :'
const YES_VALUE_TEXT = 'Oui'
const NO_VALUE_TEXT = 'Non'
const POSSIBLY_VALUE_TEXT = "J'y pense"
const TITLE_FIELD_TEXT = 'Titre :'
const INSTALLATION_DATE_FIELD_TEXT = 'Date d’installation :'
const SOLAR_PANEL_TYPE_FIELD_TEXT = 'Type de panneaux :'
const ORIENTATION_FIELD_TEXT = 'Orientation :'
const POWER_FIELD_TEXT = 'Puissance (W) :'
const INVERTER_BRAND_FIELD_TEXT = 'Marque de l’onduleur :'
const INCLINATION_FIELD_TEXT = 'Inclinaison (%) :'
const HAS_RESALE_CONTRACT_FIELD_TEXT = 'Avez-vous un contrat de revente :'
const RESALE_TARIFF_FIELD_TEXT = 'Tarif de revente (€) :'
const RESALE_TARIFF_NOTE_TEXT =
    '*avec cette information, nous pourrons bientôt vous permettre de voir votre production en euros.'
const STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_1 = 'J’ai déjà des devis, je n’ai besoin de rien'
const STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_2 =
    'Je souhaite être mis en relation avec un partenaire de confiance nrLINK'
const SAVE_AND_MODIFY_BUTTON_TEXT = 'Enregistrer mes modification'

describe('Test InstallationForm', () => {
    beforeEach(() => {
        mockInstallationInfos = CAMEL_CASED_TEST_INSTALLATION
        mockGetInstallationInfosInProgress = false
        mockAddUpdateInstallationInfosInProgress = false
    })

    test("should render 'InstallationForm' correctly when solarpanel type is nonexistant", async () => {
        const { getByText, getAllByText, queryByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <InstallationTab />
            </BrowserRouter>,
        )

        expect(getByText(HOUSING_POWER_USE_TITLE_TEXT)).toBeInTheDocument()
        expect(getByText(HEATER_TEXT)).toBeInTheDocument()
        expect(getByText(SANITARY_INFO_TEXT)).toBeInTheDocument()
        expect(getByText(HOTPLATE_INFO_TEXT)).toBeInTheDocument()
        expect(getAllByText(COLLECTIF_VALUE_TEXT)).toHaveLength(2)
        expect(getAllByText(ELECTRIQUE_INDIVIDUEL_VALUE_TEXT)).toHaveLength(2)
        expect(getAllByText(AUTRE_VALUE_TEXT)).toHaveLength(3)
        expect(getByText(INDUCTION_VALUE_TEXT)).toBeInTheDocument()
        expect(getByText(ELECTRIQUE_FONTE_VALUE_TEXT)).toBeInTheDocument()
        expect(getByText(VITROCERAMIQUE_VALUE_TEXT)).toBeInTheDocument()
        expect(getByText(POWER_PRODUCTION_TITLE_TEXT)).toBeInTheDocument()
        expect(getByText(SOLAR_PANEL_TEXT)).toBeInTheDocument()
        expect(getByText(YES_VALUE_TEXT)).toBeInTheDocument()
        expect(getByText(NO_VALUE_TEXT)).toBeInTheDocument()
        expect(getByText(POSSIBLY_VALUE_TEXT)).toBeInTheDocument()
        expect(queryByText(TITLE_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(INSTALLATION_DATE_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(SOLAR_PANEL_TYPE_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(ORIENTATION_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(POWER_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(INVERTER_BRAND_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(INCLINATION_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(HAS_RESALE_CONTRACT_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(RESALE_TARIFF_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(RESALE_TARIFF_NOTE_TEXT)).not.toBeInTheDocument()
        expect(queryByText(STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_1)).not.toBeInTheDocument()
        expect(queryByText(STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_2)).not.toBeInTheDocument()
        const saveButton = getByRole('button', { name: SAVE_AND_MODIFY_BUTTON_TEXT })
        expect(saveButton).toBeInTheDocument()
        expect(saveButton).toBeDisabled()
    })

    test("should render 'InstallationForm' correctly when solarpanel type is existant", async () => {
        mockInstallationInfos.housingEquipments.find((equipment) => equipment.equipmentId === 14)!.equipmentType =
            'existant'
        mockInstallationInfos.solarInstallation = {
            solarPanelType: SOLAR_PANEL_TYPES.onRoof,
            hasResaleContract: true,
        }
        const { getByText, queryByText } = reduxedRender(
            <BrowserRouter>
                <InstallationTab />
            </BrowserRouter>,
        )

        expect(getByText(TITLE_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(INSTALLATION_DATE_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(SOLAR_PANEL_TYPE_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(ORIENTATION_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(POWER_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(INVERTER_BRAND_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(INCLINATION_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(HAS_RESALE_CONTRACT_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(RESALE_TARIFF_FIELD_TEXT)).toBeInTheDocument()
        expect(getByText(RESALE_TARIFF_NOTE_TEXT)).toBeInTheDocument()
        expect(queryByText(STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_1)).not.toBeInTheDocument()
        expect(queryByText(STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_2)).not.toBeInTheDocument()
    })

    test("should render 'InstallationForm' correctly when solarpanel type is maybe", async () => {
        mockInstallationInfos.housingEquipments.find((equipment) => equipment.equipmentId === 14)!.equipmentType =
            'possibly'
        const { getByText, queryByText } = reduxedRender(
            <BrowserRouter>
                <InstallationTab />
            </BrowserRouter>,
        )

        expect(getByText(STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_1)).toBeInTheDocument()
        expect(getByText(STATUS_WHEN_WANTING_SOLAR_PANEL_VALUE_2)).toBeInTheDocument()
        expect(queryByText(TITLE_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(INSTALLATION_DATE_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(SOLAR_PANEL_TYPE_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(ORIENTATION_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(POWER_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(INVERTER_BRAND_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(INCLINATION_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(HAS_RESALE_CONTRACT_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(RESALE_TARIFF_FIELD_TEXT)).not.toBeInTheDocument()
        expect(queryByText(RESALE_TARIFF_NOTE_TEXT)).not.toBeInTheDocument()
    })

    test('should call the function addUpdateInstallationInfos when clicking on the save button', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <InstallationTab />
            </BrowserRouter>,
        )

        const saveButton = getByRole('button', { name: SAVE_AND_MODIFY_BUTTON_TEXT })
        expect(saveButton).toBeDisabled()
        // Change the solar panel type to enable the save button
        userEvent.click(getByText(POSSIBLY_VALUE_TEXT))
        await waitFor(async () => {
            expect(saveButton).toBeEnabled()
            // Click on the save button
            userEvent.click(saveButton)
            await waitFor(() => {
                expect(mockAddUpdateInstallationInfos).toHaveBeenCalledTimes(1)
            })
        })
    })

    test('When getting installationInfos is in progress, Circular progress should be shown', async () => {
        mockGetInstallationInfosInProgress = true
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <InstallationTab />
            </BrowserRouter>,
        )
        expect(getByRole('progressbar')).toBeInTheDocument()
    })
})
