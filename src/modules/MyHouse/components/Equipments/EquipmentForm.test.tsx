import { fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentForm } from 'src/modules/MyHouse/components/Equipments/EquipmentForm'
import { IMeter } from 'src/modules/Meters/Meters'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import { TEST_HOUSING_EQUIPMENTS as MOCK_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IEquipmentMeter } from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
import userEvent from '@testing-library/user-event'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

const TEST_METER_EQUIPMENTS = applyCamelCase(MOCK_EQUIPMENTS)
const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockHouseId = TEST_MOCKED_HOUSES[0].id
let mockIsLoadingInProgress = false
let mockIsEquipmentMeterListEmpty = false
const mockSaveEquipment = jest.fn()
const mockLoadEquipmentList = jest.fn()
let mockMeterList: IMeter[] | null = TEST_METERS
let mockEquipmentList: IEquipmentMeter[] | null = TEST_METER_EQUIPMENTS
const MODIFIER_BUTTON_TEXT = 'Modifier'
const SANITARY_INFO_TEXT = 'Eau chaude sanitaire :'
const HEATER_TEXT = 'Type de chauffage :'
const EQUIPMENT_INFO_TEXT = 'Informations Equipements'
const HOTPLATE_INFO_TEXT = 'Type de plaques de cuisson :'
const INDUCTION_VALUE_TEXT = 'Induction'
const DISABLED_CLASS = 'Mui-disabled'
const ANNULER_BUTTON_TEXT = 'Annuler'
const ENREGISTRER_BUTTON_TEXT = 'Enregistrer'
const mockEnqueueSnackbar = jest.fn()

/**
 * Mocking the useSnackbar used in EquipmentForm.
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
jest.mock('src/modules/MyHouse/components/Equipments/equipmentHooks', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Equipments/equipmentHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEquipmentList: () => ({
        loadEquipmentList: mockLoadEquipmentList,
        loadingEquipmentInProgress: mockIsLoadingInProgress,
        saveEquipment: mockSaveEquipment,
        equipmentList: mockEquipmentList,
        isEquipmentMeterListEmpty: mockIsEquipmentMeterListEmpty,
    }),
}))
// Mock metersHook
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterList: () => ({
        elementList: mockMeterList,
    }),
}))
/**
 * Mocking the useParams used in "equipmentForm" to get the house id based on url /houses/:houseId/equipements {houseId} params.
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

describe('Test EquipmentForm', () => {
    test('When equipmentForm mount, with equipmentMeterList form should be disabled, clicking on Modifier form should not be disabled', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm />
            </BrowserRouter>,
        )
        expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeTruthy()
        expect(getByText(HEATER_TEXT)).toBeTruthy()
        expect(getByText(SANITARY_INFO_TEXT)).toBeTruthy()
        expect(getByText(EQUIPMENT_INFO_TEXT)).toBeTruthy()
        expect(getByText(HOTPLATE_INFO_TEXT)).toBeTruthy()
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        userEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeFalsy()
        })
        expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    })

    test('When submitting data, saveEquipment data should be changed and saveEquipment should be called', async () => {
        const { getAllByText, getByText } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm />
            </BrowserRouter>,
        )
        userEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        await act(async () => {
            fireEvent.click(getAllByText('Eléctricité')[0])
            fireEvent.click(getByText('Induction'))
        })
        await waitFor(async () => {
            expect(getAllByText('Eléctricité')[0].getAttribute('value')).toBe('electricity')
            expect(getByText('Induction').getAttribute('value')).toBe('induction')
        })
        await waitFor(() => {
            expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        })
        userEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockSaveEquipment).toHaveBeenCalledWith([
                { equipmentId: 1, equipmentType: 'electricity', equipmentNumber: 0 },
                { equipmentId: 3, equipmentType: 'induction', equipmentNumber: 0 },
            ])
        })
    })

    test('When clicking on Cancel Edit it should disableEdit', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm />
            </BrowserRouter>,
        )
        expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeTruthy()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        userEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        })
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
        userEvent.click(getByText(ANNULER_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        })
        expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeTruthy()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
    })
    test('When equipmentForm mount, and empty equipmentMeterList form should not be disabled', async () => {
        mockIsEquipmentMeterListEmpty = true
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm />
            </BrowserRouter>,
        )
        expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeFalsy()
        expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    })
    test('When loading equipmentList, Circular progress should be shown', async () => {
        mockIsLoadingInProgress = true
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm />
            </BrowserRouter>,
        )
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
    })
})
