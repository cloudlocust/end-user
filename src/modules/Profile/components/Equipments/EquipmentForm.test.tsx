import { fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentForm } from 'src/modules/Profile/components/Equipments/EquipmentForm'
import { IMeter } from 'src/modules/Meters/Meters'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import { TEST_EQUIPMENTS as MOCK_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { applyCamelCase } from 'src/common/react-platform-components'

const TEST_EQUIPMENTS = applyCamelCase(MOCK_EQUIPMENTS)

let mockIsLoadingInProgress = false
const mockUpdateAccomodation = jest.fn()
const mockLoadAccomodation = jest.fn()
let mockMeterList: IMeter[] | null = TEST_METERS
let mockEquipmentList: IEquipment[] | null = applyTEST_METERS
const MODIFIER_BUTTON_TEXT = 'Modifier'
const DISABLED_CLASS = 'Mui-disabled'
const INPUT_DISABLED_ELEMENT = `input.${DISABLED_CLASS}`
const BUTTON_DISABLED_ELEMENT = `button.${DISABLED_CLASS}`
const ANNULER_BUTTON_TEXT = 'Annuler'
const ENREGISTRER_BUTTON_TEXT = 'Enregistrer'
const mockEnqueueSnackbar = jest.fn()

/**
 * Mocking the useSnackbar used in AccomodationForm.
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
jest.mock('src/modules/Profile/components/Equipments/equipmentsHooks', () => ({
    ...jest.requireActual('src/modules/Profile/components/Equipments/equipmentsHooks'),
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

describe('Test AccomodationForm', () => {
    test('When clicking on Modifier form should not be disabled', async () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        expect(container.querySelectorAll(INPUT_DISABLED_ELEMENT)!.length).toBe(2)
        expect(container.querySelectorAll(BUTTON_DISABLED_ELEMENT)!.length).toBe(7)
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        act(() => {
            fireEvent.click(getByText('Maison'))
        })
        await waitFor(() => {
            expect(container.querySelectorAll(INPUT_DISABLED_ELEMENT)!.length).toBe(0)
            expect(container.querySelectorAll(BUTTON_DISABLED_ELEMENT)!.length).toBe(0)
        })
        expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    })

    test('When we select the data, after confirmation they are saved in the form', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        await act(async () => {
            fireEvent.click(getByText('Maison'))
            fireEvent.click(getByText('Avant 1950'))
            fireEvent.click(getByText('Secondaire'))
        })
        await waitFor(async () => {
            expect(getByText('Maison').getAttribute('value')).toBe('Maison')
            expect(getByText('Avant 1950').getAttribute('value')).toBe('Avant_1950')
            expect(getByText('Secondaire').getAttribute('value')).toBe('Secondaire')
        })
        await waitFor(() => {
            expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        })
        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(mockUpdateAccomodation).toHaveBeenCalled()
        })
    })
    test('when we click on the radio button, the data changes', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
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
    test('When there is no meter, then we display a snackbar with an error', async () => {
        mockMeterList = []
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(mockUpdateAccomodation).not.toHaveBeenCalled()
        })
        await waitFor(() => {
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Il n'existe pas de meter", { variant: 'error' })
        })
    })
})
