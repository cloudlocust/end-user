import { fireEvent, act, waitFor, findAllByText } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { applyCamelCase } from 'src/common/react-platform-components'
import { AccomodationForm } from './AccomodationForm'
import { TEST_PROFILE_RESPONSE as MOCK_TEST_PROFILE_RESPONSE } from 'src/mocks/handlers/profile'
import { IMeter } from '../Meters/Meters'
import { TEST_METERS } from 'src/mocks/handlers/meters'

let mockIsLoadingInProgress = false
const mockUpdateProfile = jest.fn()
const mockLoadProfile = jest.fn()
let mockMeterList: IMeter[] | null = TEST_METERS
const MODIFIER_BUTTON_TEXT = 'Modifier'
const DISABLED_CLASS = 'Mui-disabled'
const INPUT_DISABLED_ELEMENT = `input.${DISABLED_CLASS}`
const BUTTON_DISABLED_ELEMENT = `button.${DISABLED_CLASS}`
const ANNULER_BUTTON_TEXT = 'Annuler'
const ENREGISTRER_BUTTON_TEXT = 'Enregistrer'
let TEST_PROFILE_RESPONSE = applyCamelCase(MOCK_TEST_PROFILE_RESPONSE)
const mockProfile = TEST_PROFILE_RESPONSE
const MOCK_TEST_PROFILE_ERROR_METER = {
    house_type: 'Appartement',
    house_year: 'Entre_1950_1975',
    residence_type: 'Principale',
    number_of_inhabitants: '4',
    house_area: '64',
}
const TEST_PROFILE_ERROR_METER = applyCamelCase(MOCK_TEST_PROFILE_ERROR_METER)
const mockEnqueueSnackbar = jest.fn()
/**
 * Mocking the useSnackbar used in InstallerDetails to load the customers relevant to an Installeur  based on url /clients?installer_clients_id={id}.
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

jest.mock('src/modules/Profile/ProfileHooks', () => ({
    ...jest.requireActual('src/modules/Profile/ProfileHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useProfile: () => ({
        isLoadingInProgress: mockIsLoadingInProgress,
        updateProfile: mockUpdateProfile,
        profile: mockProfile,
        loadProfile: mockLoadProfile,
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
//
describe('Test AccomodationForm', () => {
    test('When clicking on Modifier form should not be disabled, and modifier should be disabled', async () => {
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

    test('When clicking on Enregistrer Modification updateInstaller, it should disable edit mode', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
            {
                initialState: {},
            },
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
            expect(mockUpdateProfile).toHaveBeenCalled()
        })
    })
    test('select options', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
            {
                initialState: {},
            },
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
    test('meter error', async () => {
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
            expect(mockUpdateProfile).not.toHaveBeenCalled()
        })
        await waitFor(() => {
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Il n'existe pas de meter", { variant: 'error' })
        })
    })
})
