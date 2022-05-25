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
const DISABLED_CLASS = 'Mui-disabled'
// const INPUT_DISABLED_ELEMENT = `input.${DISABLED_CLASS}`
const BUTTON_DISABLED_ELEMENT = `button.${DISABLED_CLASS}`
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
jest.mock('src/modules/Profile/components/Equipments/equipmentHooks', () => ({
    ...jest.requireActual('src/modules/Profile/components/Equipments/equipmentHooks'),
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
    test('When clicking on Modifier form should not be disabled', async () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm meterId={TEST_METERS[0].id} />
            </BrowserRouter>,
        )
        expect(container.querySelectorAll(BUTTON_DISABLED_ELEMENT)!.length).not.toBe(0)
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
            expect(container.querySelectorAll(BUTTON_DISABLED_ELEMENT)!.length).toBe(0)
        })
        expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    })

    test('When loading equipmentList, it should be shown in the form', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <EquipmentForm meterId={TEST_METERS[0].id} />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        act(() => {
            fireEvent.click(getByRole('radio', { name: 'Non' }))
        })

        expect(getByRole('radio', { name: 'Non' })).toBeChecked()
        act(() => {
            fireEvent.click(getByRole('radio', { name: 'Oui' }))
        })

        expect(getByRole('radio', { name: 'Oui' })).toBeChecked()
        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
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
            expect(mockSaveEquipment).toHaveBeenCalled()
        })
    })
})
