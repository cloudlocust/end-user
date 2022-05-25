import { fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentForm } from 'src/modules/MyHouse/components/Equipments/EquipmentForm'
import { IMeter } from 'src/modules/Meters/Meters'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import { TEST_EQUIPMENTS as MOCK_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IEquipment } from 'src/modules/MyHouse/components/Equipments/EquipmentsType'

const TEST_EQUIPMENTS = applyCamelCase(MOCK_EQUIPMENTS)

let mockIsLoadingInProgress = false
const mockSaveEquipment = jest.fn()
const mockLoadEquipmentList = jest.fn()
let mockMeterList: IMeter[] | null = TEST_METERS
let mockEquipmentList: IEquipment[] | null = TEST_EQUIPMENTS
const MODIFIER_BUTTON_TEXT = 'Modifier'
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

describe('Test EquipmentForm', () => {
    test('When equipmentForm mount form should be disabled, clicking on Modifier form should not be disabled', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm meterId={TEST_METERS[0].id} />
            </BrowserRouter>,
        )
        expect(getByText(INDUCTION_VALUE_TEXT).classList.contains(DISABLED_CLASS)).toBeTruthy()
        expect(getByText(HEATER_TEXT)).toBeTruthy()
        expect(getByText(EQUIPMENT_INFO_TEXT)).toBeTruthy()
        expect(getByText(HOTPLATE_INFO_TEXT)).toBeTruthy()
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
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
                <EquipmentForm meterId={TEST_METERS[0].id} />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
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
        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(mockSaveEquipment).toHaveBeenCalledWith([
                { equipmentId: 1, equipmentType: 'electricity' },
                { equipmentId: 2, equipmentType: 'induction' },
            ])
        })
    })
    test('When loading equipmentList, Circular progress should be shown', async () => {
        mockIsLoadingInProgress = true
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm meterId={TEST_METERS[0].id} />
            </BrowserRouter>,
        )
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
    })
})
