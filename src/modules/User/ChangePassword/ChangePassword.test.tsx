import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { ChangePassword } from 'src/modules/User/ChangePassword/ChangePassword'
import { within } from '@testing-library/react'

let mockIsUpdateInProgress = false
const mockUpdatePassword = jest.fn()
const mockEnqueueSnackbar = jest.fn()
const POPUP_TITLE = 'Changer mon mot de passe'
const INVALID_PASSWORD_FIELD_ERROR =
    'Votre mot de passe doit contenir au moins 8 caractères dont 1 Maj, 1 min et un caractère spécial'

jest.mock('src/modules/User/ProfileManagement/ProfileManagementHooks', () => ({
    ...jest.requireActual('src/modules/User/ProfileManagement/ProfileManagementHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useProfileManagement: () => ({
        isLoadingInProgress: mockIsUpdateInProgress,
        updatePassword: mockUpdatePassword,
    }),
}))
/**
 * Mocking the useSnackbar used in CustomerDetails to load the customerDetails based on url /customers/:id {id} params.
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
describe('ChangePasswordForm component test', () => {
    test('Check if the dialog window has appeared', async () => {
        const { getByText } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(POPUP_TITLE))
        expect(getByText('Enregistrer')).toBeTruthy()
    })
    test('when password fields are empty, a validator error should appear', async () => {
        const { getByText, getAllByText } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(POPUP_TITLE))
        userEvent.click(getByText('Enregistrer'))

        await waitFor(() => {
            expect(mockUpdatePassword).not.toHaveBeenCalled()
        })
        await waitFor(() => {
            expect(getAllByText('Champ obligatoire non renseigné').length).toBe(2)
        })
    })
    test('when password field is invalid', async () => {
        const { getByText, getByTestId } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(POPUP_TITLE))
        const passwordField = within(getByTestId('password'))
        userEvent.type(passwordField.getByText('Nouveau mot de passe'), '12345678')
        userEvent.click(getByText('Enregistrer'))

        await waitFor(() => {
            expect(mockUpdatePassword).not.toHaveBeenCalled()
        })
        await waitFor(() => {
            expect(getByText(INVALID_PASSWORD_FIELD_ERROR)).toBeTruthy()
        })
    })

    test('popup close when clicking on cancel', async () => {
        const { getByText } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(POPUP_TITLE))
        userEvent.click(getByText('Annuler'))

        await waitFor(() => {
            expect(mockUpdatePassword).not.toHaveBeenCalled()
        })
        await waitFor(() => {
            expect(() => getByText(POPUP_TITLE)).toThrow()
        })
    })
    test('Form filled, mockUpdatePassword to haveBeenCalled with what you filled, and popup close', async () => {
        const { getByText, getByTestId } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(POPUP_TITLE))
        const passwordField = within(getByTestId('password'))
        userEvent.type(passwordField.getByText('Nouveau mot de passe'), 'P@ssword')
        const repeatPwdField = within(getByTestId('repeatPwd'))
        userEvent.type(repeatPwdField.getByText('Confirmer mot de passe'), 'P@ssword')
        userEvent.click(getByText('Enregistrer'))
        await waitFor(() => {
            expect(mockUpdatePassword).toHaveBeenCalledWith('P@ssword')
        })
        await waitFor(() => {
            expect(() => getByText(POPUP_TITLE)).toThrow()
        })
    })
    test('ButtonLoader state when mockIsChangePasswordInProgress true', async () => {
        mockIsUpdateInProgress = true
        const { getByText, getByRole } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(POPUP_TITLE))
        expect(getByRole('progressbar')).toBeTruthy()
    })
})
