import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { ChangePassword } from './ChangePassword'

const mockUpdatePassword = jest.fn()
const CHANGE_PASSWORD = 'Changer mon mot de passe'

jest.mock('src/modules/User/ResetPassword/hooks', () => ({
    ...jest.requireActual('src/modules/User/ResetPassword/hooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useProfileManagement: () => ({
        isChangePasswordInProgress: false,
        updatePassword: mockUpdatePassword,
    }),
}))

describe('RestPasswordForm component test', () => {
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
})
