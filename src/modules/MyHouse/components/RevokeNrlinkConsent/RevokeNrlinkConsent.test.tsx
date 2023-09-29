import { screen, waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { INrlinkConsent } from 'src/modules/Consents/Consents.d'
import { RevokeNrlinkConsent } from 'src/modules/MyHouse/components/RevokeNrlinkConsent'
import { ConfirmProvider } from 'material-ui-confirm'

const nrLinkConsent: INrlinkConsent = {
    meterGuid: 'meterGuid',
    nrlinkConsentState: 'CONNECTED',
    nrlinkGuid: 'nrlinkGuid',
    createdAt: 'createdAt',
}
const revokeNrlinkConsent = jest.fn()
const POPUP_DIALOG_TEXT =
    'Vous êtes sur le point de révoquer votre consentement nrLINK. Êtes-vous sûr de vouloir continuer ?'

describe('RevokeNrlinkConsent', () => {
    test('opens the dialog when the delete button is clicked', async () => {
        reduxedRender(
            <ConfirmProvider>
                <RevokeNrlinkConsent nrLinkConsent={nrLinkConsent} revokeNrlinkConsent={revokeNrlinkConsent} />,
            </ConfirmProvider>,
        )
        const deleteButton = screen.getByRole('button')
        userEvent.click(deleteButton)
        await waitFor(() => {
            expect(screen.getByText(POPUP_DIALOG_TEXT)).toBeInTheDocument()
        })
    })

    test('closes the dialog and call the revokeNrlinkConsent function when the button Continuer is clicked', async () => {
        reduxedRender(
            <ConfirmProvider>
                <RevokeNrlinkConsent nrLinkConsent={nrLinkConsent} revokeNrlinkConsent={revokeNrlinkConsent} />
            </ConfirmProvider>,
        )
        const deleteButton = screen.getByRole('button')
        userEvent.click(deleteButton)
        await waitFor(async () => {
            const continueButton = screen.getByRole('button', { name: 'Continuer' })
            userEvent.click(continueButton)
            await waitFor(() => {
                expect(screen.queryByText(POPUP_DIALOG_TEXT)).toBeNull()
                expect(revokeNrlinkConsent).toHaveBeenCalledTimes(1)
            })
        })
    })
})
