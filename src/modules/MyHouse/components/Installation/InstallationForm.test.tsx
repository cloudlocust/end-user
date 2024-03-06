// import { fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { InstallationTab } from 'src/modules/MyHouse/components/Installation/InstallationForm'
import { TEST_HOUSING_EQUIPMENTS, TEST_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IEquipmentMeter, equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType.d'
// import userEvent from '@testing-library/user-event'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
let mockHouseId = TEST_MOCKED_HOUSES[0].id
let mockIsLoadingInProgress = false
let mockIsEquipmentMeterListEmpty = false
const mockSaveEquipment = jest.fn()
const mockLoadEquipmentList = jest.fn()
let mockEquipmentList: equipmentType[] | null = applyCamelCase(TEST_EQUIPMENTS)
let mockHousingEquipmentList: IEquipmentMeter[] | null = applyCamelCase(TEST_HOUSING_EQUIPMENTS)
const MODIFIER_BUTTON_TEXT = 'Enregistrer mes modification'
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
// const DISABLED_CLASS = 'Mui-disabled'
const mockEnqueueSnackbar = jest.fn()

/**
 * Mocking the useSnackbar used in InstallationForm.
 */
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
jest.mock('src/modules/MyHouse/components/Installation/installationHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Installation/installationHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEquipmentList: () => ({
        loadEquipmentList: mockLoadEquipmentList,
        loadingEquipmentInProgress: mockIsLoadingInProgress,
        saveEquipment: mockSaveEquipment,
        equipmentList: mockEquipmentList,
        housingEquipmentsList: mockHousingEquipmentList,
        isEquipmentMeterListEmpty: mockIsEquipmentMeterListEmpty,
    }),
}))

/**
 * Mocking the useParams used in "InstallationForm" to get the house id based on url /houses/:houseId/equipements {houseId} params.
 */
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

describe('Test InstallationForm', () => {
    test("should render 'InstallationForm' correctly", async () => {
        const { getByText, getAllByText } = reduxedRender(
            <BrowserRouter>
                <InstallationTab />
            </BrowserRouter>,
        )

        expect(getByText(HOUSING_POWER_USE_TITLE_TEXT)).toBeTruthy()
        expect(getByText(HEATER_TEXT)).toBeTruthy()
        expect(getByText(SANITARY_INFO_TEXT)).toBeTruthy()
        expect(getByText(HOTPLATE_INFO_TEXT)).toBeTruthy()
        expect(getAllByText(COLLECTIF_VALUE_TEXT)).toHaveLength(2)
        expect(getAllByText(ELECTRIQUE_INDIVIDUEL_VALUE_TEXT)).toHaveLength(2)
        expect(getAllByText(AUTRE_VALUE_TEXT)).toHaveLength(3)
        expect(getByText(INDUCTION_VALUE_TEXT)).toBeTruthy()
        expect(getByText(ELECTRIQUE_FONTE_VALUE_TEXT)).toBeTruthy()
        expect(getByText(VITROCERAMIQUE_VALUE_TEXT)).toBeTruthy()
        expect(getByText(POWER_PRODUCTION_TITLE_TEXT)).toBeTruthy()
        expect(getByText(SOLAR_PANEL_TEXT)).toBeTruthy()
        expect(getByText(YES_VALUE_TEXT)).toBeTruthy()
        expect(getByText(NO_VALUE_TEXT)).toBeTruthy()
        expect(getByText(POSSIBLY_VALUE_TEXT)).toBeTruthy()
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
    })

    // test('When equipmentForm mount, with equipmentMeterList form should be disabled, clicking on Modifier form should not be disabled', async () => {
    //     const { getByText } = reduxedRender(
    //         <BrowserRouter>
    //             <EquipmentForm />
    //         </BrowserRouter>,
    //     )
    //     expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeTruthy()
    //     expect(getByText(HEATER_TEXT)).toBeTruthy()
    //     expect(getByText(SANITARY_INFO_TEXT)).toBeTruthy()
    //     expect(getByText(HOTPLATE_INFO_TEXT)).toBeTruthy()
    //     expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
    //     expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
    //     expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
    //     userEvent.click(getByText(MODIFIER_BUTTON_TEXT))
    //     await waitFor(() => {
    //         expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeFalsy()
    //     })
    //     expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
    //     expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
    //     expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    // })

    // test('When submitting data, saveEquipment data should be changed and saveEquipment should be called', async () => {
    //     const { getByText, getAllByText } = reduxedRender(
    //         <BrowserRouter>
    //             <EquipmentForm />
    //         </BrowserRouter>,
    //     )
    //     userEvent.click(getByText(MODIFIER_BUTTON_TEXT))
    //     await act(async () => {
    //         fireEvent.click(getAllByText('Collectif')[0])
    //         fireEvent.click(getByText('Induction'))
    //     })
    //     await waitFor(async () => {
    //         expect(getAllByText('Collectif')[0].getAttribute('value')).toBe('collective')
    //         expect(getByText('Induction').getAttribute('value')).toBe('induction')
    //     })
    //     await waitFor(() => {
    //         expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
    //     })
    //     userEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
    //     await waitFor(() => {
    //         expect(mockSaveEquipment).toHaveBeenCalledWith([
    //             { equipmentId: 1, equipmentType: 'collective', equipmentNumber: 0 },
    //             { equipmentId: 3, equipmentType: 'induction', equipmentNumber: 0 },
    //             { equipmentId: 14, equipmentType: 'existant' },
    //         ])
    //     })
    // })

    // test('When clicking on Cancel Edit it should disableEdit', async () => {
    //     const { getByText } = reduxedRender(
    //         <BrowserRouter>
    //             <EquipmentForm />
    //         </BrowserRouter>,
    //     )
    //     expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeTruthy()
    //     expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
    //     expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
    //     userEvent.click(getByText(MODIFIER_BUTTON_TEXT))
    //     await waitFor(() => {
    //         expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
    //     })
    //     expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    //     userEvent.click(getByText(ANNULER_BUTTON_TEXT))
    //     await waitFor(() => {
    //         expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
    //     })
    //     expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeTruthy()
    //     expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
    //     expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
    // })
    // test('When equipmentForm mount, and empty equipmentMeterList form should not be disabled', async () => {
    //     mockIsEquipmentMeterListEmpty = true
    //     const { getByText } = reduxedRender(
    //         <BrowserRouter>
    //             <EquipmentForm />
    //         </BrowserRouter>,
    //     )
    //     expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeFalsy()
    //     expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
    //     expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
    //     expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    // })
    test('When loading equipmentList, Circular progress should be shown', async () => {
        mockIsLoadingInProgress = true
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <InstallationTab />
            </BrowserRouter>,
        )
        expect(getByRole('progressbar')).toBeInTheDocument()
    })
})
