import { fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_SUCCESS_USER as MOCK_TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { ProfileManagementForm } from 'src/modules/User/ProfileManagement/ProfileManagementForm'
import { applyCamelCase } from 'src/common/react-platform-components'

let mockIsModifyInProgress = false
const mockUpdateProfile = jest.fn()
const MODIFIER_BUTTON_TEXT = 'Modifier'
const DISABLED_CLASS = 'Mui-disabled'
const INPUT_DISABLED_ELEMENT = `input.${DISABLED_CLASS}`
const ANNULER_BUTTON_TEXT = 'Annuler'
const ENREGISTRER_BUTTON_TEXT = 'Enregistrer'
const PRENOM_INPUT = 'Prénom'
const CHANGED_FIRSTNAME_INPUT = 'Bob'
const TEST_SUCCESS_USER = applyCamelCase(MOCK_TEST_SUCCESS_USER)

jest.mock('src/modules/User/ProfileManagement/ProfileManagementHooks', () => ({
    ...jest.requireActual('src/modules/User/ProfileManagement/ProfileManagementHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useProfileManagement: () => ({
        isModifyInProgress: mockIsModifyInProgress,
        updateProfile: mockUpdateProfile,
    }),
}))

describe('Test ProfileManagementForm', () => {
    test('When clicking on Modifier form should not be disabled, and modifier should be disabled', async () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <ProfileManagementForm />
            </BrowserRouter>,
        )
        // Modifier button
        expect(container.querySelectorAll(INPUT_DISABLED_ELEMENT)!.length).toBe(6)
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()

        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })

        await waitFor(() => {
            expect(container.querySelectorAll(INPUT_DISABLED_ELEMENT)!.length).toBe(0)
        })
        expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    })
    test('All fields are required to be filled', async () => {
        const { getAllByText, getByText } = reduxedRender(
            <BrowserRouter>
                <ProfileManagementForm />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        })

        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(getAllByText('Champ obligatoire non renseigné').length).toBe(5)
        })
        expect(mockUpdateProfile).not.toHaveBeenCalled()
    })

    test('When clicking on Annuler Modification form should reset change, and disableEditForm called', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <ProfileManagementForm />
            </BrowserRouter>,
            {
                initialState: { userModel: { user: TEST_SUCCESS_USER } },
            },
        )
        const firstNameInput = getByRole('textbox', { name: PRENOM_INPUT }) as HTMLInputElement
        act(() => {
            fireEvent.input(firstNameInput, { target: { value: CHANGED_FIRSTNAME_INPUT } })
        })
        expect(firstNameInput.value).toBe(CHANGED_FIRSTNAME_INPUT)
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        })
        act(() => {
            fireEvent.click(getByText(ANNULER_BUTTON_TEXT))
        })
        // Form is reset ( Values did not Change ).
        await waitFor(() => {
            expect(firstNameInput.value).toBe(TEST_SUCCESS_USER.firstName)
        })
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
    })
    test('When clicking on Enregistrer Modification updateInstaller, it should disable edit mode', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <ProfileManagementForm />
            </BrowserRouter>,
            {
                initialState: { userModel: { user: TEST_SUCCESS_USER } },
            },
        )
        const firstNameInput = getByRole('textbox', { name: PRENOM_INPUT }) as HTMLInputElement
        act(() => {
            fireEvent.input(firstNameInput, { target: { value: CHANGED_FIRSTNAME_INPUT } })
        })
        expect(firstNameInput.value).toBe(CHANGED_FIRSTNAME_INPUT)
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        })
        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalledWith({
                firstName: CHANGED_FIRSTNAME_INPUT,
                lastName: TEST_SUCCESS_USER.lastName,
                email: TEST_SUCCESS_USER.email,
                phone: TEST_SUCCESS_USER.phone,
                address: TEST_SUCCESS_USER.address,
            })
        })
    })
})
