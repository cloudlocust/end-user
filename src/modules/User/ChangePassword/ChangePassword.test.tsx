import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { ChangePassword } from './ChangePassword'
import { within } from '@testing-library/react'

const mockUpdatePassword = jest.fn()
const mockEnqueueSnackbar = jest.fn()
const CHANGE_PASSWORD = 'Changer mon mot de passe'

jest.mock('src/modules/User/ProfileManagement/ProfileManagementHooks', () => ({
    ...jest.requireActual('src/modules/User/ProfileManagement/ProfileManagementHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useProfileManagement: () => ({
        isUpdateInProgress: false,
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
        userEvent.click(getByText(CHANGE_PASSWORD))
        expect(getByText('Enregistrer')).toBeTruthy()
    })
    test('when password fields are empty, a validator error should appear', async () => {
        const { getByText, getAllByText } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(CHANGE_PASSWORD))
        userEvent.click(getByText('Enregistrer'))

        await waitFor(() => {
            expect(mockUpdatePassword).not.toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(getAllByText('Champ obligatoire non renseigné').length).toBe(2)
        })
    })

    test('popup close when clicking on cancel', async () => {
        const { getByText } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(CHANGE_PASSWORD))
        userEvent.click(getByText('Annuler'))

        await waitFor(() => {
            expect(mockUpdatePassword).not.toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(getByText(CHANGE_PASSWORD)).toBeTruthy()
        })
    })
    test('Form filled, mockUpdatePassword to haveBeenCalled with what you filled, and popup close', async () => {
        const { getByText, getByTestId } = reduxedRender(<ChangePassword />)
        userEvent.click(getByText(CHANGE_PASSWORD))
        const passwordField = within(getByTestId('password'))
        userEvent.type(passwordField.getByText('Nouveau mot de passe'), '12345678')
        const repeatPwdField = within(getByTestId('repeatPwd'))
        userEvent.type(repeatPwdField.getByText('Confirmer mot de passe'), '12345678')

        userEvent.click(getByText('Enregistrer'))
        await waitFor(() => {
            expect(mockUpdatePassword).toHaveBeenCalledWith({
                password: '12345678',
                repeatPwd: '12345678',
            })
        })
    })
})
