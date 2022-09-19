import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import DeleteProfile from 'src/modules/User/DeleteProfile/DeleteProfile'

const POPUP_BUTTON_ANNULER = 'Annuler'
const POPUP_BUTTON_CONTINUER = 'Continuer'
const ICON_DELETE = 'delete'

describe('Delete profile component test', () => {
    test('Check if the dialog window has appeared', async () => {
        const { getByText } = reduxedRender(<DeleteProfile />)
        userEvent.click(getByText(ICON_DELETE))
        expect(getByText(POPUP_BUTTON_ANNULER)).toBeTruthy()
        expect(getByText(POPUP_BUTTON_CONTINUER)).toBeTruthy()
        userEvent.click(getByText(POPUP_BUTTON_ANNULER))
        await waitFor(() => {
            expect(getByText(ICON_DELETE)).toBeTruthy()
        })
    })
})
